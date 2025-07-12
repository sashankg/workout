import { drizzle, SqliteRemoteDatabase } from "drizzle-orm/sqlite-proxy";
import { sqlite3Worker1Promiser } from "@sqlite.org/sqlite-wasm";
import { MigrationMeta } from "drizzle-orm/migrator";
import arrayBuffer2Hex from "@/util/arrayBuffer2Hex";
import {
  BuildQueryResult,
  DBQueryConfig,
  ExtractTablesWithRelations,
  sql,
} from "drizzle-orm";
import * as Schema from "./schema";

type Worker1<T = "exec" | string> = (command: T, msg: any) => Promise<any>;

declare module "@sqlite.org/sqlite-wasm" {
  export function sqlite3Worker1Promiser(arg: { onready: () => void }): Worker1;
}

async function getMigrations(): Promise<MigrationMeta[]> {
  const journal = (await import("./migrations/meta/_journal.json")).default;
  const encoder = new TextEncoder();
  return Promise.all(
    journal.entries.map(async (journalEntry) => {
      const query: string = (
        await import(`./migrations/${journalEntry.tag}.sql?raw`)
      ).default;
      const result = query.split("--> statement-breakpoint");
      return {
        sql: result,
        bps: journalEntry.breakpoints,
        folderMillis: journalEntry.when,
        hash: arrayBuffer2Hex(
          await crypto.subtle.digest("SHA-256", encoder.encode(query)),
        ),
      };
    }),
  );
}

async function migrate<TSchema extends Record<string, unknown>>(
  db: SqliteRemoteDatabase<TSchema>,
) {
  const migrations = await getMigrations();

  const migrationsTable = "__drizzle_migrations";

  const migrationTableCreate = sql`
		CREATE TABLE IF NOT EXISTS ${sql.identifier(migrationsTable)} (
			id SERIAL PRIMARY KEY,
			hash text NOT NULL,
			created_at numeric
		)
	`;
  await db.run(migrationTableCreate);

  const dbMigrations = await db.values<[number, string, string]>(
    sql`SELECT id, hash, created_at FROM ${sql.identifier(migrationsTable)} ORDER BY created_at DESC LIMIT 1`,
  );

  const lastDbMigration = dbMigrations[0];

  for (const migration of migrations) {
    if (
      !lastDbMigration ||
      Number(lastDbMigration[2])! < migration.folderMillis
    ) {
      for (const stmt of migration.sql) {
        await db.run(sql.raw(stmt));
      }
      await db.run(
        sql`INSERT INTO ${sql.identifier(
          migrationsTable,
        )} ("hash", "created_at") VALUES(${migration.hash}, ${migration.folderMillis})`,
      );
    }
  }
}
export type Database = SqliteRemoteDatabase<typeof Schema>;

type RelationsSchema = ExtractTablesWithRelations<typeof Schema>;

export type DatabaseQuery<
  TTable extends keyof RelationsSchema,
  TConfig extends DBQueryConfig<"many", boolean, RelationsSchema>,
> = BuildQueryResult<RelationsSchema, RelationsSchema[TTable], TConfig>;

export default (async () => {
  console.log("Loading and initializing SQLite3 module...");

  const promiser = await new Promise<Worker1>((resolve) => {
    const _promiser = sqlite3Worker1Promiser({
      onready: () => resolve(_promiser),
    });
  });

  console.log("Done initializing. Running demo...");

  const configResponse = await promiser("config-get", {});
  console.log(
    "Running SQLite3 version",
    configResponse.result.version.libVersion,
  );

  const openResponse = await promiser("open", {
    filename: "file:mydb.sqlite3?vfs=opfs",
  });
  const { dbId } = openResponse;
  console.log(
    "OPFS is available, created persisted database at",
    openResponse.result.filename.replace(/^file:(.*?)\?vfs=opfs$/, "$1"),
    dbId,
  );
  const db = drizzle(
    async (sql, params, method) => {
      const { result } = await promiser("exec", {
        dbId,
        sql,
        bind: params,
        returnValue: "resultRows",
      });
      console.log("Executed SQL:", result.sql, result.bind);
      if (method === "get") {
        return { rows: result.resultRows[0] };
      }
      return { rows: result.resultRows };
    },
    {
      schema: Schema,
    },
  );

  window.db = db;

  await migrate(db);

  return (db);
});

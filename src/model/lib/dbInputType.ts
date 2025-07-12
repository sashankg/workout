import { DbObject } from "../DbObject";

export default function dbInputType<T extends { key?: never } & { [field: string]: z.ZodType }>(schema: DbObject<T>) {
}

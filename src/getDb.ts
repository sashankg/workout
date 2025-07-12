import { IDBPDatabase, openDB } from "idb";
import { Schema } from "./types";
import once from "./util/once";

interface Database extends IDBPDatabase<Schema> {
  add: IDBPDatabase<Schema>['add']
}

export default once(async (): Promise<Database> => {
  return await openDB<Schema>("my-db", 1, {
    upgrade(db) {
      db.createObjectStore('workouts', { keyPath: 'id', autoIncrement: true })
      db.createObjectStore('exercises', { keyPath: 'id', autoIncrement: true })
      db.createObjectStore('sessions', { keyPath: 'id', autoIncrement: true })
    },
  })
})  

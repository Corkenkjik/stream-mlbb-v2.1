import { DatabaseSync } from "node:sqlite";

const db = new DatabaseSync(Deno.cwd() + "/data.sqlite")

export default db

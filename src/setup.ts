import { logger } from "@kinbay/logger"
import db from "#db"
import { schema as gameSchema } from "#game/schema.ts"
import { schema as playerSchema } from "#players/schema.ts"
import { schema as teamSchema } from "#teams/schema.ts"

export async function setup() {
  logger.log("Setting up ...")
  db.exec(gameSchema)
  db.exec(playerSchema)
  db.exec(teamSchema)
}

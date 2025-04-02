import { create, updatePlayerPick } from "#players/repository.ts"
import db from "#db"
import { Player as SourcePlayer } from "../../lib/game/game-source/types.ts"
import { getPlayerIds } from "#teams/repository.ts"
import * as repository from "./repository.ts"

export const addPlayers = (players: SourcePlayer[]) => {
  const results = players.map((player) => {
    const result = create({
      assist: 0,
      death: 0,
      dmgDealt: 0,
      dmgTaken: 0,
      gold: 0,
      kill: 0,
      level: 0,
      items: [],
      name: player.name,
      pick: null,
      rune: null,
      rune1: null,
      rune2: null,
      rune3: null,
      skillid: 0,
    })
    return result.lastInsertRowid as number
  })

  return results
}

export const getPlayerNames = () => {
  const results = db.prepare("SELECT name FROM players").all() as {
    name: string
  }[]
  return results.map((x) => x.name)
}

export const updatePlayerPickState = (data: Map<string, number | null>) => {
  for (const [key, value] of data) {
    updatePlayerPick(key, value)
  }
}

export const getPlayersItems = (side: "blue" | "red") => {
  const playerIds = getPlayerIds(side)
  if (!playerIds) {
    return
  }

  const data = repository.getPlayerItems(playerIds)
  return data
}

export const getPlayersPick = (side: "blue" | "red") => {
  const playerIds = getPlayerIds(side)
  if (!playerIds) {
    return
  }

  const data = repository._getPlayerPicks(playerIds)
  return data
}

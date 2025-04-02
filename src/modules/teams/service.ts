import { create } from "#teams/repository.ts"
import db from "#db"
import { Player } from "#players/repository.ts"

export function addTeams(
  data: { name: string; playerPos: number[]; side: "blue" | "red" },
) {
  create({
    name: data.name || `${data.side} team`,
    player1: data.playerPos[0],
    player2: data.playerPos[1],
    player3: data.playerPos[2],
    player4: data.playerPos[3],
    player5: data.playerPos[4],
    tower: 0,
    score: 0,
    tortoise: 0,
    lord: 0,
    gold: 0,
    blueBuff: 0,
    redBuff: 0,
    side: data.side === "blue" ? 1 : 2,
    bans: "",
  })
}

export const getPlayerPositions = (playerNames: string[]) => {
  const results = playerNames.map((name) => {
    const result = db.prepare("SELECT id FROM players WHERE name = ? LIMIT 1")
      .get(name) as { id: number } | undefined
    return result?.id
  }).filter((x) => x !== undefined)

  return results
}

export const changePlayerPos = (
  ids: number[],
  side: "blue" | "red",
) => {
  db.prepare("UPDATE teams SET player1 = ? WHERE side = ?")
    .run(ids[0], side === "blue" ? 1 : 2)
  db.prepare("UPDATE teams SET player2 = ? WHERE side = ?")
    .run(ids[1], side === "blue" ? 1 : 2)
  db.prepare("UPDATE teams SET player3 = ? WHERE side = ?")
    .run(ids[2], side === "blue" ? 1 : 2)
  db.prepare("UPDATE teams SET player4 = ? WHERE side = ?")
    .run(ids[3], side === "blue" ? 1 : 2)
  db.prepare("UPDATE teams SET player5 = ? WHERE side = ?")
    .run(ids[4], side === "blue" ? 1 : 2)
}

export const getTeamNames = () => {
  const results = db.prepare("SELECT name FROM teams").all() as {
    name: string
  }[]
  return results.map((x) => x.name)
}

export const updateTeamBanState = (
  data: { side: "blue" | "red"; banList: number[] | null },
) => {
  db.prepare("UPDATE teams SET bans = ? WHERE side = ?")
    .run(JSON.stringify(data.banList), data.side === "blue" ? 1 : 2)
}

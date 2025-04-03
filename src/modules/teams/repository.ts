import db from "#db"

export interface Team {
  id?: number
  side: number
  name: string
  player1: number
  player2?: number
  player3?: number
  player4?: number
  player5?: number
  bans: string
  tower: number
  score: number
  tortoise: number
  lord: number
  gold: number
  blueBuff: number
  redBuff: number
}

export function create(payload: Team) {
  db.prepare(
    `INSERT INTO teams (side, name, player1, player2, player3, player4, player5, bans, tower, score, tortoise, lord, gold, blueBuff, redBuff) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  ).run(
    payload.side,
    payload.name,
    payload.player1,
    payload.player2 || 0,
    payload.player3 || 0,
    payload.player4 || 0,
    payload.player5 || 0,
    payload.bans,
    payload.tower,
    payload.score,
    payload.tortoise,
    payload.lord,
    payload.gold,
    payload.blueBuff,
    payload.redBuff,
  )
}

export function updateTeamRealtimeData(
  payload: Pick<Team, "tower" | "score" | "tortoise" | "lord" | "gold">,
  side: "blue" | "red",
) {
  db.prepare(
    "UPDATE teams SET tower = ?, score = ?, tortoise = ?, lord = ?, gold = ? WHERE side = ?",
  )
    .run(
      payload.tower,
      payload.score,
      payload.tortoise,
      payload.lord,
      payload.gold,
      side === "blue" ? 1 : 2,
    )
}

export function updateTeamBuffs(
  { blue, red }: { blue: [number, number]; red: [number, number] },
) {
  db.prepare(
    "UPDATE teams SET blueBuff = ?, redBuff = ? WHERE side = 1",
  ).run(blue[0], blue[1])
  db.prepare(
    "UPDATE teams SET blueBuff = ?, redBuff = ? WHERE side = 2",
  ).run(red[0], red[1])
}

/**
 * Return array of ids of the players
 */
export function getPlayerIds(side: "blue" | "red") {
  const queryResult = db.prepare(
    `SELECT player1, player2, player3, player4, player5 FROM teams WHERE side = ?`,
  ).get(side === "blue" ? 1 : 2) as {
    player1: number
    player2: number
    player3: number
    player4: number
    player5: number
  } | undefined

  if (!queryResult) {
    return
  }

  const ids = Object.values(queryResult).map((v) => {
    if (v === 0) return
    return v
  }).filter((v) => v !== undefined)

  return ids
}

export function getPlayerBans(side: "blue" | "red") {
  const result = db.prepare(`SELECT bans FROM teams WHERE side = ?`).get(
    side === "blue" ? 1 : 2,
  ) as { bans: string } | undefined

  if (!result?.bans) return [] as number[]

  const payload = JSON.parse(result?.bans) as number[]
  return payload
}

export function getTeamData(side: "blue" | "red") {
  const result = db.prepare(
    `SELECT tower, score, tortoise, lord, gold, blueBuff, redBuff FROM teams WHERE side = ?`,
  ).get(
    side === "blue" ? 1 : 2,
  ) as {
    tower: number
    score: number
    tortoise: number
    lord: number
    gold: number
    blueBuff: number
    redBuff: number
  } | undefined

  if (!result) return

  return result
}

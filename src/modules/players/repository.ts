import db from "#db"

export interface Player {
  name: string
  pick: number | null
  kill: number
  death: number
  assist: number
  gold: number
  level: number
  skillid: number
  rune: number | null
  rune1: number | null
  rune2: number | null
  rune3: number | null
  dmgDealt: number
  dmgTaken: number
  items: number[] | null
}

export function create(payload: Player) {
  return db.prepare(
    `INSERT INTO players (name, pick, kill, death, assist, gold, level, skillid, rune, rune1, rune2, rune3, dmgDealt, dmgTaken, items) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  ).run(
    payload.name,
    payload.pick || null,
    payload.kill,
    payload.death,
    payload.assist,
    payload.gold,
    payload.level,
    payload.skillid,
    payload.rune || null,
    payload.rune1 || null,
    payload.rune2 || null,
    payload.rune3 || null,
    payload.dmgDealt,
    payload.dmgTaken,
    JSON.stringify(payload.items),
  )
}

export function updatePlayerPick(name: string, pick: number | null) {
  const result = db.prepare("UPDATE players SET pick = ? WHERE name = ?")
    .run(pick, name)

  return result.lastInsertRowid
}

// rune, vang, kda, equipment, level, heroid

export function updatePlayerPostgame(data: Map<string, Player>) {
  for (const [key, value] of data) {
    db.prepare(`
      UPDATE players 
      SET kill = ?, death = ?, assist = ?, 
      gold = ?, level = ?, 
      rune = ?, rune1 = ?, rune2 = ?, rune3 = ?, 
      dmgDealt = ?, dmgTaken = ?, 
      items = ? 
      WHERE name = ?
    `).run(
      value.kill,
      value.death,
      value.assist,
      value.gold,
      value.level,
      value.rune || null,
      value.rune1 || null,
      value.rune2 || null,
      value.rune3 || null,
      value.dmgDealt,
      value.dmgTaken,
      JSON.stringify(value.items),
      key,
    )
  }
}

export function getPlayerPicks(side: "blue" | "red") {
  const idQueryResult = db.prepare(
    `SELECT player1, player2, player3, player4, player5 FROM teams WHERE side = ?`,
  ).get(
    side === "blue" ? 1 : 2,
  ) as {
    player1: number
    player2: number
    player3: number
    player4: number
    player5: number
  } | undefined
  if (!idQueryResult) return

  const ids = Object.values(idQueryResult).map((v) => {
    if (v === 0) return
    return v
  }).filter((v) => v !== undefined)

  const results = ids.map((id) => {
    const result = db.prepare(`SELECT pick FROM players WHERE id = ?`).get(
      id,
    ) as { pick: number | null}
    return result.pick
  }).filter((x) => x !== null)

  return results

  // if (!result) return []

  // const payload = result as number[]
}

export function getRunes(side: "blue" | "red") {
  const idQueryResult = db.prepare(
    `SELECT player1, player2, player3, player4, player5 FROM teams WHERE side = ?`,
  ).get(
    side === "blue" ? 1 : 2,
  ) as {
    player1: number
    player2: number
    player3: number
    player4: number
    player5: number
  } | undefined
  if (!idQueryResult) return

  const ids = Object.values(idQueryResult).map((v) => {
    if (v === 0) return
    return v
  }).filter((v) => v !== undefined)

  const results = ids.map((id) => {
    const result = db.prepare(`SELECT rune3 FROM players WHERE id = ?`).get(
      id,
    ) as { rune3: number | null }
    return result.rune3
  }).filter((x) => x !== null)

  return results
}

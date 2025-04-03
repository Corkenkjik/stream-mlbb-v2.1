import db from "#db"
import { BattleState } from "../../lib/game/game-source/types.ts"

export interface Game {
  id?: number
  current_banpick?: number
  state: BattleState
  wincamp?: number
  state_timer?: number
  mvp?: string
}

export function create(payload: Game) {
  db.prepare(
    "INSERT INTO game (current_banpick, state, wincamp, state_timer, mvp) VALUES (?, ?, ?, ?, ?)",
  )
    .run(
      payload.current_banpick || null,
      payload.state,
      payload.wincamp || null,
      payload.state_timer || null,
      payload.mvp || null,
    )
}

export function updateTimeLeft(data: number | null) {
  db.prepare("UPDATE game SET state_timer = ? WHERE id = 1").run(data)
}

export function updateGameState(data: BattleState) {
  db.prepare("UPDATE game SET state = ? WHERE id = 1").run(data)
}

export function updateGameTime(data: number | null) {
  db.prepare("UPDATE game SET gametime = ? WHERE id = 1").run(data)
}

export function updatePostgameState(
  data: { mvp: string; wincamp: number; gametime: number },
) {
  db.prepare("UPDATE game SET gametime = ?, mvp = ?, wincamp = ? WHERE id = 1")
    .run(data.gametime, data.mvp, data.wincamp)
}

export function getTimeLeft() {
  const result = db.prepare("SELECT state_timer FROM game WHERE id = 1")
    .get() as {
      state_timer: number
    } | undefined
  return result?.state_timer || ""
}

export function getGameTime() {
  const result = db.prepare("SELECT gametime FROM game WHERE id = 1")
    .get() as {
      gametime: number
    } | undefined
  return result?.gametime || ""
}

// export function getMvpRune() {
//   const result = db.prepare(
//     `SELECT players.rune as rune FROM game JOIN players ON game.mvp = players.name`,
//   ).get() as { rune: number | null } | undefined

//   return result?.rune
// }

export function getMvpData() {
  const result = db.prepare(
    `SELECT players.rune as rune, 
    players.name as name, 
    players.kill as kill, 
    players.death as death, 
    players.assist as assist, 
    players.gold as gold, 
    players.items as items, 
    players.skillid as skillid,
    players.rune3 as rune,
    players.dmgDealt as dmgDealt,
    players.pick as pick,
    players.dmgTaken as dmgTaken
    FROM game 
    JOIN players 
    ON game.mvp = players.name`,
  ).get() as {
    name: string
    rune: number
    kill: number
    death: number
    assist: number
    gold: number
    items: string
    skillid: number
    dmgDealt: number
    dmgTaken: number
    pick: number
  } | undefined

  if (!result) return

  return { ...result, items: JSON.parse(result.items) as number[] }
}

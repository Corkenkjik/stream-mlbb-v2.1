import db from "#db"
import { BattleState } from "../../lib/game/game-source/types.ts"
import { formatSeconds } from "#helper/fmt.ts"
import * as repository from "./repository.ts"

export const updateGameBanPickState = (
  data: { state: BattleState; side?: "blue" | "red"; timeLeft: number | null },
) => {
  try {
    db.prepare(
      "INSERT INTO game (id, state, state_timer, current_banpick) VALUES (1, ?, ?, ?)",
    )
      .run(
        data.state,
        data.timeLeft,
        data.side === "blue" ? 1 : data.side === "red" ? 2 : null,
      )
  } catch (error) {
    if (error instanceof Error) {
      db.prepare(
        "UPDATE game SET state = ?, state_timer = ?, current_banpick = ? WHERE id = 1",
      )
        .run(
          data.state,
          data.timeLeft,
          data.side === "blue" ? 1 : data.side === "red" ? 2 : null,
        )
    }
  }
  /* db.prepare(
    `INSERT INTO game (id, state, state_timer, current_banpick)
    VALUES (1, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
    state = ?, state_timer = ?, current_banpick = ?`,
  )
    .run(
      data.state,
      data.timeLeft,
      data.side === "blue" ? 1 : data.side === "red" ? 2 : null,
    ) */
}

export function getGameTime() {
  const timeLeft = repository.getGameTime()
  const xmlResponse = `<gametime>${
    timeLeft !== "" ? formatSeconds(timeLeft) : ""
  }</gametime>`

  return xmlResponse
}

export function getMvpData() {
  const data = repository.getMvpData()
  if (!data) return

  return `<mvp>
<rune>${data.rune ? "http://localhost:8000/image/rune/" + data.rune : ""}</rune>
<kill>${data.kill}</kill>
<death>${data.death}</death>
<assist>${data.assist}</assist>
<gold>${data.gold}</gold>
<item-1>${data.items[0] ? "http://localhost:8000/image/item/" + data.items[0] : ""}</item-1>
<item-2>${data.items[1] ? "http://localhost:8000/image/item/" + data.items[1] : ""}</item-2>
<item-3>${data.items[2] ? "http://localhost:8000/image/item/" + data.items[2] : ""}</item-3>
<item-4>${data.items[3] ? "http://localhost:8000/image/item/" + data.items[3] : ""}</item-4>
<item-5>${data.items[4] ? "http://localhost:8000/image/item/" + data.items[4] : ""}</item-5>
<item-6>${data.items[5] ? "http://localhost:8000/image/item/" + data.items[5] : ""}</item-6>

<pick>${"http://localhost:8000/image/champ-pick/" + data.pick}</pick>
<skillid>${data.skillid}</skillid>
<dmgDealt>${data.dmgDealt}</dmgDealt>
<dmgTaken>${data.dmgTaken}</dmgTaken>
<name>${data.name}</name>
</mvp>`
}

export function getTimeLeft() {
  const timeLeft = repository.getTimeLeft()
  const xmlResponse = `<timeLeft>${
    timeLeft !== "" ? formatSeconds(timeLeft) : ""
  }</timeLeft>`

  return xmlResponse
}

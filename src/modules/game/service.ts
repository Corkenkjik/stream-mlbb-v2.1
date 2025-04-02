import db from "#db"
import { BattleState } from "../../lib/game/game-source/types.ts"

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

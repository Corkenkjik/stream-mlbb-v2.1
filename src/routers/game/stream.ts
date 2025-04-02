import { Router } from "@oak/oak"
import { GameController } from "../../lib/game/game-controller.ts"

const streamRouter = new Router({
  prefix: "/stream",
})

streamRouter.post("/start-stream", async (ctx) => {
  const matchId = ctx.request.url.searchParams.get("match-id")
  if (!matchId) {
    ctx.response.status = 400
    ctx.response.body = "match-id is required"
    return
  }

  GameController.createGame(matchId)
  ctx.response.body = "OK"
})

streamRouter.get("/stop-stream", async (ctx) => {
  GameController.stopGame()
  ctx.response.body = "OK"
})

export default streamRouter

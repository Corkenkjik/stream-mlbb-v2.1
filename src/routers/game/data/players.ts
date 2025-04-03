// import { Router } from "@oak/oak"
// import { sideMiddleware } from "../../middlewares/side-middleware.ts"
// import * as playerService from "#players/service.ts"
// import { getPlayersRune } from "#players/service.ts"
// import { logger } from "@kinbay/logger"

import { Router } from "@oak/oak"
import { sideMiddleware } from "../../middlewares/side-middleware.ts"
import * as playerService from "#players/service.ts"


const router = new Router({
  prefix: "/players",
})

router.get("/ping", (ctx) => {
  ctx.response.body = "pong"
})

router.get("/items", sideMiddleware, (ctx) => {
  const side = ctx.state.side as "blue" | "red"
  const xml = playerService.getPlayersItems(side)

  if (!xml) {
    ctx.response.status = 400
    ctx.response.body =
      "Players items is empty, check for player items in the database"
    return
  }

  ctx.response.type = "application/xml"
  ctx.response.body = xml
})

router.get("/picks", sideMiddleware, (ctx) => {
  const side = ctx.state.side as "blue" | "red"

  const type = ctx.request.url.searchParams.get("type")
  if (!type && type !== "pick" && type !== "waiting" && type !== "end") {
    ctx.response.status = 400
    ctx.response.body = "type is required"
    return
  }

  const xml = playerService.getPlayersPick(side, type)

  if (!xml) {
    ctx.response.status = 400
    ctx.response.body =
      "Players picks is empty, check for player items in the database"
    return
  }

  ctx.response.type = "application/xml"
  ctx.response.body = xml
})

router.get("/runes", sideMiddleware, (ctx) => {
  const side = ctx.state.side as "blue" | "red"
  const runes = playerService.getPlayersRune(side)

  if (!runes) {
    ctx.response.status = 400
    ctx.response.body =
      "Players runes is empty, check for player items in the database"
  }

  ctx.response.type = "application/xml"
  ctx.response.body = runes
})

router.get("/details", sideMiddleware, (ctx) => {
  const side = ctx.state.side as "blue" | "red"
  const levels = playerService.getPlayerDetails(side)

  if (!levels) {
    ctx.response.status = 400
    ctx.response.body =
      "Players levels is empty, check for player items in the database"
  }

  ctx.response.type = "application/xml"
  ctx.response.body = levels
})

export default router

import { Router } from "@oak/oak"
import { sideMiddleware } from "../../middlewares/side-middleware.ts"
import * as playerService from "#players/service.ts"

function arrayToXml(data: { id: number; items: number[] }[]) {
  let xml = "<items-blue>\n"
  const ITEMS_PER_PLAYER = 6

  data.forEach((player, playerIndex) => {
    const playerNum = playerIndex + 1

    for (let itemNum = 1; itemNum <= ITEMS_PER_PLAYER; itemNum++) {
      const arrayIndex = itemNum - 1
      const value = arrayIndex < player.items.length
        ? `http://localhost:8000/image/items/${player.items[arrayIndex]}`
        : ""

      xml +=
        `<player-${playerNum}-item-${itemNum}>${value}</player-${playerNum}-item-${itemNum}>\n`
    }
  })

  xml += "</items-blue>"
  return xml
}

const router = new Router({
  prefix: "/players",
})

router.get("/items", sideMiddleware, (ctx) => {
  const side = ctx.state.side as "blue" | "red"
  const data = playerService.getPlayersItems(side)

  if (!data) {
    ctx.response.status = 400
    ctx.response.body =
      "Players items is empty, check for player items in the database"
  }

  ctx.response.type = "application/xml"
  ctx.response.body = arrayToXml(data!)
})

router.get("/picks", sideMiddleware, (ctx) => {
  const type = ctx.request.url.searchParams.get("type")
  if (!type && type !== "pick" && type !== "waiting" && type !== "end") {
    ctx.response.status = 400
    ctx.response.body = "type is required"
    return
  }

  const side = ctx.state.side as "blue" | "red"
  const picks = playerService.getPlayersPick(side)

  if (!picks) {
    ctx.response.status = 400
    ctx.response.body =
      "Players pick is empty, check for player items in the database"
  }

  const xmlResponse = Array(5).fill(0).map((_, index) => {
    const len = picks!.length
    const url = index < len
      ? `http://localhost:8002/image/champ-${type}/${picks![index].pick}`
      : ""
    return `<${side}-pick-${index + 1}>${url}</${side}-pick-${index + 1}>`
  }).join("\n")
  ctx.response.type = "application/xml"
  ctx.response.body = `<${side}picks>${xmlResponse}</${side}picks>`
})

export default router

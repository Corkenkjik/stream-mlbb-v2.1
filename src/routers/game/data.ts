import { Router } from "@oak/oak"
import { getGameTime, getMvpRune, getTimeLeft } from "#game/repository.ts"
import { formatSeconds } from "../../lib/helper/fmt.ts"
import { getPlayerBans } from "#teams/repository.ts"
import { getPlayerPicks, getRunes } from "#players/repository.ts"

const dataRouter = new Router({
  prefix: "/data",
})

dataRouter.get("/time-left", (ctx) => {
  const timeLeft = getTimeLeft()
  ctx.response.body = { timeLeft }
})

dataRouter.get("/time-left/xml", (ctx) => {
  const timeLeft = getTimeLeft()
  const xmlResponse = `<timeLeft>${timeLeft}</timeLeft>`

  ctx.response.type = "application/xml"
  ctx.response.body = xmlResponse
})

dataRouter.get("/gametime/xml", (ctx) => {
  const timeLeft = getGameTime()
  const xmlResponse = `<gametime>${
    timeLeft !== "" ? formatSeconds(timeLeft) : ""
  }</gametime>`

  ctx.response.type = "application/xml"
  ctx.response.body = xmlResponse
})

dataRouter.get("/bans/xml", async (ctx) => {
  const side = ctx.request.url.searchParams.get("side")
  if (!side && side !== "blue" && side !== "red") {
    ctx.response.status = 400
    ctx.response.body = "side is required"
    return
  }
  const bans = await getPlayerBans(side as unknown as "blue" | "red")

  const xmlResponse = Array(5).fill(0).map((_, index) => {
    const len = bans?.length || 0
    const url = index < len
      ? `http://localhost:8002/image/champ-ban/${bans[index]}`
      : ""
    return `<${side}-ban-${index + 1}>${url}</${side}-ban-${index + 1}>`
  }).join("\n")
  ctx.response.type = "application/xml"
  ctx.response.body = `<${side}bans>${xmlResponse}</${side}bans>`
})

dataRouter.get("/picks/xml", async (ctx) => {
  const side = ctx.request.url.searchParams.get("side")
  const type = ctx.request.url.searchParams.get("type")
  if (!side && side !== "blue" && side !== "red") {
    ctx.response.status = 400
    ctx.response.body = "side is required"
    return
  }

  if (!type && type !== "pick" && type !== "waiting" && type !== "end") {
    ctx.response.status = 400
    ctx.response.body = "type is required"
    return
  }

  const picks = getPlayerPicks(side as unknown as "blue" | "red")
  if (!picks) {
    ctx.response.status = 500
    ctx.response.body = "MLBB Server error"
    return
  }
  const xmlResponse = Array(5).fill(0).map((_, index) => {
    const len = picks.length
    const url = index < len
      ? `http://localhost:8002/image/champ-${type}/${picks[index]}`
      : ""
    return `<${side}-pick-${index + 1}>${url}</${side}-pick-${index + 1}>`
  }).join("\n")
  ctx.response.type = "application/xml"
  ctx.response.body = `<${side}picks>${xmlResponse}</${side}picks>`
})

dataRouter.get("/rune/xml", (ctx) => {
  const side = ctx.request.url.searchParams.get("side")
  if (!side && side !== "blue" && side !== "red") {
    ctx.response.status = 400
    ctx.response.body = "side is required"
    return
  }

  const runes = getRunes(side as unknown as "blue" | "red")
  if (!runes) {
    ctx.response.status = 500
    ctx.response.body = "MLBB Server error"
    return
  }
  const xmlResponse = Array(5).fill(0).map((_, index) => {
    const len = runes.length
    const url = index < len
      ? `http://localhost:8002/image/rune/${runes[index]}`
      : ""
    return `<${side}-rune-${index + 1}>${url}</${side}-rune-${index + 1}>`
  }).join("\n")
  ctx.response.type = "application/xml"
  ctx.response.body = `<${side}runes>${xmlResponse}</${side}runes>`
})

dataRouter.get("/mvp-rune/xml", (ctx) => {
  const rune = getMvpRune()
  if (!rune) {
    ctx.response.status = 500
    ctx.response.body = "Rune not set"
    return
  }
  ctx.response.type = "application/xml"
  ctx.response.body =
    `<rune-mvp>${`http://localhost:8002/image/rune/${rune}`}</rune-mvp>`
})



export default dataRouter

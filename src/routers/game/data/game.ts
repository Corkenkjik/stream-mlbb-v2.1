import { Router } from "@oak/oak"
import { getGameTime, getMvpData, getTimeLeft } from "#game/service.ts"

const router = new Router({
  prefix: "/game",
})

router.get("/mvp", (ctx) => {
  const xml = getMvpData()
  if (!xml) {
    ctx.response.status = 400
    ctx.response.body = "Cannot fetch mvp"
  }

  ctx.response.type = "application/xml"
  ctx.response.body = xml
})

router.get("/gametime", (ctx) => {
  const xmlResponse = getGameTime()

  ctx.response.type = "application/xml"
  ctx.response.body = xmlResponse
})

router.get("/time-left", (ctx) => {
  const xmlResponse = getTimeLeft()

  ctx.response.type = "application/xml"
  ctx.response.body = xmlResponse
})

export default router

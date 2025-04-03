import { Router } from "@oak/oak"
import { sideMiddleware } from "../../middlewares/side-middleware.ts"
import { getBans, getTeamData } from "#teams/service.ts"

const router = new Router({
  prefix: "/teams",
})

router.get("/data", sideMiddleware, (ctx) => {
  const side = ctx.state.side as "blue" | "red"

  const xml = getTeamData(side)

  if (!xml) {
    ctx.response.status = 400
    ctx.response.body = "Cannot fetch team post data"
  }

  ctx.response.type = "application/xml"
  ctx.response.body = xml
})

router.get("/bans", sideMiddleware, (ctx) => {
  const side = ctx.state.side as "blue" | "red"

  const xml = getBans(side)

  ctx.response.type = "application/xml"
  ctx.response.body = xml
})

router.get("/names", (ctx) => {
  ctx.response.type = "application/xml"
  ctx.response.body = `
<team-names>  
<blue>http://localhost:8000/image/teamicon/blue</blue>
<red>http://localhost:8000/image/teamicon/red</red>
</team-names>  
`
})

export default router

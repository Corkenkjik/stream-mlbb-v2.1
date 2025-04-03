import { Router } from "@oak/oak"
// import { fetchBattleData } from "../../lib/game/game-source/index.ts"
// import { getTeam } from "#teams/helpers/getTeam.ts"
import { addPlayers, getPlayerNames } from "#players/service.ts"
import {
  addTeams,
  // changePlayerPos,
  // getPlayerPositions,
  getTeamNames,
} from "#teams/service.ts"
import { extractTeamsFromExcel } from "../../lib/xlsx/index.ts"
import { sideMiddleware } from "../middlewares/side-middleware.ts"
import { fetchBattleData } from "../../lib/game/game-source/index.ts"
import { getTeam } from "#teams/helpers/getTeam.ts"

const setupRouter = new Router({
  prefix: "/setup",
})

/* setupRouter.get("/ping-test", async (ctx) => {
  const matchId = ctx.request.url.searchParams.get("match-id")
  if (!matchId) {
    ctx.response.status = 400
    ctx.response.body = "match-id is required"
    return
  }
  const data = await fetchBattleData(matchId)
  const { blueTeam, redTeam } = getTeam(data)

  const blueIds = addPlayers(blueTeam.player_list)
  const redIds = addPlayers(redTeam.player_list)

  addTeams({ name: blueTeam.team_name, playerPos: blueIds, side: "blue" })
  addTeams({ name: redTeam.team_name, playerPos: redIds, side: "red" })

  const teams = getTeamNames()
  const players = getPlayerNames()

  ctx.response.body = {
    teams,
    players,
  }
})

setupRouter.post("/change-position", async (ctx) => {
  const side = ctx.request.url.searchParams.get("side")
  if (!side && side !== "blue" && side !== "red") {
    ctx.response.status = 400
    ctx.response.body = "side is required"
    return
  }
  const newPos = await ctx.request.body.json()

  const results = getPlayerPositions(newPos)

  if (results.length !== 5) {
    ctx.response.status = 400
    ctx.response.body = "One of the player name is not found"
    return
  }

  changePlayerPos(results, side as unknown as "blue" | "red")
  ctx.response.body = "OK"
}) */

setupRouter.get("/import-names", async (ctx) => {
  try {
    const [blueTeam, redTeam] = await extractTeamsFromExcel("data.xlsx")
    const blueIds = addPlayers(blueTeam.players)
    const redIds = addPlayers(redTeam.players)
    addTeams({ name: blueTeam.name, playerPos: blueIds, side: "blue" })
    addTeams({ name: redTeam.name, playerPos: redIds, side: "red" })

    // const teams = getTeamNames()
    const players = getPlayerNames()

    ctx.response.body = {
      blue: players.slice(0, 5),
      red: players.slice(5, 10),
    }
  } catch (error) {
    console.error("Error processing Excel file:", error)
    ctx.response.status = 400
    ctx.response.body = "data.xlsx out of format or corrupted"
  }
})

setupRouter.get("/names", sideMiddleware, async (ctx) => {
  const side = ctx.state.side as "blue" | "red"
  const players = getPlayerNames()
  let body = ``
  if (side === "blue") {
    players.slice(0, 5).forEach((data) => body += `${data}\n`)
  } else if (side === "red") {
    players.slice(5, 10).forEach((data) => body += `${data}\n`)
  }
  ctx.response.body = body
})

setupRouter.get("/ping-test", async (ctx) => {
  const matchId = ctx.request.url.searchParams.get("match-id")
  if (!matchId) {
    ctx.response.status = 400
    ctx.response.body = "match-id is required"
    return
  }
  const data = await fetchBattleData(matchId)
  const { blueTeam, redTeam } = getTeam(data)

  const bluePlayersNames = blueTeam.player_list.map((x) => x.name)
  const redPlayersNames = redTeam.player_list.map((x) => x.name)
  let body = ``
  body += `${blueTeam.team_name}\n`
  body += `${redTeam.team_name}\n`
  bluePlayersNames.forEach((x) => body += `${x}\n`)
  redPlayersNames.forEach((x) => body += `${x}\n`)

  ctx.response.body = body
})

export default setupRouter

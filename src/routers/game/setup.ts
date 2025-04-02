import { Router } from "@oak/oak"
import { fetchBattleData } from "../../lib/game/game-source/index.ts"
import { getTeam } from "#teams/helpers/getTeam.ts"
import { addPlayers, getPlayerNames } from "#players/service.ts"
import {
  addTeams,
  changePlayerPos,
  getPlayerPositions,
  getTeamNames,
} from "#teams/service.ts"

const setupRouter = new Router({
  prefix: "/setup",
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
})

export default setupRouter

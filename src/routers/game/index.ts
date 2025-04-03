import { Router } from "@oak/oak"
import setupRouter from "./setup.ts"
import streamRouter from "./stream.ts"
import playerDataRouter from "./data/players.ts"
import gameDataRouter from "./data/game.ts"
import teamDataRouter from "./data/teams.ts" 

const gameRouter = new Router({
  prefix: "/game",
})

gameRouter.use(setupRouter.routes())
gameRouter.use(setupRouter.allowedMethods())

gameRouter.use(streamRouter.routes())
gameRouter.use(streamRouter.allowedMethods())

// gameRouter.use(dataRouter.routes())
// gameRouter.use(dataRouter.allowedMethods())

gameRouter.use(playerDataRouter.routes())
gameRouter.use(gameDataRouter.routes())
gameRouter.use(teamDataRouter.routes())

export default gameRouter

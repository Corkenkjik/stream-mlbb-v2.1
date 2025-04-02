import { Router } from "@oak/oak"
import setupRouter from "./setup.ts"
import streamRouter from "./stream.ts"
import dataRouter from "./data.ts"

const gameRouter = new Router({
  prefix: "/game",
})

gameRouter.use(setupRouter.routes())
gameRouter.use(setupRouter.allowedMethods())
gameRouter.use(streamRouter.routes())
gameRouter.use(streamRouter.allowedMethods())
gameRouter.use(dataRouter.routes())
gameRouter.use(dataRouter.allowedMethods())

export default gameRouter

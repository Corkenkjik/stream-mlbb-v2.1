import { Application, Router } from "@oak/oak"
import { oakCors } from "@tajpouria/cors"
import { setup } from "./setup.ts"
import gameRouter from "./routers/game/index.ts"
import imageRouter from "./routers/image/index.ts"

setup()

const app = new Application()

app.use(oakCors())

const router = new Router()

router.get("/", (context) => {
  context.response.body = "Hello World!"
})

app.use(router.routes())
app.use(router.allowedMethods())

app.use(gameRouter.routes())
app.use(gameRouter.allowedMethods())

app.use(imageRouter.routes())
app.use(imageRouter.allowedMethods())

console.log("Listening on http://localhost:8000")
app.listen({ port: 8000 })

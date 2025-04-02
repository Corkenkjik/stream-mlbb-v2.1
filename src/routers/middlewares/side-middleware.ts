import { Context, Next } from "@oak/oak"

/**
 * Requires side selection in the url query
 */
export async function sideMiddleware(ctx: Context, next: Next) {
  const side = ctx.request.url.searchParams.get("side")
  if (!side && side !== "blue" && side !== "red") {
    ctx.response.status = 400
    ctx.response.body = "side is required"
    return
  }

  ctx.state.side = side
  await next()
}

import { fetchBattleData, fetchPostBattleData } from "./game-source/index.ts"
import { battlePipeline, postBattlePipeline } from "./pipeline.ts"

export class GameController {
  static instance: GameController
  private static interval: number | undefined
  //   public gameSource: GameSource | undefined
  //   public referee: Referee | undefined

  public static getInstance(): GameController {
    if (!GameController.instance) {
      GameController.instance = new GameController()
    }
    return GameController.instance
  }

  static createGame(matchId: string) {
    GameController.interval = setInterval(async () => {
      const data = await fetchBattleData(matchId)
      console.log("game state", data.state)
      const state = battlePipeline(data)
      if (state === "end") {
        GameController.stopGame()
        const postdata = await fetchPostBattleData(matchId)
        postBattlePipeline(postdata)
      }
    }, 250)
  }

  static stopGame() {
    clearInterval(GameController.interval)
    GameController.interval = undefined
  }

  //   public createGame(matchId: string) {
  //     this.gameSource = new GameSource(matchId)
  //   }

  //   public startStream() {
  //     if (!this.gameSource) {
  //       logger.log(
  //         "GameSource is not initialized",
  //         "ERROR",
  //         "GameController.startGame",
  //       )
  //       throw new Error("GameSource is not initialized")
  //     }
  //     let isGameStart = 0
  //     logger.log("starting", "SUCCESS")

  //     this.interval = setInterval(async () => {
  //       const data = await this.gameSource!.fetchBattleData()
  //       if (data === "end") {
  //         this.stopStream()
  //         this.gameSource!.fetchPostgameData()
  //         controllerEvents.emit("end-game", null)
  //       } else if (data === "paused") {
  //         isGameStart = 0
  //         controllerEvents.emit("pause-game", null)
  //       } else if(data === "adjust") {
  //        controllerEvents.emit("adjust-game", null)
  //       }
  //       else if (data === "play" && isGameStart === 0) {
  //         isGameStart++
  //         controllerEvents.emit("start-game", null)
  //       }
  //     }, 250)
  //   }

  //   public stopStream() {
  //     clearInterval(this.interval)
  //   }

  //   public createReferee(refereeId: string) {
  //     this.referee = new Referee(refereeId)
  //   }
}

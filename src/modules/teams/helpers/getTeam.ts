import { BattleData, Camp, PostBattleCamp, PostBattleData } from "../../../lib/game/game-source/types.ts"

export const getTeam = (data: BattleData) => {
  let blueTeam = {} as Camp
  let redTeam = {} as Camp

  data.camp_list.forEach((camp) => {
    if (camp.campid === 1) {
      blueTeam = camp
    } else if (camp.campid === 2) {
      redTeam = camp
    }
  })

  return { blueTeam, redTeam }
}

export const getTeamPostGame = (data: PostBattleData) => {
  let blueTeam = {} as PostBattleCamp
  let redTeam = {} as PostBattleCamp

  data.camp_list.forEach((camp) => {
    if (camp.campid === 1) {
      blueTeam = camp
    } else if (camp.campid === 2) {
      redTeam = camp
    }
  })

  return { blueTeam, redTeam }
}
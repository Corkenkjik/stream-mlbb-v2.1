import { getTeam, getTeamPostGame } from "#teams/helpers/getTeam.ts"
import { updateTeamBanState } from "#teams/service.ts"
import { updateGameBanPickState } from "#game/service.ts"
import { BattleData, PostBattleData } from "./game-source/types.ts"
import { updatePlayerPickState } from "#players/service.ts"
import {
  updateGameState,
  updateGameTime,
  updatePostgameState,
  updateTimeLeft,
} from "#game/repository.ts"
import { updateTeamBuffs, updateTeamRealtimeData } from "#teams/repository.ts"
import { Player, updatePlayerPostgame } from "#players/repository.ts"

export const battlePipeline = (data: BattleData) => {
  updateGameState(data.state)

  const { blueTeam, redTeam } = getTeam(data)
  if (data.state === "ban") {
    // ban_hero
    const blueBans = blueTeam.ban_hero_list
    const redBans = redTeam.ban_hero_list
    updateTeamBanState({ side: "blue", banList: blueBans })
    updateTeamBanState({ side: "red", banList: redBans })

    // state_left || null
    const timeLeft = data.state_left_time || null

    // thằng nào đang ban ???
    const isBlueBan = blueTeam.player_list.some((player) => player.banning)
    const isRedBan = redTeam.player_list.some((player) => player.banning)

    if (isBlueBan) {
      updateGameBanPickState({ state: data.state, side: "blue", timeLeft })
    } else if (isRedBan) {
      updateGameBanPickState({ state: data.state, side: "red", timeLeft })
    } else {
      updateGameBanPickState({ state: data.state, side: undefined, timeLeft })
    }
    return "ban"
  } else if (data.state === "pick") {
    // pick hero
    const pickMap = new Map<string, number | null>()
    blueTeam.player_list.forEach((player) => {
      pickMap.set(player.name, player.heroid === 0 ? null : player.heroid)
    })
    redTeam.player_list.forEach((player) => {
      pickMap.set(player.name, player.heroid === 0 ? null : player.heroid)
    })

    updatePlayerPickState(pickMap)
    // state_left
    const timeLeft = data.state_left_time || null

    const isBluePick = blueTeam.player_list.some((player) => player.picking)
    const isRedPick = redTeam.player_list.some((player) => player.picking)

    if (isBluePick) {
      updateGameBanPickState({ state: data.state, side: "blue", timeLeft })
    } else if (isRedPick) {
      updateGameBanPickState({ state: data.state, side: "red", timeLeft })
    } else {
      updateGameBanPickState({ state: data.state, side: undefined, timeLeft })
    }
    return "pick"
  } else if (data.state === "adjust") {
    updateTimeLeft(data.state_left_time)

    const pickMap = new Map<string, number>()
    blueTeam.player_list.forEach((player) => {
      pickMap.set(player.name, player.heroid)
    })
    redTeam.player_list.forEach((player) => {
      pickMap.set(player.name, player.heroid)
    })

    updatePlayerPickState(pickMap)
    return "adjust"
  } else if (data.state === "play") {
    updateGameTime(data.game_time)

    updateTeamRealtimeData({
      gold: blueTeam.total_money,
      tower: blueTeam.kill_tower,
      score: blueTeam.score,
      tortoise: blueTeam.kill_tortoise,
      lord: blueTeam.kill_lord,
    }, "blue")
    updateTeamRealtimeData({
      gold: redTeam.total_money,
      tower: redTeam.kill_tower,
      score: redTeam.score,
      tortoise: redTeam.kill_tortoise,
      lord: redTeam.kill_lord,
    }, "red")
    return "play"
  } else if (data.state === "end") {
    // GAME
    // game time
    // updateGameTime(data.game_time)

    // PLAYER
    // MVP ⚠name, dmg dealt, vang, kda, rune 3, equipment
    // POST rune, vang, kda, equipment, level, heroid
    return "end"
  }
}

export const postBattlePipeline = (data: PostBattleData) => {
  const { blueTeam, redTeam } = getTeamPostGame(data)
  // Team buffs
  updateTeamBuffs({
    blue: [blueTeam.blue_buff_num, blueTeam.red_buff_num],
    red: [redTeam.blue_buff_num, redTeam.red_buff_num],
  })

  const winCamp = data.win_camp

  const mvpName =
    data.hero_list.find((hero) => hero.mvp && hero.campid === winCamp)!.name

  // Game stats
  updatePostgameState({
    gametime: data.game_time,
    mvp: mvpName,
    wincamp: winCamp,
  })

  // Players
  const players = new Map<string, Player>()
  data.hero_list.forEach((hero) => {
    console.log(hero.rune_map)
    players.set(hero.name, {
      name: hero.name,
      pick: hero.heroid,
      kill: hero.kill_num,
      death: hero.dead_num,
      assist: hero.assist_num,
      gold: hero.total_money,
      level: hero.level,
      skillid: hero.skillid,
      rune: hero.runeid || null,
      rune1: hero.rune_map ? hero.rune_map["1"] : null,
      rune2: hero.rune_map ? hero.rune_map["2"] : null,
      rune3: hero.rune_map ? hero.rune_map["3"] : null,
      dmgDealt: hero.total_damage,
      dmgTaken: hero.total_hurt,
      items: hero.equip_list,
    })
  })

  updatePlayerPostgame(players)
}

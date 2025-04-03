import { create, updatePlayerPick } from "#players/repository.ts"
import db from "#db"
// import { Player as SourcePlayer } from "../../lib/game/game-source/types.ts"
import { getPlayerIds } from "#teams/repository.ts"
import * as repository from "./repository.ts"

export const addPlayers = (players: string[]) => {
  const results = players.map((player) => {
    const result = create({
      assist: 0,
      death: 0,
      dmgDealt: 0,
      dmgTaken: 0,
      gold: 0,
      kill: 0,
      level: 0,
      items: [],
      name: player,
      pick: null,
      rune: null,
      rune1: null,
      rune2: null,
      rune3: null,
      skillid: 0,
    })
    return result.lastInsertRowid as number
  })

  return results
}

export const getPlayerNames = () => {
  const results = db.prepare("SELECT name FROM players").all() as {
    name: string
  }[]
  return results.map((x) => x.name)
}

export const updatePlayerPickState = (data: Map<string, number | null>) => {
  for (const [key, value] of data) {
    updatePlayerPick(key, value)
  }
}

export function getPlayersItems(side: "blue" | "red") {
  const playerIds = getPlayerIds(side)
  if (!playerIds) {
    return
  }

  const data = repository.getPlayerItems(playerIds)
  if (!data) return

  const xmls = data.map((player, playerIndex) => {
    const itemLength = player.items.length
    const playerXml = Array(6).fill(0).map((_, index) => {
      if (index < itemLength) {
        const value = "http://localhost:8000/image/item/" + player.items[index]
        return `<player-${playerIndex}-item-${
          index + 1
        }>${value}</player-${playerIndex}-item-${index + 1}>\n`
      } else {
        return `<player-${playerIndex}-item-${
          index + 1
        }></player-${playerIndex}-item-${index + 1}>\n`
      }
    })
    return playerXml
  }).flatMap((x) => x)

  const xmlResponse = xmls.join("\n")

  return `<items-${side}>${xmlResponse}</items-${side}>`
}

export const getPlayersPick = (side: "blue" | "red", type: string) => {
  const playerIds = getPlayerIds(side)
  if (!playerIds) {
    return
  }

  const picks = repository.getPlayerPicks(playerIds)
  if (!picks) return

  const xmlResponse = Array(5).fill(0).map((_, index) => {
    // const len = picks.length
    /* const url = index < len
      ? `http://localhost:8000/image/champ-${type}/${picks![index].pick}`
      : "" */

    const len = picks.length
    if (index < len) {
      const url = picks![index].pick
        ? `http://localhost:8000/image/champ-${type}/${picks![index].pick}`
        : ""

      return `<${side}-pick-${index + 1}>${url}</${side}-pick-${index + 1}>`
    } else {
      return `<${side}-pick-${index + 1}></${side}-pick-${index + 1}>`
    }
  }).join("\n")

  return `<${side}picks>${xmlResponse}</${side}picks>`
}

export const getPlayersRune = (side: "blue" | "red") => {
  const playerIds = getPlayerIds(side)
  if (!playerIds) {
    return
  }

  const runes = repository.getPlayerRunes(playerIds)
  if (!runes) return

  const xmlResponse = Array(5).fill(0).map((_, index) => {
    const len = runes.length
    const url = index < len
      ? `http://localhost:8000/image/rune/${runes[index].rune}`
      : ""
    if (index < len) {
      const url = runes[index].rune
        ? `http://localhost:8000/image/rune/${runes[index].rune}`
        : ""
      return `<${side}-rune-${index + 1}>${url}</${side}-rune-${index + 1}>`
    }
    return `<${side}-rune-${index + 1}></${side}-rune-${index + 1}>`
  }).join("\n")

  return `<${side}runes>${xmlResponse}</${side}runes>`
}

export const getPlayerDetails = (side: "blue" | "red") => {
  const playerIds = getPlayerIds(side)
  if (!playerIds) {
    return
  }

  const details = repository.getPlayerDetails(playerIds)
  if (!details) return

  // const xmlResponse = Array(5).fill(0).map((_, index) => {
  //   return `<${side}-level-${index + 1}>${url}</${side}-rune-${index + 1}>`
  // }).join("\n")

  const xmlResponse = details.map((dt, index) => {
    const level = `<${side}-level-${index + 1}>${dt.level}</${side}-level-${
      index + 1
    }>`
    const kill = `<${side}-kill-${index + 1}>${dt.kill}</${side}-kill-${
      index + 1
    }>`
    const death = `<${side}-death-${index + 1}>${dt.death}</${side}-death-${
      index + 1
    }>`
    const assist = `<${side}-assist-${index + 1}>${dt.assist}</${side}-assist-${
      index + 1
    }>`
    const gold = `<${side}-gold-${index + 1}>${dt.gold}</${side}-gold-${
      index + 1
    }>`

    return level + kill + death + assist + gold
  })

  return `<${side}details>${xmlResponse}</${side}details>`
}

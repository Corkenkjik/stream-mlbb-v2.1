function arrayToXml(data: { id: number; items: number[] }[]) {
  let xml = "<items-blue>\n"
  const ITEMS_PER_PLAYER = 6

  data.forEach((player, playerIndex) => {
    const playerNum = playerIndex + 1

    for (let itemNum = 1; itemNum <= ITEMS_PER_PLAYER; itemNum++) {
      const arrayIndex = itemNum - 1
      const value = arrayIndex < player.items.length
        ? `http://localhost:8002/image/item/${player.items[arrayIndex]}`
        : ""

      xml +=
        `<player-${playerNum}-item-${itemNum}>${value}</player-${playerNum}-item-${itemNum}>\n`
    }
  })

  xml += "</items-blue>"
  return xml
}

const data = [
  { id: 1, items: [1001, 1002, 1003, 1005, 1007, 1008] },
  { id: 1, items: [1001, 1002, 1003] },
  { id: 1, items: [1001, 1002] },
  { id: 1, items: [] },
  { id: 1, items: [1001, 1002, 1003, 1005, 1007] },
  { id: 1, items: [1001, 1002, 1003, 1005] },
]

console.log(arrayToXml(data))

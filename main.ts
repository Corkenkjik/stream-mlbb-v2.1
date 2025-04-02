function arrayToXml(data: { id: number; items: number[] }[]) {
  let xml = "<items-blue>\n"
  const ITEMS_PER_PLAYER = 6

  data.forEach((player, playerIndex) => {
    const playerNum = playerIndex + 1

    for (let itemNum = 1; itemNum <= ITEMS_PER_PLAYER; itemNum++) {
      const arrayIndex = itemNum - 1
      const value = arrayIndex < player.items.length
        ? `http://localhost:8000/image/items/${player.items[arrayIndex]}`
        : ""

      xml +=
        `<player-${playerNum}-item-${itemNum}>${value}</player-${playerNum}-item-${itemNum}>\n`
    }
  })

  xml += "</items-blue>"
  return xml
}

const data = [
  { id: 1, items: [10, 20, 30, 5, 6, 7] },
  { id: 2, items: [10, 20, 30] },
  { id: 3, items: [10, 20, 30, 4] },
  { id: 4, items: [10, 20] },
  { id: 5, items: [10, 20, 30] },
]

console.log(arrayToXml(data))

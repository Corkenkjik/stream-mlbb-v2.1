import { DB } from "https://deno.land/x/sqlite/mod.ts"
import { MLBB_SERVER } from "#helper/constant.ts"
import { API_KEY } from "#helper/env.ts"

// Define matchId
const matchId = "877776061598687137"

// Create database file
const db = new DB(`${matchId}.db`)

// Create table if not exists
db.execute(`
  CREATE TABLE IF NOT EXISTS data (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    data TEXT
  )
`)

// Function to fetch and store data
async function fetchData() {
  try {
    const url =
      `${MLBB_SERVER}battledata?authkey=${API_KEY}&battleid=${matchId}&dataid=0`
    const response = await fetch(url)
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`)

    const jsonData = await response.json()
    const jsonString = JSON.stringify(jsonData)

    db.query("INSERT INTO data (data) VALUES (?)", [jsonString])
    console.log("Inserted data:", jsonData)
  } catch (error) {
    console.error("Fetch error:", error)
  }
}

// Run fetchData every 500ms
setInterval(fetchData, 500)

// Gracefully close database on exit
Deno.addSignalListener("SIGINT", () => {
  console.log("Closing database...")
  db.close()
  Deno.exit()
})

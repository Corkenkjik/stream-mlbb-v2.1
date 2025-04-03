import {
  read,
  utils,
} from "https://cdn.sheetjs.com/xlsx-0.19.3/package/xlsx.mjs"

interface Team {
  name: string
  players: string[]
}

async function extractTeamsFromExcel(filePath: string): Promise<Team[]> {
  // Read the Excel file
  const file = await Deno.readFile(filePath)
  const workbook = read(file)

  // Get the first worksheet
  const firstSheetName = workbook.SheetNames[0]
  const worksheet = workbook.Sheets[firstSheetName]

  // Convert to JSON
  const data = utils.sheet_to_json(worksheet, { header: 1 }) as any[]

  // Extract teams
  const teams: Team[] = []

  // Skip header row (index 0), get team names from row 1
  const teamNames = data[1]

  // Process each column
  for (let col = 0; col < teamNames.length; col++) {
    const teamName = teamNames[col]
    if (!teamName) continue // Skip empty columns

    const players: string[] = []

    // Start from row 2 (index 2) to get players
    for (let row = 2; row < data.length; row++) {
      const playerName = data[row][col]
      if (playerName) {
        players.push(playerName)
      }
    }

    teams.push({
      name: teamName,
      players,
    })
  }

  return teams
}

// Example usage
try {
  const teams = await extractTeamsFromExcel("data.xlsx")
  console.log(teams)
} catch (error) {
  console.error("Error processing Excel file:", error)
}

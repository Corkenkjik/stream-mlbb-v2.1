const schema = `
  CREATE TABLE IF NOT EXISTS teams (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    side INTEGER NOT NULL,
    name TEXT NOT NULL,
    player1 INTEGER NOT NULL,
    player2 INTEGER NOT NULL,
    player3 INTEGER NOT NULL,
    player4 INTEGER NOT NULL,
    player5 INTEGER NOT NULL,
    
    bans TEXT,
    tower INTEGER NOT NULL,
    score INTEGER NOT NULL,
    tortoise INTEGER NOT NULL,
    lord INTEGER NOT NULL,
    gold INTEGER NOT NULL,
    blueBuff INTEGER NOT NULL,
    redBuff INTEGER NOT NULL
  )
`

export { schema }

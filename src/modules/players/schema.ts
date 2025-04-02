const schema = `
  CREATE TABLE IF NOT EXISTS players (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    pick INTEGER,
    kill INTEGER NOT NULL,
    death INTEGER NOT NULL,
    assist INTEGER NOT NULL,
    gold INTEGER NOT NULL,
    level INTEGER NOT NULL,
    skillid INTEGER NOT NULL,
    rune INTEGER,
    rune1 INTEGER,
    rune2 INTEGER,
    rune3 INTEGER,
    dmgDealt INTEGER NOT NULL,
    dmgTaken INTEGER NOT NULL,
    items TEXT
  )
`

export { schema }

const schema = `
  CREATE TABLE IF NOT EXISTS game (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    current_banpick INTEGER,
    state TEXT NOT NULL,
    wincamp INTEGER,
    state_timer INTEGER,
    gametime INTEGER,
    mvp TEXT
  )
`
export { schema }

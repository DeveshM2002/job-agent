const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("jobs.db");

db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS jobs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT,
            company TEXT,
            location TEXT,
            link TEXT UNIQUE,
            description TEXT,
            posted_at TEXT,
            source TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `);
});

module.exports = db;
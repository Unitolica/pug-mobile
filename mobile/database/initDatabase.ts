import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('time_logs.db');

export async function initDatabase () {
    await db.execAsync(`
    -- DROP TABLE IF EXISTS time_logs;
    CREATE TABLE IF NOT EXISTS time_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        projectId TEXT NOT NULL,
        timestamp INTEGER NOT NULL,
        description TEXT,
        responsible TEXT,
        latitude REAL,
        longitude REAL,
        registerType TEXT NOT NULL,
        approvedDate TEXT,
        init_id INTEGER
    );
    `);
};

export default db;

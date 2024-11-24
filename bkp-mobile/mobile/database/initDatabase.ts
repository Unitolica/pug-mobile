import { type SQLiteDatabase } from "expo-sqlite"

export async function initializeDatabase(database: SQLiteDatabase) {
  try {

  await database.execAsync(`
    DROP TABLE IF EXISTS hours_init;
    DROP TABLE IF EXISTS hours_end;
    DROP TABLE IF EXISTS projects;

    CREATE TABLE IF NOT EXISTS hours_init (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      projectId TEXT NOT NULL,
      init TEXT NOT NULL,
      latitute REAL NOT NULL,
      longitude REAL NOT NULL
    );

    CREATE TABLE IF NOT EXISTS hours_end (
      id INTEGER PRIMARY KEY,
      end DATE NOT NULL,
      latitute REAL NOT NULL,
      longitude REAL NOT NULL,
      registered BOOLEAN DEFAULT FALSE,
      description TEXT,


      FOREIGN KEY (id) REFERENCES hours_init(id)
    );

    CREATE TABLE IF NOT EXISTS projects (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      course TEXT NOT NULL,
      description TEXT NOT NULL
    );

    INSERT INTO projects (id, title, course, description) VALUES ('project1', 'Projeto 1', 'eng_soft', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec purus nec eros}');
    INSERT INTO projects (id, title, course, description) VALUES ('project2', 'Projeto 2', 'eng_soft', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec purus nec eros}');
    INSERT INTO projects (id, title, course, description) VALUES ('project3', 'Projeto 3', 'eng_soft', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec purus nec eros}');
  `)
  } catch (error) {
    console.error("error while creating local database tables", error)
  }
}


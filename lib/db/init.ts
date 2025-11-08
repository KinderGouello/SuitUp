import * as SQLite from 'expo-sqlite';
import { ALL_TABLES, SCHEMA_VERSION } from './schema';

const DATABASE_NAME = 'suitup.db';

let db: SQLite.SQLiteDatabase | null = null;

async function createLatestSchema(database: SQLite.SQLiteDatabase) {
  for (const tableSQL of ALL_TABLES) {
    await database.execAsync(tableSQL);
  }
  await database.execAsync(`PRAGMA user_version = ${SCHEMA_VERSION};`);
}

async function resetDatabase() {
  if (db) {
    try {
      await db.closeAsync();
    } catch (error) {
      console.warn('Failed to close database before reset:', error);
    }
    db = null;
  }

  await SQLite.deleteDatabaseAsync(DATABASE_NAME);
  db = await SQLite.openDatabaseAsync(DATABASE_NAME);
  await createLatestSchema(db);
  console.log('Database reset to schema version', SCHEMA_VERSION);
}

export async function initDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (db) {
    return db;
  }

  try {
    db = await SQLite.openDatabaseAsync(DATABASE_NAME);

    const userVersion = await db.getFirstAsync<{ user_version: number }>(
      'PRAGMA user_version'
    );

    const currentVersion = userVersion?.user_version ?? 0;

    if (currentVersion !== SCHEMA_VERSION) {
      await resetDatabase();
      return db!;
    }

    await createLatestSchema(db);
    console.log('Database already at schema version', SCHEMA_VERSION);
    return db;
  } catch (error) {
    console.error('Failed to initialize database:', error);
    throw error;
  }
}

export function getDatabase(): SQLite.SQLiteDatabase {
  if (!db) {
    throw new Error('Database not initialized. Call initDatabase() first.');
  }
  return db;
}

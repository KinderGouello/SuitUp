import * as SQLite from 'expo-sqlite';
import { ALL_TABLES, SCHEMA_VERSION } from './schema';

let db: SQLite.SQLiteDatabase | null = null;

export async function initDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (db) {
    return db;
  }

  try {
    db = await SQLite.openDatabaseAsync('suitup.db');

    const userVersion = await db.getFirstAsync<{ user_version: number }>(
      'PRAGMA user_version'
    );

    const currentVersion = userVersion?.user_version ?? 0;

    if (currentVersion < SCHEMA_VERSION) {
      await db.execAsync('BEGIN TRANSACTION;');

      try {
        for (const tableSQL of ALL_TABLES) {
          await db.execAsync(tableSQL);
        }

        await db.execAsync(`PRAGMA user_version = ${SCHEMA_VERSION};`);
        await db.execAsync('COMMIT;');

        console.log('Database initialized successfully');
      } catch (error) {
        await db.execAsync('ROLLBACK;');
        throw error;
      }
    }

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

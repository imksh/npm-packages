import { drizzle } from 'drizzle-orm/expo-sqlite';
import * as SQLite from 'expo-sqlite';
import * as schema from './schema';

// Open the local database. If it doesn't exist, it will be created.
const expoDb = SQLite.openDatabaseSync('imksh.db');

// Pass the database instance to Drizzle
export const db = drizzle(expoDb, { schema });

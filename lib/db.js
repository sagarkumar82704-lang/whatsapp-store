import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { sql } from '@vercel/postgres';

let localDb = null;
let isPostgresInitialized = false;

export async function openDb() {
  // If we are on Vercel and have POSTGRES_URL, use Vercel Postgres
  if (process.env.POSTGRES_URL) {
    if (!isPostgresInitialized) {
      await sql`CREATE TABLE IF NOT EXISTS categories (id SERIAL PRIMARY KEY, name TEXT)`;
      await sql`CREATE TABLE IF NOT EXISTS customers (id SERIAL PRIMARY KEY, name TEXT, phone TEXT UNIQUE)`;
      await sql`CREATE TABLE IF NOT EXISTS products (id SERIAL PRIMARY KEY, name TEXT, description TEXT, price REAL, imageUrl TEXT, categoryId INTEGER)`;
      isPostgresInitialized = true;
    }

    // Return an adapter that matches the SQLite API so we don't have to rewrite everything
    return {
      all: async (query, params = []) => {
        // Simple hacky conversion from SQLite ? to Postgres $1, $2
        let pgQuery = query;
        params.forEach((_, i) => {
          pgQuery = pgQuery.replace('?', `$${i + 1}`);
        });
        
        const result = await sql.query(pgQuery, params);
        return result.rows;
      },
      run: async (query, params = []) => {
        let pgQuery = query;
        params.forEach((_, i) => {
          pgQuery = pgQuery.replace('?', `$${i + 1}`);
        });

        // Add RETURNING id for inserts
        if (pgQuery.trim().toUpperCase().startsWith('INSERT')) {
          pgQuery += ' RETURNING id';
        }

        const result = await sql.query(pgQuery, params);
        return { lastID: result.rows[0]?.id };
      }
    };
  }

  // Otherwise, use local SQLite database
  if (!localDb) {
    localDb = await open({
      filename: './shop.sqlite',
      driver: sqlite3.Database
    });

    await localDb.exec(`
      CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        price REAL NOT NULL,
        imageUrl TEXT,
        categoryId INTEGER,
        FOREIGN KEY(categoryId) REFERENCES categories(id)
      );
      CREATE TABLE IF NOT EXISTS customers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        phone TEXT NOT NULL UNIQUE
      );
    `);
  }
  return localDb;
}

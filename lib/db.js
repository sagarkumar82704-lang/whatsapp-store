import { createPool } from '@vercel/postgres';

let localDb = null;
let pool = null;

export async function openDb() {
  const dbUrl = process.env.POSTGRES_URL || process.env.DATABASE_URL;
  // If we are on Vercel and have POSTGRES_URL or DATABASE_URL, use Vercel Postgres
  if (dbUrl) {
    if (!pool) {
      pool = createPool({ connectionString: dbUrl });
      await pool.query(`CREATE TABLE IF NOT EXISTS categories (id SERIAL PRIMARY KEY, name TEXT, description TEXT)`);
      // Add description column if it doesn't exist (for existing tables)
      try { await pool.query(`ALTER TABLE categories ADD COLUMN IF NOT EXISTS description TEXT`); } catch(e) {}
      await pool.query(`CREATE TABLE IF NOT EXISTS customers (id SERIAL PRIMARY KEY, name TEXT, phone TEXT UNIQUE)`);
      await pool.query(`CREATE TABLE IF NOT EXISTS products (id SERIAL PRIMARY KEY, name TEXT, description TEXT, price REAL, imageUrl TEXT, categoryId INTEGER)`);
    }

    // Return an adapter that matches the SQLite API so we don't have to rewrite everything
    return {
      all: async (query, params = []) => {
        // Simple hacky conversion from SQLite ? to Postgres $1, $2
        let pgQuery = query;
        params.forEach((_, i) => {
          pgQuery = pgQuery.replace('?', `$${i + 1}`);
        });
        
        const result = await pool.query(pgQuery, params);
        return result.rows;
      },
      get: async (query, params = []) => {
        let pgQuery = query;
        params.forEach((_, i) => {
          pgQuery = pgQuery.replace('?', `$${i + 1}`);
        });
        
        const result = await pool.query(pgQuery, params);
        return result.rows[0];
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

        const result = await pool.query(pgQuery, params);
        return { lastID: result.rows[0]?.id };
      }
    };
  }

  // Otherwise, use local SQLite database
  if (!localDb) {
    const sqlite3 = (await import('sqlite3')).default;
    const { open } = await import('sqlite');
    
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

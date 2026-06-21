import { NextResponse } from 'next/server';
import { openDb } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const db = await openDb();
  const categories = await db.all('SELECT * FROM categories ORDER BY id DESC');
  return NextResponse.json(categories);
}

export async function POST(request) {
  const { name, description } = await request.json();
  const db = await openDb();
  try {
    const result = await db.run('INSERT INTO categories (name, description) VALUES (?, ?)', [name, description]);
    return NextResponse.json({ id: result.lastID, name, description }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Category name might already exist.' }, { status: 400 });
  }
}

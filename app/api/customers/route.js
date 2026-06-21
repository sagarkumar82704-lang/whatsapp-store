import { NextResponse } from 'next/server';
import { openDb } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const db = await openDb();
  const customers = await db.all('SELECT * FROM customers ORDER BY id DESC');
  return NextResponse.json(customers);
}

export async function POST(request) {
  const { name, phone } = await request.json();
  const db = await openDb();
  try {
    // Basic formatting: ensure it's a number
    const formattedPhone = phone.replace(/[^0-9]/g, '');
    const result = await db.run('INSERT INTO customers (name, phone) VALUES (?, ?)', [name, formattedPhone]);
    return NextResponse.json({ id: result.lastID, name, phone: formattedPhone }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Phone number might already exist or invalid data.' }, { status: 400 });
  }
}

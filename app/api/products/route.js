import { NextResponse } from 'next/server';
import { openDb } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const db = await openDb();
  const products = await db.all(`
    SELECT products.*, categories.name as categoryName 
    FROM products 
    LEFT JOIN categories ON products.categoryId = categories.id 
    ORDER BY products.id DESC
  `);
  return NextResponse.json(products);
}

export async function POST(request) {
  const { name, description, price, categoryId, imageUrl } = await request.json();
  const db = await openDb();
  try {
    const result = await db.run(
      'INSERT INTO products (name, description, price, categoryId, imageUrl) VALUES (?, ?, ?, ?, ?)',
      [name, description, price, categoryId, imageUrl]
    );
    return NextResponse.json({ id: result.lastID, name }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

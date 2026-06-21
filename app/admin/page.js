import { openDb } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const db = await openDb();
  
  // Fetch stats
  const productsResult = await db.get('SELECT COUNT(*) as count FROM products');
  const categoriesResult = await db.get('SELECT COUNT(*) as count FROM categories');
  const customersResult = await db.get('SELECT COUNT(*) as count FROM customers');
  
  const stats = {
    products: productsResult?.count || 0,
    categories: categoriesResult?.count || 0,
    customers: customersResult?.count || 0,
  };

  return (
    <div>
      <h2 style={{ marginBottom: '20px' }}>Dashboard Overview</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
        <div className="card glass">
          <h3 style={{ color: 'var(--text-muted)' }}>Total Products</h3>
          <p style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>{stats.products}</p>
        </div>
        
        <div className="card glass">
          <h3 style={{ color: 'var(--text-muted)' }}>Total Categories</h3>
          <p style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>{stats.categories}</p>
        </div>
        
        <div className="card glass">
          <h3 style={{ color: 'var(--text-muted)' }}>Saved Customers</h3>
          <p style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>{stats.customers}</p>
        </div>
      </div>
      
      <div className="card glass" style={{ marginTop: '40px' }}>
        <h3>Quick Actions</h3>
        <div style={{ display: 'flex', gap: '15px', marginTop: '20px' }}>
          <a href="/admin/products/new" className="btn-primary">Add New Product</a>
          <a href="/admin/customers" className="btn-primary">Send WhatsApp Message</a>
        </div>
      </div>
    </div>
  );
}

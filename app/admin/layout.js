import Link from 'next/link';
import './admin.css'; // We will create this

export const metadata = {
  title: 'Admin Panel - My Shop',
  description: 'Manage your WhatsApp Store',
};

export default function AdminLayout({ children }) {
  return (
    <div className="admin-container">
      <aside className="admin-sidebar glass">
        <div className="sidebar-header">
          <h2>Shop Admin</h2>
        </div>
        <nav className="sidebar-nav">
          <Link href="/admin" className="nav-link">Dashboard</Link>
          <Link href="/admin/products" className="nav-link">Products</Link>
          <Link href="/admin/categories" className="nav-link">Categories</Link>
          <Link href="/admin/customers" className="nav-link">Customers (CRM)</Link>
        </nav>
        <div className="sidebar-footer">
          <Link href="/" className="nav-link">View Store</Link>
        </div>
      </aside>
      
      <main className="admin-main">
        <header className="admin-header glass">
          <h1>Admin Dashboard</h1>
        </header>
        <div className="admin-content animate-fade-in">
          {children}
        </div>
      </main>
    </div>
  );
}

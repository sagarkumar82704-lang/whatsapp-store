'use client';

import { useState, useEffect } from 'react';

export default function CustomerStorefront() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    const res = await fetch('/api/products');
    const data = await res.json();
    setProducts(data);
  };

  const fetchCategories = async () => {
    const res = await fetch('/api/categories');
    const data = await res.json();
    setCategories(data);
  };

  const addToCart = (product) => {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      setCart(cart.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

  const placeOrderViaWhatsApp = () => {
    let orderText = `*New Order!*\n\n`;
    cart.forEach(item => {
      orderText += `- ${item.quantity}x ${item.name} (₹${item.price})\n`;
    });
    orderText += `\n*Total: ₹${cartTotal}*`;
    
    // Replace YOUR_PHONE_NUMBER with the actual shop owner's number
    // We will leave it empty so it just uses a generic wa.me link for testing, but typically the store owner puts their number here.
    // For this app, let's use a generic share link
    const encodedMessage = encodeURIComponent(orderText);
    window.open(`https://wa.me/?text=${encodedMessage}`, '_blank');
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || p.categoryName === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div style={{ paddingBottom: '100px' }}>
      <header className="glass" style={{ padding: '20px', position: 'sticky', top: 0, zIndex: 100, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ color: 'var(--primary-color)' }}>🛍️ My Shop</h1>
        <button className="btn-primary" onClick={() => setIsCartOpen(true)} style={{ position: 'relative' }}>
          🛒 Cart
          {cart.length > 0 && (
            <span style={{ position: 'absolute', top: '-10px', right: '-10px', background: 'red', color: 'white', borderRadius: '50%', padding: '2px 8px', fontSize: '0.8rem' }}>
              {cart.reduce((total, item) => total + item.quantity, 0)}
            </span>
          )}
        </button>
      </header>

      <div className="container" style={{ marginTop: '30px' }}>
        {/* Search & Filters */}
        <div className="card glass" style={{ marginBottom: '30px', display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
          <input 
            type="text" 
            placeholder="Search products..." 
            className="input-field" 
            style={{ flex: 2, marginBottom: 0 }}
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <select 
            className="input-field" 
            style={{ flex: 1, marginBottom: 0 }}
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
          >
            <option value="All">All Categories</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.name}>{cat.name}</option>
            ))}
          </select>
        </div>

        {/* Product Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
          {filteredProducts.map(product => (
            <div key={product.id} className="card glass animate-fade-in" style={{ display: 'flex', flexDirection: 'column' }}>
              {product.imageUrl ? (
                <img src={product.imageUrl} alt={product.name} style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px', marginBottom: '15px' }} />
              ) : (
                <div style={{ width: '100%', height: '200px', backgroundColor: '#334155', borderRadius: '8px', marginBottom: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>No Image</div>
              )}
              <h3 style={{ marginBottom: '5px' }}>{product.name}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '15px', flex: 1 }}>{product.description}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>₹{product.price}</span>
                <button onClick={() => addToCart(product)} className="btn-primary" style={{ padding: '8px 15px', fontSize: '0.9rem' }}>+ Add</button>
              </div>
            </div>
          ))}
          {filteredProducts.length === 0 && (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '50px' }}>
              <h3 style={{ color: 'var(--text-muted)' }}>No products found.</h3>
            </div>
          )}
        </div>
      </div>

      {/* Cart Modal / Sidebar */}
      {isCartOpen && (
        <div style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: '100%', maxWidth: '400px', background: 'var(--surface-color)', zIndex: 1000, boxShadow: '-5px 0 15px rgba(0,0,0,0.5)', display: 'flex', flexDirection: 'column' }} className="animate-fade-in">
          <div style={{ padding: '20px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2>Your Cart</h2>
            <button onClick={() => setIsCartOpen(false)} style={{ fontSize: '1.5rem', color: 'var(--text-main)' }}>&times;</button>
          </div>
          
          <div style={{ padding: '20px', flex: 1, overflowY: 'auto' }}>
            {cart.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', textAlign: 'center', marginTop: '50px' }}>Your cart is empty.</p>
            ) : (
              cart.map(item => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', paddingBottom: '15px', borderBottom: '1px solid var(--border-color)' }}>
                  <div>
                    <h4 style={{ marginBottom: '5px' }}>{item.name}</h4>
                    <span style={{ color: 'var(--text-muted)' }}>₹{item.price} x {item.quantity}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <strong>₹{item.price * item.quantity}</strong>
                    <button onClick={() => removeFromCart(item.id)} style={{ color: 'var(--danger-color)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}>&times;</button>
                  </div>
                </div>
              ))
            )}
          </div>
          
          {cart.length > 0 && (
            <div style={{ padding: '20px', borderTop: '1px solid var(--border-color)', background: 'var(--bg-color)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', fontSize: '1.2rem', fontWeight: 'bold' }}>
                <span>Total:</span>
                <span style={{ color: 'var(--primary-color)' }}>₹{cartTotal}</span>
              </div>
              <button onClick={placeOrderViaWhatsApp} className="btn-primary" style={{ width: '100%', fontSize: '1.1rem', padding: '15px' }}>
                Order via WhatsApp 💬
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

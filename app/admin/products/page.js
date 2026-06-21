'use client';

import { useState, useEffect } from 'react';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  
  const [loading, setLoading] = useState(false);

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

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        name, 
        description, 
        price: parseFloat(price), 
        categoryId: parseInt(categoryId), 
        imageUrl 
      })
    });
    
    if (res.ok) {
      setName('');
      setDescription('');
      setPrice('');
      setCategoryId('');
      setImageUrl('');
      fetchProducts();
    } else {
      const data = await res.json();
      alert(data.error);
    }
    setLoading(false);
  };

  return (
    <div>
      <h2 style={{ marginBottom: '20px' }}>Product Management</h2>

      <div className="card glass" style={{ marginBottom: '30px' }}>
        <h3>Add New Product</h3>
        <form onSubmit={handleAddProduct} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '15px' }}>
          
          <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
            <input 
              type="text" 
              placeholder="Product Name" 
              className="input-field" 
              style={{ flex: 1, marginBottom: 0 }}
              value={name}
              onChange={e => setName(e.target.value)}
              required 
            />
            <input 
              type="number" 
              placeholder="Price (₹)" 
              className="input-field" 
              style={{ flex: 1, marginBottom: 0 }}
              value={price}
              onChange={e => setPrice(e.target.value)}
              required 
            />
            <select 
              className="input-field" 
              style={{ flex: 1, marginBottom: 0 }}
              value={categoryId}
              onChange={e => setCategoryId(e.target.value)}
              required
            >
              <option value="" disabled>Select Category</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
            <input 
              type="text" 
              placeholder="Image URL (e.g. https://...)" 
              className="input-field" 
              style={{ flex: 1, marginBottom: 0 }}
              value={imageUrl}
              onChange={e => setImageUrl(e.target.value)}
            />
            <input 
              type="text" 
              placeholder="Description" 
              className="input-field" 
              style={{ flex: 2, marginBottom: 0 }}
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
          </div>

          <button type="submit" className="btn-primary" disabled={loading} style={{ alignSelf: 'flex-start' }}>
            {loading ? 'Adding...' : 'Add Product'}
          </button>
        </form>
      </div>

      <div className="card glass">
        <h3>Product Inventory</h3>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.id}>
                  <td>
                    {product.imageUrl ? (
                      <img src={product.imageUrl} alt={product.name} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '8px' }} />
                    ) : (
                      <div style={{ width: '50px', height: '50px', backgroundColor: '#334155', borderRadius: '8px' }}></div>
                    )}
                  </td>
                  <td><strong>{product.name}</strong><br/><small style={{ color: 'var(--text-muted)' }}>{product.description}</small></td>
                  <td>{product.categoryName}</td>
                  <td>₹{product.price}</td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', padding: '20px' }}>No products added yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const res = await fetch('/api/categories');
    const data = await res.json();
    setCategories(data);
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, description })
    });
    
    if (res.ok) {
      setName('');
      setDescription('');
      fetchCategories();
    } else {
      const data = await res.json();
      alert(data.error);
    }
    setLoading(false);
  };

  return (
    <div>
      <h2 style={{ marginBottom: '20px' }}>Category Management</h2>

      <div className="card glass" style={{ marginBottom: '30px' }}>
        <h3>Add New Category</h3>
        <form onSubmit={handleAddCategory} style={{ display: 'flex', gap: '15px', marginTop: '15px', flexWrap: 'wrap' }}>
          <input 
            type="text" 
            placeholder="Category Name (e.g., T-Shirts)" 
            className="input-field" 
            style={{ flex: 1, marginBottom: 0 }}
            value={name}
            onChange={e => setName(e.target.value)}
            required 
          />
          <input 
            type="text" 
            placeholder="Description (Optional)" 
            className="input-field" 
            style={{ flex: 2, marginBottom: 0 }}
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Adding...' : 'Add Category'}
          </button>
        </form>
      </div>

      <div className="card glass">
        <h3>Existing Categories</h3>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {categories.map(category => (
                <tr key={category.id}>
                  <td>{category.id}</td>
                  <td><strong>{category.name}</strong></td>
                  <td>{category.description || '-'}</td>
                </tr>
              ))}
              {categories.length === 0 && (
                <tr>
                  <td colSpan="3" style={{ textAlign: 'center', padding: '20px' }}>No categories added yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';

export default function CustomersCRM() {
  const [customers, setCustomers] = useState([]);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [publicUrl, setPublicUrl] = useState('');

  useEffect(() => {
    fetchCustomers();
    const savedUrl = localStorage.getItem('publicStoreUrl');
    if (savedUrl) setPublicUrl(savedUrl);
  }, []);

  const handleSavePublicUrl = (e) => {
    setPublicUrl(e.target.value);
    localStorage.setItem('publicStoreUrl', e.target.value);
  };

  const fetchCustomers = async () => {
    const res = await fetch('/api/customers');
    const data = await res.json();
    setCustomers(data);
  };

  const handleAddCustomer = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch('/api/customers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, phone })
    });
    
    if (res.ok) {
      setName('');
      setPhone('');
      fetchCustomers();
    } else {
      const data = await res.json();
      alert(data.error);
    }
    setLoading(false);
  };

  const storeUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
  const defaultMessage = `Hello from My Shop! Check out our latest products here: ${publicUrl || storeUrl}`;

  const copyBroadcastMessage = () => {
    if (!publicUrl) {
      alert("Please enter your Public Live Link first!");
      return;
    }
    navigator.clipboard.writeText(defaultMessage);
    alert('Message & Link copied! Now paste this in your WhatsApp Broadcast list.');
  };

  const openWhatsApp = (customerPhone, customerName) => {
    if (!publicUrl) {
      alert("Please enter your Public Live Link first!");
      return;
    }
    const personalizedMessage = `Hi ${customerName}, check out our new stock: ${publicUrl}`;
    const encodedMessage = encodeURIComponent(personalizedMessage);
    // Ensure phone has country code (assuming India +91 as default if missing)
    let finalPhone = customerPhone;
    if (finalPhone.length === 10) finalPhone = '91' + finalPhone;
    
    window.open(`https://wa.me/${finalPhone}?text=${encodedMessage}`, '_blank');
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Customer Management (CRM)</h2>
        <button onClick={copyBroadcastMessage} className="btn-primary" style={{ backgroundColor: '#128C7E' }}>
          📋 Copy Broadcast Message
        </button>
      </div>

      <div className="card glass" style={{ marginBottom: '30px', borderLeft: '4px solid var(--primary-color)' }}>
        <h3>🌐 Set Public Link (For WhatsApp)</h3>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '10px' }}>Enter the live internet link of your store below. This link will be sent to customers.</p>
        <input 
          type="text" 
          placeholder="e.g. https://myshop-testing-2026.loca.lt" 
          className="input-field" 
          value={publicUrl}
          onChange={handleSavePublicUrl}
          style={{ marginBottom: 0 }}
        />
      </div>

      <div className="card glass" style={{ marginBottom: '30px' }}>
        <h3>Add New Customer</h3>
        <form onSubmit={handleAddCustomer} style={{ display: 'flex', gap: '15px', marginTop: '15px', flexWrap: 'wrap' }}>
          <input 
            type="text" 
            placeholder="Customer Name" 
            className="input-field" 
            style={{ flex: 1, marginBottom: 0 }}
            value={name}
            onChange={e => setName(e.target.value)}
            required 
          />
          <input 
            type="text" 
            placeholder="WhatsApp Number (e.g. 9876543210)" 
            className="input-field" 
            style={{ flex: 1, marginBottom: 0 }}
            value={phone}
            onChange={e => setPhone(e.target.value)}
            required 
          />
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Adding...' : 'Add Customer'}
          </button>
        </form>
      </div>

      <div className="card glass">
        <h3>Customer List</h3>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>WhatsApp Number</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {customers.map(customer => (
                <tr key={customer.id}>
                  <td>{customer.id}</td>
                  <td>{customer.name}</td>
                  <td>+{customer.phone}</td>
                  <td>
                    <button 
                      onClick={() => openWhatsApp(customer.phone, customer.name)} 
                      className="btn-primary"
                      style={{ fontSize: '0.9rem', padding: '6px 12px' }}
                    >
                      💬 Send Message
                    </button>
                  </td>
                </tr>
              ))}
              {customers.length === 0 && (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', padding: '20px' }}>No customers added yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

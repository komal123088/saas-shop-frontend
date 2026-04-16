import React, { useState, useEffect } from 'react';
import api from '../api/api';

const ApiTest = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    testAPI();
  }, []);

  const testAPI = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔍 Testing API endpoints...');
      
      // Test health endpoint
      const health = await api.get('/health');
      console.log('✅ Health check:', health.data);
      
      // Test products
      const productsRes = await api.get('/products');
      console.log('✅ Products:', productsRes.data);
      setProducts(productsRes.data.products || productsRes.data || []);
      
      // Test categories
      const categoriesRes = await api.get('/categories');
      console.log('✅ Categories:', categoriesRes.data);
      setCategories(categoriesRes.data || []);
      
      // Test settings
      const settingsRes = await api.get('/shop-settings');
      console.log('✅ Settings:', settingsRes.data);
      setSettings(settingsRes.data);
      
    } catch (err) {
      console.error('❌ API Test Failed:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Testing API connection...</div>;
  
  if (error) return (
    <div style={{ padding: '20px', color: 'red' }}>
      <h3>❌ API Error</h3>
      <p>{error}</p>
      <button onClick={testAPI}>Retry</button>
    </div>
  );

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h2>✅ API Test Results</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <h3>Products: {products.length}</h3>
        <pre>{JSON.stringify(products.slice(0, 2), null, 2)}</pre>
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <h3>Categories: {categories.length}</h3>
        <pre>{JSON.stringify(categories.slice(0, 2), null, 2)}</pre>
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <h3>Settings:</h3>
        <pre>{JSON.stringify(settings, null, 2)}</pre>
      </div>
      
      <button onClick={testAPI}>Refresh</button>
    </div>
  );
};

export default ApiTest;
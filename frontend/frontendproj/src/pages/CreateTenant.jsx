// pages/CreateTenant.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './CreateTenant.css';

const BACKEND_URL = "https://multi-tenant-notes-fawn.vercel.app";

const CreateTenant = () => {
  const [name, setName] = useState('');
  const [domain, setDomain] = useState('');
  const [plan, setPlan] = useState('FREE');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${BACKEND_URL}/tenants`, { name, domain, plan });
      alert('Tenant created successfully');
      navigate('/'); // Redirect to login page
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || 'Failed to create tenant');
    }
  };

  return (
    <div className="create-tenant-container">
      <h2>Create Tenant</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Tenant Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <input type="text" placeholder="Domain (example: acme.test)" value={domain} onChange={(e) => setDomain(e.target.value)} required />
        <select value={plan} onChange={(e) => setPlan(e.target.value)}>
          <option value="FREE">Free</option>
          <option value="PRO">Pro</option>
        </select>
        <button type="submit">Create Tenant</button>
      </form>
    </div>
  );
};

export default CreateTenant;

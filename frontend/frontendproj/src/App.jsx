import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import NoteView from './pages/NoteView';
import CreateTenant from './pages/CreateTenant';
 // ✅ Import NoteView component
import './App.css';

const App = () => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (user) localStorage.setItem('user', JSON.stringify(user));
  }, [user]);

  return (
    <Router>
      <div className="app-title">Multi-Tenancy App</div>

      <Routes>
        <Route path="/" element={<Login setUser={setUser} />} />
        <Route path="/createtenant" element={<CreateTenant />} />

        {/* Dashboard route */}
        <Route
          path="/dashboard/:slug"
          element={user ? <Dashboard user={user} /> : <Navigate to="/" />}
        />

        {/* Note view route */}
        <Route
          path="/notes/:noteId"
          element={user ? <NoteView user={user} /> : <Navigate to="/" />}
        />
      </Routes>
    </Router>
  );
};

export default App;

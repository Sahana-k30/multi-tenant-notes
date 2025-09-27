import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Dashboard.css';

const BASE_URL='https://tenantnewbe.vercel.app';


const Dashboard = ({ user }) => {
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newNote, setNewNote] = useState({ title: '', content: '' });

  useEffect(() => {
    if (!user) return;
    fetchNotes();
  }, [user]);

  const fetchNotes = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${BASE_URL}/notes`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotes(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const handleUpgrade = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${BASE_URL}/tenants/${user.tenant.slug}/upgrade`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Tenant upgraded to PRO');
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert('Upgrade failed');
    }
  };

  const handleInvite = async () => {
    const email = prompt('Enter email to invite:');
    if (!email) return;
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${BASE_URL}/tenants/${user.tenant.slug}/invite`,
        { email },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('User invited successfully');
    } catch (err) {
      console.error(err);
      alert('Invitation failed');
    }
  };

  const handleCreateNote = async () => {
    if (!newNote.title || !newNote.content) return alert('Please fill all fields');
    try {
      const token = localStorage.getItem('token');
      await axios.post('${BASE_URL}/notes', newNote, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNewNote({ title: '', content: '' });
      fetchNotes();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || 'Failed to create note');
    }
  };

  const handleEditNote = async (note) => {
    const title = prompt('New title:', note.title);
    const content = prompt('New content:', note.content);
    if (!title || !content) return;
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${BASE_URL}/notes/${note._id}`, { title, content }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchNotes();
    } catch (err) {
      console.error(err);
      alert('Failed to edit note');
    }
  };

  const handleDeleteNote = async (id) => {
    if (!window.confirm('Are you sure to delete this note?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${BASE_URL}/notes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchNotes();
    } catch (err) {
      console.error(err);
      alert('Failed to delete note');
    }
  };

  if (!user) return <p>Please login first.</p>;
  if (loading) return <p>Loading...</p>;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="header-title">
          <h1>Multi-Tenancy Dashboard</h1>
          <p className="subtitle">Manage your tenant, users, and notes seamlessly</p>
        </div>
        <div className="header-user-info">
          <p><strong>User:</strong> {user.email}</p>
          <p><strong>Role:</strong> {user.role}</p>
          <p><strong>Tenant:</strong> {user.tenant?.name} ({user.tenant?.plan})</p>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </div>

      {user.role === 'ADMIN' && (
        <div className="admin-actions">
          <button onClick={handleUpgrade} className="admin-btn">Upgrade to PRO</button>
          <button onClick={handleInvite} className="admin-btn">Invite User</button>
        </div>
      )}

      {user.role === 'MEMBER' && (
        <div className="create-note">
          <input
            type="text"
            placeholder="Title"
            value={newNote.title}
            onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
          />
          <input
            type="text"
            placeholder="Content"
            value={newNote.content}
            onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
          />
          <button onClick={handleCreateNote}>Create Note</button>
        </div>
      )}

      <ul className="notes-list">
        {notes.length === 0 ? (
          <p>No notes available.</p>
        ) : (
          notes.map((note) => (
            <li key={note._id}>
              <h4>{note.title}</h4>
              <p>{note.content.substring(0, 50)}...</p>
              <div className="note-buttons">
                {user.role === 'MEMBER' && (
                  <>
                    <button onClick={() => handleEditNote(note)}>Edit</button>
                    <button onClick={() => handleDeleteNote(note._id)}>Delete</button>
                  </>
                )}
                <button onClick={() => navigate(`/notes/${note._id}`)}>View</button>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default Dashboard;

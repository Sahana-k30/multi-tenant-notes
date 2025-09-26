// src/pages/NoteView.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './NoteView.css';

const NoteView = ({ user }) => {
  const { noteId } = useParams();
  const navigate = useNavigate();
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`http://localhost:4000/notes/${noteId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNote(res.data);
      } catch (err) {
        console.error(err);
        alert('Failed to fetch note');
      } finally {
        setLoading(false);
      }
    };
    fetchNote();
  }, [noteId]);

  if (!user) return <p>Please login first.</p>;
  if (loading) return <p>Loading...</p>;

  return (
    <div className="noteview-container">
      <div className="noteview-header">
        <h2>View Note</h2>
        <button
          className="logout-btn"
          onClick={() => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            navigate('/');
          }}
        >
          Logout
        </button>
      </div>

      {note ? (
        <div className="noteview-content">
          <h3>{note.title}</h3>
          <p>{note.content}</p>
        </div>
      ) : (
        <p>Note not found</p>
      )}

      <button className="back-btn" onClick={() => navigate(-1)}>Back</button>
    </div>
  );
};

export default NoteView;

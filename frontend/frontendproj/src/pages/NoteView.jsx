import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './NoteView.css';

const BACKEND_URL = "http://localhost:4000";

const NoteView = ({ user }) => {
  const { noteId } = useParams();
  const navigate = useNavigate();
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${BACKEND_URL}/notes/${noteId}`, {
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
    <div>
      {note ? (
        <>
          <h3>{note.title}</h3>
          <p>{note.content}</p>
        </>
      ) : (
        <p>Note not found</p>
      )}
      <button onClick={() => navigate(-1)}>Back</button>
    </div>
  );
};

export default NoteView;

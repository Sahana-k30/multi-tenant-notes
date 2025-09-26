// routes/notes.js
const express = require('express');
const router = express.Router();
const Note = require('../models/note');
const auth = require('../middleware/auth');

router.use(auth); // all endpoints require authentication

// GET /notes - list tenant notes
router.get('/', async (req, res) => {
  try {
    const notes = await Note.find({ tenant: req.tenant._id }).sort({ createdAt: -1 });
    res.json(notes);
  } catch (err) {
    console.error('Get notes error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /notes - create note (both ADMIN & MEMBER allowed), enforce FREE limit
router.post('/', async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    // Subscription gating
    if (req.tenant.plan === 'FREE') {
      const count = await Note.countDocuments({ tenant: req.tenant._id });
      if (count >= 3) {
        return res.status(403).json({ error: 'Note limit reached. Upgrade to Pro.' });
      }
    }

    const { title, content } = req.body;
    if (!title) return res.status(400).json({ error: 'Title required' });

    const note = await Note.create({
      title,
      content: content || '',
      tenant: req.tenant._id,
      createdBy: req.user._id
    });

    res.status(201).json(note);
  } catch (err) {
    console.error('Create note error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /notes/:id - get single note (tenant-isolated)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const note = await Note.findOne({ _id: id, tenant: req.tenant._id });
    if (!note) return res.status(404).json({ error: 'Not found' });
    return res.json(note);
  } catch (err) {
    console.error('Get note error:', err);
    if (err.name === 'CastError') return res.status(400).json({ error: 'Invalid id' });
    return res.status(500).json({ error: 'Server error' });
  }
});

// PUT /notes/:id - update note (both ADMIN & MEMBER allowed)
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;
    if (!title) return res.status(400).json({ error: 'Title required' });

    const updated = await Note.findOneAndUpdate(
      { _id: id, tenant: req.tenant._id },
      { $set: { title, content, updatedAt: new Date() } },
      { new: true }
    );

    if (!updated) return res.status(404).json({ error: 'Not found or not authorized' });
    return res.json(updated);
  } catch (err) {
    console.error('Update note error:', err);
    if (err.name === 'CastError') return res.status(400).json({ error: 'Invalid id' });
    return res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /notes/:id - delete note (both ADMIN & MEMBER allowed)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Note.findOneAndDelete({ _id: id, tenant: req.tenant._id });
    if (!deleted) return res.status(404).json({ error: 'Not found or not authorized' });
    return res.json({ ok: true });
  } catch (err) {
    console.error('Delete note error:', err);
    if (err.name === 'CastError') return res.status(400).json({ error: 'Invalid id' });
    return res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;

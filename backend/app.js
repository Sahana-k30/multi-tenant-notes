// app.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');      // your existing auth route
const tenantsRoutes = require('./routes/tenants');
const notesRoutes = require('./routes/notes');

const app = express();

app.use(cors({
  origin: ["https://tenantsnew.vercel.app","http://localhost:3000"],
  credentials: true
}));

app.use(express.json());

// Health endpoint (required by the assignment)
app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.use('/auth', authRoutes);
app.use('/tenants', tenantsRoutes);
app.use('/notes', notesRoutes);

module.exports = app;

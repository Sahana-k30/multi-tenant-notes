// server.js
const mongoose = require('mongoose');
const app = require('./app');
require('dotenv').config();

const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
  })
  .catch(err => {
    console.error('Mongo connection error', err);
    process.exit(1);
  });

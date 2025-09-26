// seed.js
const mongoose = require('mongoose');
const Tenant = require('./models/tenant');
const User = require('./models/user');
const Note = require('./models/note');
require('dotenv').config();

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to DB');

  await Tenant.deleteMany({});
  await User.deleteMany({});
  await Note.deleteMany({});

  const acme = await Tenant.create({ name: 'Acme', domain: 'acme.test', slug: 'acme', plan: 'FREE' });
  const globex = await Tenant.create({ name: 'Globex', domain: 'globex.test', slug: 'globex', plan: 'FREE' });

  // Create users (plain password -> hashed by pre save hook)
  await new User({ email: 'admin@acme.test', password: 'password', role: 'ADMIN', tenant: acme._id }).save();
  await new User({ email: 'user@acme.test', password: 'password', role: 'MEMBER', tenant: acme._id }).save();
  await new User({ email: 'admin@globex.test', password: 'password', role: 'ADMIN', tenant: globex._id }).save();
  await new User({ email: 'user@globex.test', password: 'password', role: 'MEMBER', tenant: globex._id }).save();

  // Add some notes
  await Note.create({ title: 'Acme Note 1', content: 'First note for Acme', tenant: acme._id });
  await Note.create({ title: 'Acme Note 2', content: 'Second note for Acme', tenant: acme._id });
  await Note.create({ title: 'Globex Note 1', content: 'First note for Globex', tenant: globex._id });

  console.log('✅ Seed complete');
  mongoose.disconnect();
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});

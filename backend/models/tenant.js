// models/tenant.js
const mongoose = require('mongoose');

const TenantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  domain: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true },
  plan: { type: String, enum: ['FREE', 'PRO'], default: 'FREE' }
}, { timestamps: true });

module.exports = mongoose.model('Tenant', TenantSchema);

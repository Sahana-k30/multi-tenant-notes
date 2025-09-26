const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const role = require("../middleware/role");
const Tenant = require("../models/tenant");
const User = require("../models/user");

// --- Admin-only: upgrade subscription ---
router.post("/:slug/upgrade", auth, role("ADMIN"), async (req, res) => {
  try {
    const tenant = await Tenant.findOne({ slug: req.params.slug });
    if (!tenant) return res.status(404).json({ error: "Tenant not found" });

    tenant.plan = "PRO";
    await tenant.save();

    res.json({ message: "Tenant upgraded to PRO", tenant });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// --- Admin-only: invite user ---
router.post("/:slug/invite", auth, role("ADMIN"), async (req, res) => {
  try {
    const { email } = req.body;
    const tenant = await Tenant.findOne({ slug: req.params.slug });
    if (!tenant) return res.status(404).json({ error: "Tenant not found" });

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: "User already exists" });

    const newUser = new User({
      email,
      password: "changeme123", // you can later send invite email with reset link
      role: "MEMBER",
      tenant: tenant._id,
    });
    await newUser.save();

    res.json({ message: "User invited successfully", user: newUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

router.post('/tenants', async (req, res) => {
  try {
    const { name, domain, plan } = req.body;
    if (!name || !domain) return res.status(400).json({ error: 'Name and domain required' });

    const slug = domain.split('.')[0].toLowerCase();

    // Check if tenant exists
    const existingTenant = await Tenant.findOne({ slug });
    if (existingTenant) return res.status(400).json({ error: 'Tenant already exists' });

    const tenant = await Tenant.create({ name, domain, slug, plan: plan || 'FREE' });

    res.status(201).json({ message: 'Tenant created', tenant });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;

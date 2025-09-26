const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/user');

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user and populate tenant
    const user = await User.findOne({ email }).populate('tenant');
    if (!user) return res.status(401).json({ msg: 'Invalid credentials' });

    // Compare password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ msg: 'Invalid credentials' });

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, tenantId: user.tenant._id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      token,
      user: {
        email: user.email,
        role: user.role,
        tenant: {
          name: user.tenant.name,
          domain: user.tenant.domain,
          slug: user.tenant.slug,
          _id: user.tenant._id
        }
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;

const express = require("express");
const auth = require("../middleware/auth");
const Note = require("../models/note");

const router = express.Router();
router.use(auth);

// GET /dashboard
router.get("/", async (req, res) => {
  const notes = await Note.find({ tenant: req.tenant._id }).sort({ createdAt: -1 });
  res.json({
    tenant: req.tenant.name,
    user: req.user.email,
    notes
  });
});

module.exports = router;

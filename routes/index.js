const express = require("express");
const router = express.Router();

// GET |
router.get("/", (req, res) => {
  res.json({ message: "Test message" });
});

module.exports = router;

const express = require("express");
const router = express.Router();
const Notification = require("../models/Notification");
const authMiddleware = require("../middleware/authMiddleware");

// ✅ GET USER NOTIFICATIONS
router.get("/", authMiddleware, async (req, res) => {

  try {

    const notes = await Notification.find({
      userId: req.user.id
    }).sort({ createdAt: -1 });

    res.json(notes);

  } catch (err) {

    console.log(err);
    res.status(500).json({ message: "Server error" });

  }

});

module.exports = router;
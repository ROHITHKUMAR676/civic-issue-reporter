const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");
const Notification = require("../models/Notification");
const deptMiddleware = require("../middleware/deptMiddleware");
const passport = require("../config/passport");
const sendOTP = require("../utils/sendEmail");
router.post("/register", async (req, res) => {
  try {
    const { name, email, password ,role , department } = req.body;
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        message: "User already exists"
      });
    }


    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);


const otp = Math.floor(100000 + Math.random() * 900000).toString();

const user = await User.create({
  name,
  email,
  password: hashedPassword,
  role: role || "user",
  department: role === "dept" ? department : null,
  otp: otp,
  otpExpiry: Date.now() + 5 * 60 * 1000,
  isVerified: false
});

// send OTP email
await sendOTP(email, otp);


    res.status(201).json({
      message: "OTP sent to your email. Please verify."
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server error"
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

const user = await User.findOne({ email });

if (!user) {
  return res.status(400).json({
    message: "Invalid email or password"
  });
}

if (user.role === "user" && !user.isVerified) {
  return res.status(403).json({
    message: "Please verify your email with OTP first"
  });
}
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid email or password"
      });
    }

    const token = jwt.sign(
  { 
    id: user._id,
    role: user.role, 
    department: user.department || null
  },
  process.env.JWT_SECRET,
  { expiresIn: "7d" }
);


  res.status(200).json({
  message: "Login successful 🚀",
  token,
  role: user.role,
  department: user.department || null,
  user: {
    id: user._id,
    name: user.name,
    email: user.email
  }
});



  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server error"
    });
  }
});



// ✅ GET LOGGED IN USER
router.get("/me", authMiddleware, async (req, res) => {

  try {

    const user = await User.findById(req.user.id).select("-password");

    res.json(user);

  } catch (err) {

    res.status(500).json({ message: "Server error" });

  }

});
// ✅ UPDATE PHONE
router.put("/update-phone", authMiddleware, async (req, res) => {

  try {

    const { phone } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { phone },
      { new: true }
    ).select("-password");

    res.json(user);

  } catch (err) {

    res.status(500).json({ message: "Server error" });

  }

});
// ✅ GET USER NOTIFICATIONS
router.get("/notifications", authMiddleware, async (req, res) => {

  try {

    const notifications = await Notification.find({
      userId: req.user.id
    }).sort({ createdAt: -1 });

    res.json(notifications);

  } catch (err) {

    res.status(500).json({ message: "Server error" });

  }

});


router.get("/dept/me", deptMiddleware, (req, res) => {
  res.json({
    message: "Dept access granted ✅",
    department: req.user.department,
    userId: req.user.id
  });
});
// ================= GOOGLE LOGIN =================

// start google login
router.get("/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// google callback
router.get("/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login", session: false }),
  async (req, res) => {

    const userData = req.user;

    // check if user exists
   let user = await User.findOne({ email: userData.email });

if (!user) {
  user = await User.create({
    name: userData.name,
    email: userData.email,
    password: "google-oauth-user",
    role: "user",
    isVerified: true
  });
} else {
  // ensure Google users are always verified
  user.isVerified = true;
  await user.save();
}

    // generate JWT (same as your normal login)
    const token = jwt.sign(
      { id: user._id, role: user.role, department: user.department || null },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // redirect to frontend with token
    res.redirect(`https://civic-issue-reporter-track.vercel.app/google-success?token=${token}`);
  }
);
// ================= VERIFY OTP =================
router.post("/verify-otp", async (req, res) => {

  try {

    const { email, otp } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (user.isVerified) {
      return res.json({ message: "User already verified" });
    }

    if (user.otp !== otp || user.otpExpiry < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // ✅ mark verified
    user.isVerified = true;
    user.otp = null;
    user.otpExpiry = null;

    await user.save();

    res.json({ message: "Email verified successfully ✅" });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }

});
// ================= RESEND OTP =================
router.post("/resend-otp", async (req, res) => {

  try {

    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (user.isVerified) {
      return res.json({ message: "User already verified" });
    }

    // generate new OTP
    const otp = Math.floor(100000 + Math.random()*900000).toString();

    user.otp = otp;
    user.otpExpiry = Date.now() + 5*60*1000;

    await user.save();

    const sendOTP = require("../utils/sendEmail");
    await sendOTP(email, otp);

    res.json({ message: "New OTP sent to email" });

  } catch (error) {

    console.log(error);
    res.status(500).json({ message: "Server error" });

  }

});
module.exports = router;
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const notificationRoutes = require("./routes/notificationRoutes");
const authRoutes = require("./routes/authRoutes");
const issueRoutes = require("./routes/issueRoutes");
const cloudinary = require("./utils/cloudinary");
const upload = require("./middleware/upload");
const session = require("express-session");
const passport = require("./config/passport");
const app = express();
app.use(cors({
  origin: "*", // React app
  credentials: true,
}));
app.use(express.json());
app.use(
  session({
    secret: "civic-secret",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(express.urlencoded({ extended: true }));
app.use("/api/notifications", notificationRoutes);

app.use("/api", authRoutes);
app.use("/api/issues", issueRoutes);

app.use(passport.initialize());
app.use(passport.session());
mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log("✅ MongoDB Connected Successfully");
})
.catch((err) => {
    console.log("❌ MongoDB Connection Error:", err);
});


app.get("/", (req, res) => {
    res.send("API is running 🚀");
});


app.get("/cloud-test", async (req, res) => {
  try {
    const result = await cloudinary.api.ping();
    res.send(result);
  } catch (err) {
    res.status(500).send("Cloudinary connection failed");
  }
});


app.post("/upload-test", upload.single("image"), (req, res) => {
  res.send({
    message: "Image uploaded successfully!",
    imageUrl: req.file.path,
  });
});


const PORT = 5000;

app.listen(PORT, () => {
    console.log(`🔥 Server running on port ${PORT}`);
});

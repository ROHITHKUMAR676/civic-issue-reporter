const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
{
  name: {
    type: String,
    required: true,
    trim: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },

  // ⭐ password required ONLY if not Google user
  password: {
    type: String,
    minlength: 6,
    required: function () {
      return !this.googleId;
    },
  },

  // ⭐ store Google id
  googleId: {
    type: String,
    default: null,
  },
otp: String,

otpExpiry: Date,

isVerified: {
  type: Boolean,
  default: false
},
  role: {
    type: String,
    enum: ["user", "admin", "dept"],
    default: "user",
  },

  department: {
    type: String,
    enum: ["Roads", "Water", "Sanitation", "Electrical"],
    default: null,
  },

},
{ timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
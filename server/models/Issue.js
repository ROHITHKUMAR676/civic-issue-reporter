const mongoose = require("mongoose");

const issueSchema = new mongoose.Schema({

  title: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },

  imageUrl: {
    type: String,
    required: true,
  },

  location: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point",
    },
    coordinates: {
      type: [Number], // [lng, lat]
    },
    address: String,
  },

  status: {
  type: String,
  enum: [
    "Pending",
    "Approved",
    "In Progress",
    "Pending Verification",
    "Completed"
  ],
  default: "Pending",
},


  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
// ⭐ ADMIN WORKFLOW FIELDS
priority: {
  type: String,
  enum: ["Critical", "High", "Medium", "Normal"],
  default: "Normal",
},
slaDeadline: Date,
slaStatus: {
  type: String,
  default: "On Track"
},

department: {
  type: String,
  default: null,
},

assignedAt: {
  type: Date,
  default: null,
},

completedAt: {
  type: Date,
  default: null,
},
departmentProofImage: {
  type: String,
  default: null,
},
isClosed:{
  type:Boolean,
  default:false
},


  // ⭐⭐⭐⭐⭐ IMPORTANT
  upvotes: {
    type: Number,
    default: 0,
  },

  // Prevent duplicate votes
  upvotedUsers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],

}, { timestamps: true });

issueSchema.index({ location: "2dsphere" });


module.exports = mongoose.model("Issue", issueSchema);

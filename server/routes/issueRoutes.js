const express = require("express");
const router = express.Router();

const Issue = require("../models/Issue");
const upload = require("../middleware/upload");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const deptMiddleware = require("../middleware/deptMiddleware");


const getPriority = (title, description, upvotes = 0) => {

  const text = `${title} ${description}`.toLowerCase();

  const criticalWords = [
    "fire",
    "accident",
    "collapse",
    "gas leak",
    "explosion",
    "electric shock",
    "flood",
    "death"
  ];

  // 🚨 CRITICAL
  if (criticalWords.some(word => text.includes(word))) {
    return "Critical";
  }

  // 🔥 HIGH
  if (upvotes >= 10) return "High";

  // ⭐ MEDIUM
  if (upvotes >= 5) return "Medium";

  return "Normal";
};
//////////////////////////////////////////////////////////////
// 🔥 AUTO DEPARTMENT AI
//////////////////////////////////////////////////////////////

const getDepartment = (title, description) => {

  const text = `${title} ${description}`.toLowerCase();

  if (
    text.includes("water") ||
    text.includes("leak") ||
    text.includes("pipe") ||
    text.includes("drain")
  ) {
    return "Water";
  }

  if (
    text.includes("garbage") ||
    text.includes("trash") ||
    text.includes("waste") ||
    text.includes("smell")
  ) {
    return "Sanitation";
  }

  if (
    text.includes("road") ||
    text.includes("pothole") ||
    text.includes("traffic")
  ) {
    return "Roads";
  }

  if (
    text.includes("electric") ||
    text.includes("light") ||
    text.includes("power") ||
    text.includes("pole")
  ) {
    return "Electrical";
  }

  return null; // admin decides
};
// ✅ GET ISSUES FOR LOGGED-IN DEPARTMENT
router.get("/dept/issues", deptMiddleware, async (req, res) => {
  try {

 const issues = await Issue.aggregate([
  {
    $match: {
      department: req.user.department,
        status: { $ne: "Completed" }
    }
  },
  {
    $addFields: {

      // ⭐ PRIORITY RANKING
      priorityRank: {
        $switch: {
          branches: [
            { case: { $eq: ["$priority", "Critical"] }, then: 4 },
            { case: { $eq: ["$priority", "High"] }, then: 3 },
            { case: { $eq: ["$priority", "Medium"] }, then: 2 },
            { case: { $eq: ["$priority", "Normal"] }, then: 1 }
          ],
          default: 0
        }
      },

      // ⭐ SLA BREACH DETECTION
      slaStatusComputed: {
        $cond: {
          if: {
            $and: [
              { $lt: ["$slaDeadline", new Date()] },
              { $ne: ["$status", "Completed"] }
            ]
          },
          then: "Breached 🚨",
          else: "On Track ✅"
        }
      }

    }
  },
  {
    $sort: {
      priorityRank: -1,
      createdAt: -1
    }
  }
]);



    res.json(issues);

  } catch (err) {

    console.log(err);
    res.status(500).json({
      message: "Server error"
    });

  }
});

//////////////////////////////////////////////////////////////
// 🔥 SLA DEADLINE CALCULATOR
//////////////////////////////////////////////////////////////


//////////////////////////////////////////////////////////////
// ✅ GET NEARBY ISSUES
//////////////////////////////////////////////////////////////

router.get("/nearby", async (req, res) => {
  try {
    const { lat, lng } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({
        message: "Latitude and Longitude required",
      });
    }

    if (isNaN(lat) || isNaN(lng)) {
      return res.status(400).json({
        message: "Invalid coordinates",
      });
    }

    const issues = await Issue.find({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [Number(lng), Number(lat)],
          },
          $maxDistance: 5000,
        },
      },
    }).sort({ upvotes: -1 }); // ⭐ priority

    res.json(issues);

  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Error fetching nearby issues",
    });
  }
});

//////////////////////////////////////////////////////////////
// ✅ REPORT ISSUE
//////////////////////////////////////////////////////////////

router.post(
  "/report",
  authMiddleware, // ⭐ FIXED HERE
  upload.single("image"),
  async (req, res) => {
    try {

      const { title, description, lat, lng, address } = req.body;

      if (!req.file) {
        return res.status(400).json({
          message: "Image is required",
        });
      }
     const priority = getPriority(title, description);
const department = getDepartment(title, description);

// ⭐ create SLA ONLY if auto-assigned department exists
let slaDeadline = null;

if (department) {
  slaDeadline = new Date(Date.now() + 48 * 60 * 60 * 1000);
}

const newIssue = new Issue({
  title,
  description,
  imageUrl: req.file.path,

  location: {
    type: "Point",
    coordinates: [Number(lng), Number(lat)],
    address,
  },

  priority,
  department,
  slaDeadline,

  status: department ? "Approved" : "Pending",
  assignedAt: department ? new Date() : null,

  createdBy: req.user.id,
});


      await newIssue.save();
      const Notification = require("../models/Notification");
const User = require("../models/User");

const user = await User.findById(req.user.id);

await Notification.create({
  userId: req.user.id,
  title: "Complaint Received ✅",
  message: `Hello ${user.name},

Your complaint "${title}" has been received successfully.

We are very sorry for the inconvenience caused.
Our civic team will review and resolve it soon.

Thank you for helping improve the city ❤️`
});
      res.status(201).json({
        message: "✅ Issue reported successfully",
        issue: newIssue,
      });

    } catch (error) {

      console.error("ERROR REPORTING ISSUE:", error);

      res.status(500).json({
        message: "Error reporting issue",
        error: error.message,
      });
    }
  }
);


router.get("/dept/stats", deptMiddleware, async (req, res) => {
  try {

    const department = req.user.department;

    const total = await Issue.countDocuments({ department });

    const pending = await Issue.countDocuments({
      department,
      status: "Approved"
    });

    const inProgress = await Issue.countDocuments({
      department,
      status: "In Progress"
    });

    const verification = await Issue.countDocuments({
      department,
      status: "Pending Verification"
    });

    const completed = await Issue.countDocuments({
      department,
      status: "Completed"
    });

    res.json({
      total,
      pending,
      inProgress,
      verification,
      completed
    });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.get(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  async (req, res) => {
    try {

      const issues = await Issue.find();

const priorityOrder = {
  Critical: 4,
  High: 3,
  Medium: 2,
  Normal: 1,
};

issues.sort((a, b) => {

  if (priorityOrder[b.priority] !== priorityOrder[a.priority]) {
    return priorityOrder[b.priority] - priorityOrder[a.priority];
  }

  return b.upvotes - a.upvotes;
});


      res.json(issues);

    } catch (err) {
      res.status(500).json({
        message: "Error fetching issues",
      });
    }
  }
);

// ✅ DEPT PERFORMANCE SCORE
router.get("/dept/performance", deptMiddleware, async (req, res) => {
  try {
    const department = req.user.department;
    const now = new Date();

    const totalIssues = await Issue.countDocuments({ department });

    if (totalIssues === 0) {
      return res.json({
        department,
        performance: 100,
        message: "No issues assigned yet"
      });
    }

   const result = await Issue.aggregate([

  {
    $match: {
      department: department,
      status: "Completed",
      completedAt: { $ne: null },
      slaDeadline: { $ne: null }
    }
  },

  {
    $match: {
      $expr: {
        $lte: ["$completedAt", "$slaDeadline"]
      }
    }
  },

  {
    $count: "onTimeCompleted"
  }

]);

const onTimeCompleted = result[0]?.onTimeCompleted || 0;


    const performance = Math.round(
      (onTimeCompleted / totalIssues) * 100
    );

    res.json({
      department,
      totalIssues,
      onTimeCompleted,
      performance: `${performance}%`
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});


//////////////////////////////////////////////////////////////
// ✅ UPDATE STATUS (ADMIN)
//////////////////////////////////////////////////////////////

router.put(
  "/:id/status",
  authMiddleware,
  roleMiddleware("admin"),
  async (req, res) => {
    try {

      const { status } = req.body;

      const updatedIssue = await Issue.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true }
      );

      res.json(updatedIssue);

    } catch (error) {

      res.status(500).json({
        message: "Error updating status",
      });
    }
  }
);

//////////////////////////////////////////////////////////////
// ⭐ UPVOTE ISSUE
//////////////////////////////////////////////////////////////

router.put("/:id/upvote", authMiddleware, async (req, res) => {
  try {

    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({
        message: "Issue not found",
      });
    }

    const userId = req.user.id;

    // prevent duplicate votes
    if (issue.upvotedUsers.includes(userId)) {
      return res.status(400).json({
        message: "You already upvoted this issue",
      });
    }

    issue.upvotes += 1;
    issue.priority = getPriority(
  issue.title,
  issue.description,
  issue.upvotes
);

    issue.upvotedUsers.push(userId);

    await issue.save();
    
    res.json(issue);

  } catch (error) {

    res.status(500).json({
      message: "Error upvoting issue",
    });
  }
});

//////////////////////////////////////////////////////////////
// ✅ ASSIGN DEPARTMENT (ADMIN)
//////////////////////////////////////////////////////////////

router.put(
  "/:id/assign",
  authMiddleware,
  roleMiddleware("admin"),
  async (req, res) => {

    try {

      const { department } = req.body;

      const issue = await Issue.findByIdAndUpdate(
        
        req.params.id,
        {
          department,
          status: "Approved",
          assignedAt: new Date(),
          slaDeadline: new Date(Date.now() + 48 * 60 * 60 * 1000)
        },
        { new: true }
      );
// ⭐ notify complaint owner
await Notification.create({
  userId: issue.createdBy,
  title: "Complaint Approved 🏛️",
  message: `Your complaint "${issue.title}" has been approved and assigned to ${department} department.

Work will begin shortly.`
});
      ////////////////////////////////////////////////////////
      // ⭐ SEND NOTIFICATION TO DEPARTMENT USERS
      ////////////////////////////////////////////////////////

      const User = require("../models/User");
      const Notification = require("../models/Notification");

      const deptUsers = await User.find({
        role: "dept",
        department: department
      });

      for (const user of deptUsers) {

        await Notification.create({
          userId: user._id,
          title: "📢 New Issue Assigned",
          message: `New civic issue "${issue.title}" assigned to ${department} department`
        });

      }

      res.json(issue);

    } catch (err) {

      res.status(500).json({
        message: "Error assigning department",
      });

    }
  }
);
router.get("/my-latest", authMiddleware, async (req, res) => {

  try {

    const issue = await Issue.findOne({
      createdBy: req.user.id
    }).sort({ createdAt: -1 });

    res.json(issue);

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }

});


router.get(
  "/verification",
  authMiddleware,
  roleMiddleware("admin"),
  async (req, res) => {

    try {

      const issues = await Issue.find({
        status: "Pending Verification"
      }).sort({ completedAt: -1 });

      res.json(issues);

    } catch (error) {

      res.status(500).json({
        message: "Error fetching verification issues"
      });

    }
  }
);


router.put(
  "/:id/verify",
  authMiddleware,
  roleMiddleware("admin"),
  async (req, res) => {

    try {

      const issue = await Issue.findById(req.params.id);

if (!issue) {
  return res.status(404).json({ message: "Issue not found" });
}

issue.status = "Completed";
issue.completedAt = new Date();   // ⭐ VERY IMPORTANT

await issue.save();
const Notification = require("../models/Notification");

await Notification.create({
  userId: issue.createdBy,
  title: "Complaint Resolved 🎉",
  message: `Good news!

Your complaint "${issue.title}" has been successfully resolved and verified by the civic authority.

Thank you for helping keep the city better ❤️`
});
      res.json(issue);

    } catch (error) {

      res.status(500).json({
        message: "Error verifying issue"
      });

    }
  }
);
// ✅ DEPT UPDATE ISSUE STATUS
router.put("/dept/issues/:id/status", deptMiddleware, async (req, res) => {
  try {
    const { status } = req.body;

    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    // 🔒 SECURITY: dept can update ONLY its issues
    if (issue.department !== req.user.department) {
      return res.status(403).json({ message: "Not authorized" });
    }

    issue.status = status;

    // Optional timestamps
    if (status === "In Progress") {
      issue.assignedAt = new Date();
    }

    if (status === "Completed") {
      issue.completedAt = new Date();
    }

    await issue.save();
    // ⭐ notify admins for verification
const User = require("../models/User");
const Notification = require("../models/Notification");

const admins = await User.find({ role: "admin" });

for (const admin of admins) {
  await Notification.create({
    userId: admin._id,
    title: "Verification Required 🔍",
    message: `Department uploaded proof for "${issue.title}". Please verify.`
  });
}
    res.json({
      message: "Issue status updated successfully ✅",
      issue,
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.put(
  "/:id/complete",
  authMiddleware,
  async (req, res) => {

    try {

      const { proofImage } = req.body;

      const issue = await Issue.findByIdAndUpdate(
        req.params.id,
        {
          status: "Pending Verification",
          departmentProofImage: proofImage,
          completedAt: new Date(),
        },
        { new: true }
      );

      res.json(issue);

    } catch (error) {

      res.status(500).json({
        message: "Error marking completion",
      });
    }
  }
);
// ✅ DEPT UPLOAD PROOF IMAGE
router.put(
  "/dept/issues/:id/proof",
  deptMiddleware,
  upload.single("image"),
  async (req, res) => {
    try {

      const issue = await Issue.findById(req.params.id);

      if (!issue) {
        return res.status(404).json({ message: "Issue not found" });
      }

      // 🔒 Security check
      if (issue.department !== req.user.department) {
        return res.status(403).json({ message: "Not authorized" });
      }

      if (!req.file) {
        return res.status(400).json({ message: "No image uploaded" });
      }

      issue.departmentProofImage = req.file.path;
      issue.status = "Pending Verification"; 
      // Optional workflow improvement 🙂

      await issue.save();

   res.json(issue);




    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

//////////////////////////////////////////////////////////////
// ✅ GET SINGLE ISSUE
//////////////////////////////////////////////////////////////

router.get("/:id", async (req, res) => {
  try {

    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({
        message: "Issue not found",
      });
    }

    res.json(issue);

  } catch (error) {

    res.status(500).json({
      message: "Error fetching issue",
    });
  }
});

module.exports = router;

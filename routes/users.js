const express = require("express");
const { User } = require("../models/User");
const { authenticateToken } = require("../middleware/auth");

const router = express.Router();

// GET /users/me - Get current user profile
router.get("/me", authenticateToken, async (req, res) => {
  try {
    // req.userId is set by the authenticateToken middleware
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      message: "User profile retrieved successfully",
      data: {
        user: user.toJSON(),
      },
    });
  } catch (error) {
    console.error("Get user profile error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

module.exports = router;

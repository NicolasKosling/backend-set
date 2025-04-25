const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { verifyToken } = require("../middleware/authMiddleware");

// Public routes
router.post("/register", userController.register);
router.post("/login", userController.login);

// Get current user's profile
router.get("/me", verifyToken, userController.getMe);

// Protected routes
router.put("/:id", verifyToken, userController.updateUser);
router.get("/", verifyToken, userController.getUsers);

// Promote a user to teacher (teacher-only)
router.patch("/:id/promote", verifyToken, userController.promoteToTeacher);

// Assign a student to a class group (teacher-only)
router.post("/assign", verifyToken, userController.assignStudentToClassGroup);

module.exports = router;

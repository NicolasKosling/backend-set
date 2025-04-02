// routes/userRoutes.js
const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { verifyToken } = require("../middleware/authMiddleware");

// Public routes
router.post("/register", userController.register);
router.post("/login", userController.login);

// Protected route to update user
router.put("/:id", verifyToken, userController.updateUser);

// Protected route to get all users
router.get("/", verifyToken, userController.getUsers);

module.exports = router;

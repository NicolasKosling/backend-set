// routes/classRoutes.js
const express = require("express");
const router = express.Router();
const classController = require("../controllers/classController");
const { verifyToken } = require("../middleware/authMiddleware");

// All routes require authentication
router.use(verifyToken);

// Teacher-only: create, read, update, delete class groups
router.post("/", classController.createClassGroup);
router.get("/", classController.getClassGroups);
router.get("/:id", classController.getClassGroupById);
router.put("/:id", classController.updateClassGroup);
router.delete("/:id", classController.deleteClassGroup);

// Teacher-only: add students to a class group
router.post("/:id/students", classController.addStudent);

// Teacher or student: list students in a class group
router.get("/:id/students", classController.listStudents);

module.exports = router;

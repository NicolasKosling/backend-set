// routes/courseRoutes.js
const express = require("express");
const router = express.Router();
const courseCtrl = require("../controllers/courseController");
const { verifyToken } = require("../middleware/authMiddleware");

// All course routes require authentication
router.use(verifyToken);

// Create a new course
router.post("/", courseCtrl.createCourse);

// List courses (teacher sees their courses; students see enrolled)
router.get("/", courseCtrl.getCourses);

// Get one course by ID
router.get("/:id", courseCtrl.getCourseById);

// Update a course (teacher-only)
router.put("/:id", courseCtrl.updateCourse);

// Delete a course (teacher-only)
router.delete("/:id", courseCtrl.deleteCourse);

// Add a teacher to a course (teacher-only)
router.patch("/:id/teachers", courseCtrl.addTeacher);

// Enroll a student in a course (teacher-only)
router.patch("/:id/students", courseCtrl.addStudent);

module.exports = router;

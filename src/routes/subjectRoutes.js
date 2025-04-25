// routes/subjectRoutes.js
const express = require("express");
const router = express.Router({ mergeParams: true }); // allow access to :courseId
const subjectCtrl = require("../controllers/subjectController");
const { verifyToken } = require("../middleware/authMiddleware");

// All subject routes require authentication
router.use(verifyToken);

// GET    /api/courses/:courseId/subjects
router.get("/", subjectCtrl.getSubjectsByCourse);

// POST   /api/courses/:courseId/subjects
router.post("/", subjectCtrl.createSubject);

// GET    /api/courses/:courseId/subjects/:id
router.get("/:id", subjectCtrl.getSubjectById);

// PUT    /api/courses/:courseId/subjects/:id
router.put("/:id", subjectCtrl.updateSubject);

// DELETE /api/courses/:courseId/subjects/:id
router.delete("/:id", subjectCtrl.deleteSubject);

module.exports = router;

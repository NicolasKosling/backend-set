// routes/classRoutes.js
const express = require("express");
const router = express.Router();
const classController = require("../controllers/classController");
const { verifyToken } = require("../middleware/authMiddleware");

// All routes require authentication
router.use(verifyToken);

router.post("/", classController.createClassGroup);
router.get("/", classController.getClassGroups);
router.get("/:id", classController.getClassGroupById);
router.put("/:id", classController.updateClassGroup);
router.delete("/:id", classController.deleteClassGroup);

module.exports = router;

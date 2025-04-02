// routes/stagedayRoutes.js
const express = require("express");
const router = express.Router();
const stagedayController = require("../controllers/stagedayController");
const { verifyToken } = require("../middleware/authMiddleware");

// All routes require authentication
router.use(verifyToken);

router.post("/", stagedayController.createStageDay);
router.get("/", stagedayController.getStageDays);
router.get("/export/:studentId", stagedayController.exportPDF);
router.delete("/:id", stagedayController.deleteStageDay);

module.exports = router;

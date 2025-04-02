// server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middlewares
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

// Connect to MongoDB
mongoose
  .connect(
    process.env.MONGODB_URI || "mongodb://localhost:27017/student-eval",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

// Import Routes
const userRoutes = require("./routes/userRoutes");
const classRoutes = require("./routes/classRoutes");
const assignmentRoutes = require("./routes/assignmentRoutes");
const stagedayRoutes = require("./routes/stagedayRoutes");

// Use Routes
app.use("/api/users", userRoutes);
app.use("/api/classes", classRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/api/stagedays", stagedayRoutes);

// Error handling middleware (should be after routes)
const { errorHandler } = require("./middleware/errorHandler");
app.use(errorHandler);

// Export app for testing (if needed)
module.exports = app;

// Start server if not in test mode
if (process.env.NODE_ENV !== "test") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

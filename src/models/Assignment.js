// models/Assignment.js
const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema(
  {
    // Link to the specific Subject this assignment belongs to
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
    },

    naam: {
      type: String,
      required: true,
      trim: true,
    },
    beschrijving: {
      type: String,
      default: "",
    },
    deadline: {
      type: Date,
      default: null,
    },
    weging: {
      type: Number,
      default: 0,
    },

    // Submission & grading fields
    resultaat: {
      type: Number,
      default: null, // null until graded
    },
    feedback: {
      type: String,
      default: "",
    },
    githubURL: {
      type: String,
      default: "",
    },
    publicatieURL: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true, // adds createdAt & updatedAt
  }
);

module.exports = mongoose.model("Assignment", assignmentSchema);

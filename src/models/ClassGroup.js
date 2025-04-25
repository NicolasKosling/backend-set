// models/ClassGroup.js
const mongoose = require("mongoose");

const classGroupSchema = new mongoose.Schema(
  {
    naam: {
      type: String,
      required: true,
      trim: true,
    },
    // which teacher created this cohort
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    beginjaar: {
      type: Number,
      default: new Date().getFullYear(),
    },
    eindjaar: {
      type: Number,
      default: new Date().getFullYear() + 1,
    },
    studenten: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    opleiding: {
      type: String,
      default: "",
    },
    // NEW: link this cohort to a Course
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("ClassGroup", classGroupSchema);

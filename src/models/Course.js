// models/Course.js
const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true, // e.g. “FullStack”
      trim: true,
    },
    teachers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // can list multiple teacher IDs
        required: true,
      },
    ],
    subjects: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subject", // we’ll define Subject next
      },
    ],
    students: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // enrolled students
      },
    ],
  },
  {
    timestamps: true, // adds createdAt & updatedAt
  }
);

module.exports = mongoose.model("Course", courseSchema);

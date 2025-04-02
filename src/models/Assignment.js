// models/Assignment.js
const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema({
  naam: { type: String, required: true },
  beschrijving: { type: String },
  resultaat: { type: Number },
  feedback: { type: String },
  githubURL: { type: String },
  publicatieURL: { type: String },
  deadline: { type: Date },
  weging: { type: Number },
  classGroup: { type: mongoose.Schema.Types.ObjectId, ref: "ClassGroup" },
});

module.exports = mongoose.model("Assignment", assignmentSchema);

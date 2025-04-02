// models/ClassGroup.js
const mongoose = require("mongoose");

const classGroupSchema = new mongoose.Schema({
  naam: { type: String, required: true },
  beginjaar: { type: Number, required: true },
  eindjaar: { type: Number, required: true },
  opleiding: { type: String },
  studenten: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

module.exports = mongoose.model("ClassGroup", classGroupSchema);

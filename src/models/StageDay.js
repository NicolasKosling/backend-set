// models/StageDay.js
const mongoose = require("mongoose");

const stageDaySchema = new mongoose.Schema({
  datum: { type: Date, required: true },
  beschrijving: { type: String, required: true },
  afbeelding: { type: String },
  student: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

module.exports = mongoose.model("StageDay", stageDaySchema);

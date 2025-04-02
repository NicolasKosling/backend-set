// models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  isDocent: { type: Boolean, default: false },
  naam: { type: String, required: true },
  voornaam: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  foto: { type: String },
  telefoonnummer: { type: String },
  password: { type: String, required: true }, // hashed password
});

module.exports = mongoose.model("User", userSchema);

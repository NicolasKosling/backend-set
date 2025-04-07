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

  classGroupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ClassGroup",
    default: null, // default to null if not provided
  }, // reference to ClassGroup model

  managesClassGroup: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ClassGroup",
    default: null, // default to null if not provided
  }, // reference to ClassGroup model
});

// Optional: Ensure that if the user is a teacher, managesClassGroups defaults to an empty array.
userSchema.pre("save", function (next) {
  if (this.isDocent && !this.managesClassGroups) {
    this.managesClassGroups = [];
  }
  next();
});

module.exports = mongoose.model("User", userSchema);

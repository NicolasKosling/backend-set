// controllers/userController.js
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

// Register a new user (student or docent)
exports.register = async (req, res, next) => {
  try {
    const { isDocent, naam, voornaam, email, telefoonnummer, password } =
      req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      isDocent,
      naam,
      voornaam,
      email,
      telefoonnummer,
      password: hashedPassword,
    });
    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    next(err);
  }
};

// Login
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    // Create token payload; include role info if needed
    const tokenPayload = { id: user._id, isDocent: user.isDocent };
    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: "1h" });
    res.json({ token, user });
  } catch (err) {
    next(err);
  }
};

// Update user profile
exports.updateUser = async (req, res, next) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updatedUser);
  } catch (err) {
    next(err);
  }
};

exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    res.json(users); // This will return an empty array if there are no users
  } catch (err) {
    next(err);
  }
};

exports.assignStudentToClassGroup = async (req, res, next) => {
  try {
    //Assume teacher is authenticated and their ID is in req.user.id
    const teacherId = req.user.isDocent; // Get the authenticated user's ID from the request
    if (!teacherId) {
      return res
        .status(403)
        .json({ message: "Only teachers can assign students" });
    }

    const { studentId, classGroupId } = req.body;
    // Optionally, verify that the teacher manages the classGroupId
    // skipped for simplicity atm

    // Update the student (who must not be a teacher)
    const student = await User.findOneAndUpdate(
      { _id: studentId, isDocent: false },
      { classGroupId },
      { new: true }
    );

    if (!student) {
      return res
        .status(404)
        .json({ message: "Student not found or is not eligible" });
    }

    res.json({ message: "Student assigned successfully", student });
  } catch (err) {
    next(err);
  }
};

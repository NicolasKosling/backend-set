// controllers/userController.js
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

// Register a new user (always as student)
exports.register = async (req, res, next) => {
  try {
    const { voornaam, achternaam, email, telefoonnummer, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      isDocent: false, // force student role
      voornaam,
      achternaam,
      email,
      telefoonnummer,
      password: hashedPassword,
    });
    await user.save();

    // Generate JWT
    const tokenPayload = { id: user._id, isDocent: user.isDocent };
    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: "1h" });

    // Remove password field before sending back
    const { password: _, ...userSafe } = user.toObject();

    res.status(201).json({ token, user: userSafe });
  } catch (err) {
    next(err);
  }
};

// Login existing user
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    // Create JWT payload
    const tokenPayload = { id: user._id, isDocent: user.isDocent };
    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: "1h" });

    // Send back token and user (minus password)
    const { password: _, ...userSafe } = user.toObject();
    res.json({ token, user: userSafe });
  } catch (err) {
    next(err);
  }
};

// Get current authenticated user
exports.getMe = async (req, res, next) => {
  try {
    // req.user contains { id, isDocent }
    const fullUser = await User.findById(req.user.id)
      .select("-password")
      .lean();
    if (!fullUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(fullUser);
  } catch (err) {
    next(err);
  }
};

// Promote a user to teacher (teacher-only)
exports.promoteToTeacher = async (req, res, next) => {
  try {
    if (!req.user.isDocent) {
      return res
        .status(403)
        .json({ message: "Only teachers can promote users" });
    }
    const { id } = req.params;
    const updated = await User.findByIdAndUpdate(
      id,
      { isDocent: true },
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ message: "User not found" });
    }
    const { password: _, ...userSafe } = updated.toObject();
    res.json({ message: `${userSafe.email} is now a teacher`, user: userSafe });
  } catch (err) {
    next(err);
  }
};

// Update user profile
exports.updateUser = async (req, res, next) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    }).select("-password");
    res.json(updatedUser);
  } catch (err) {
    next(err);
  }
};

// Get all users
exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    next(err);
  }
};

// Assign a student to a class group (teacher-only)
exports.assignStudentToClassGroup = async (req, res, next) => {
  try {
    if (!req.user.isDocent) {
      return res
        .status(403)
        .json({ message: "Only teachers can assign students" });
    }
    const { studentId, classGroupId } = req.body;
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
    const { password: _, ...studentSafe } = student.toObject();
    res.json({
      message: "Student assigned successfully",
      student: studentSafe,
    });
  } catch (err) {
    next(err);
  }
};

// middleware/authMiddleware.js
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

// Middleware to verify JWT and load full user
exports.verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authentication token missing" });
  }

  const token = authHeader.split(" ")[1];
  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }

  // Load user from database to get roles and group info
  try {
    const user = await User.findById(payload.id).select(
      "_id voornaam achternaam email isDocent classGroupId managesClassGroup"
    );
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    // Attach user document to request
    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};

// controllers/courseController.js
const Course = require("../models/Course");
const User = require("../models/User");

// POST /api/courses
exports.createCourse = async (req, res, next) => {
  try {
    if (!req.user.isDocent) {
      return res
        .status(403)
        .json({ message: "Only teachers can create courses" });
    }
    const { name } = req.body;
    const course = await Course.create({
      name,
      teachers: [req.user.id],
      subjects: [],
      students: [],
    });
    res.status(201).json(course);
  } catch (err) {
    next(err);
  }
};

// GET /api/courses
exports.getCourses = async (req, res, next) => {
  try {
    let courses;
    if (req.user.isDocent) {
      courses = await Course.find({ teachers: req.user.id })
        .populate("subjects")
        .populate("teachers", "voornaam achternaam email")
        .populate("students", "voornaam achternaam email");
    } else {
      courses = await Course.find({ students: req.user.id })
        .populate("subjects")
        .populate("teachers", "voornaam achternaam email")
        .populate("students", "voornaam achternaam email");
    }
    res.json(courses);
  } catch (err) {
    next(err);
  }
};

// GET /api/courses/:id
exports.getCourseById = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate("subjects")
      .populate("teachers", "voornaam achternaam email")
      .populate("students", "voornaam achternaam email");
    if (!course) return res.status(404).json({ message: "Course not found" });

    const isTeacher = course.teachers.some((t) => t._id.equals(req.user.id));
    const isStudent = course.students.some((s) => s._id.equals(req.user.id));
    if (!isTeacher && !isStudent) {
      return res.status(403).json({ message: "Forbidden" });
    }
    res.json(course);
  } catch (err) {
    next(err);
  }
};

// PUT /api/courses/:id
exports.updateCourse = async (req, res, next) => {
  try {
    if (!req.user.isDocent) {
      return res
        .status(403)
        .json({ message: "Only teachers can update courses" });
    }
    const { name } = req.body;
    const course = await Course.findOneAndUpdate(
      { _id: req.params.id, teachers: req.user.id },
      { name },
      { new: true }
    )
      .populate("subjects")
      .populate("teachers", "voornaam achternaam email")
      .populate("students", "voornaam achternaam email");
    if (!course) {
      return res.status(404).json({ message: "Course not found or not owned" });
    }
    res.json(course);
  } catch (err) {
    next(err);
  }
};

// DELETE /api/courses/:id
exports.deleteCourse = async (req, res, next) => {
  try {
    if (!req.user.isDocent) {
      return res
        .status(403)
        .json({ message: "Only teachers can delete courses" });
    }
    const deleted = await Course.findOneAndDelete({
      _id: req.params.id,
      teachers: req.user.id,
    });
    if (!deleted) {
      return res.status(404).json({ message: "Course not found or not owned" });
    }
    res.json({ message: "Course deleted" });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/courses/:id/teachers
exports.addTeacher = async (req, res, next) => {
  try {
    if (!req.user.isDocent) {
      return res
        .status(403)
        .json({ message: "Only teachers can add teachers" });
    }
    const { teacherId } = req.body;
    const course = await Course.findOneAndUpdate(
      { _id: req.params.id, teachers: req.user.id },
      { $addToSet: { teachers: teacherId } },
      { new: true }
    )
      .populate("teachers", "voornaam achternaam email")
      .populate("students", "voornaam achternaam email")
      .populate("subjects");
    if (!course) {
      return res.status(404).json({ message: "Course not found or not owned" });
    }
    res.json(course);
  } catch (err) {
    next(err);
  }
};

// PATCH /api/courses/:id/students
exports.addStudent = async (req, res, next) => {
  try {
    if (!req.user.isDocent) {
      return res
        .status(403)
        .json({ message: "Only teachers can enroll students" });
    }
    const { studentId } = req.body;
    const student = await User.findById(studentId);
    if (!student || student.isDocent) {
      return res.status(400).json({ message: "Invalid student ID" });
    }
    const course = await Course.findOneAndUpdate(
      { _id: req.params.id, teachers: req.user.id },
      { $addToSet: { students: studentId } },
      { new: true }
    )
      .populate("teachers", "voornaam achternaam email")
      .populate("students", "voornaam achternaam email")
      .populate("subjects");
    if (!course) {
      return res.status(404).json({ message: "Course not found or not owned" });
    }
    res.json(course);
  } catch (err) {
    next(err);
  }
};

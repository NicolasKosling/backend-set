// controllers/classController.js
const ClassGroup = require("../models/ClassGroup");
const User = require("../models/User");
const Course = require("../models/Course");

// Create a new class group (teacher only)
exports.createClassGroup = async (req, res, next) => {
  try {
    if (!req.user.isDocent) {
      return res
        .status(403)
        .json({ message: "Only teachers can create class groups" });
    }

    const { naam, beginjaar, eindjaar, opleiding, courseId } = req.body;

    // ensure the course exists and teacher is one of its teachers
    const course = await Course.findOne({
      _id: courseId,
      teachers: req.user.id,
    });
    if (!course) {
      return res
        .status(404)
        .json({ message: "Course not found or not owned by you" });
    }

    const newGroup = await ClassGroup.create({
      naam,
      beginjaar,
      eindjaar,
      opleiding,
      teacher: req.user.id,
      course: courseId,
      studenten: [],
    });

    res.status(201).json(newGroup);
  } catch (err) {
    next(err);
  }
};

// Get all class groups (teacher sees own, students see enrolled)
exports.getClassGroups = async (req, res, next) => {
  try {
    let groups;
    if (req.user.isDocent) {
      groups = await ClassGroup.find({ teacher: req.user.id })
        .populate("studenten", "voornaam achternaam email")
        .populate("course", "name");
    } else {
      groups = await ClassGroup.find({ studenten: req.user.id })
        .populate("studenten", "voornaam achternaam email")
        .populate("course", "name");
    }
    res.json(groups);
  } catch (err) {
    next(err);
  }
};

// Get a specific class group by ID
exports.getClassGroupById = async (req, res, next) => {
  try {
    const group = await ClassGroup.findById(req.params.id)
      .populate("studenten", "voornaam achternaam email")
      .populate("course", "name");
    if (!group)
      return res.status(404).json({ message: "Class group not found" });

    if (
      !req.user.isDocent &&
      !group.studenten.some((s) => s._id.equals(req.user.id))
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to view this class" });
    }

    res.json(group);
  } catch (err) {
    next(err);
  }
};

// Update a class group (teacher only)
exports.updateClassGroup = async (req, res, next) => {
  try {
    if (!req.user.isDocent) {
      return res
        .status(403)
        .json({ message: "Only teachers can update class groups" });
    }
    const { naam, beginjaar, eindjaar, opleiding, courseId } = req.body;

    // ensure teacher owns both the group and the course if changing course
    const filter = { _id: req.params.id, teacher: req.user.id };
    if (courseId) filter.course = courseId;

    const updated = await ClassGroup.findOneAndUpdate(
      filter,
      { naam, beginjaar, eindjaar, opleiding, course: courseId },
      { new: true }
    )
      .populate("studenten", "voornaam achternaam email")
      .populate("course", "name");
    if (!updated) {
      return res
        .status(404)
        .json({ message: "Class group not found or not owned by you" });
    }
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

// Delete a class group (teacher only)
exports.deleteClassGroup = async (req, res, next) => {
  try {
    if (!req.user.isDocent) {
      return res
        .status(403)
        .json({ message: "Only teachers can delete class groups" });
    }
    const deleted = await ClassGroup.findOneAndDelete({
      _id: req.params.id,
      teacher: req.user.id,
    });
    if (!deleted) {
      return res
        .status(404)
        .json({ message: "Class group not found or not owned by you" });
    }
    res.json({ message: "Class group deleted" });
  } catch (err) {
    next(err);
  }
};

// Add a student to a class group (teacher only)
exports.addStudent = async (req, res, next) => {
  try {
    if (!req.user.isDocent) {
      return res
        .status(403)
        .json({ message: "Only teachers can add students" });
    }
    const { studentId } = req.body;
    const group = await ClassGroup.findOne({
      _id: req.params.id,
      teacher: req.user.id,
    });
    if (!group) {
      return res
        .status(404)
        .json({ message: "Class group not found or not owned by you" });
    }

    if (!group.studenten.includes(studentId)) {
      group.studenten.push(studentId);
      await group.save();
      await User.findByIdAndUpdate(studentId, { classGroupId: group._id });
    }
    res.json(group);
  } catch (err) {
    next(err);
  }
};

// List students in a class group (teacher or enrolled student)
exports.listStudents = async (req, res, next) => {
  try {
    const group = await ClassGroup.findById(req.params.id).populate(
      "studenten",
      "voornaam achternaam email"
    );
    if (!group)
      return res.status(404).json({ message: "Class group not found" });
    if (
      !req.user.isDocent &&
      !group.studenten.some((s) => s._id.equals(req.user.id))
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to view students of this class" });
    }
    res.json(group.studenten);
  } catch (err) {
    next(err);
  }
};

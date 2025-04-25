// controllers/subjectController.js
const Course = require("../models/Course");
const Subject = require("../models/Subject");

// List all subjects for a course
exports.getSubjectsByCourse = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    // Authorization: teacher or enrolled student
    const isTeacher = course.teachers.some((t) => t.equals(req.user.id));
    const isStudent = course.students.some((s) => s.equals(req.user.id));
    if (!isTeacher && !isStudent) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const subjects = await Subject.find({ course: courseId }).populate(
      "assignments"
    );
    res.json(subjects);
  } catch (err) {
    next(err);
  }
};

// Create a new subject under a course
exports.createSubject = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const { name } = req.body;

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    // Only teacher can add
    if (!course.teachers.some((t) => t.equals(req.user.id))) {
      return res
        .status(403)
        .json({ message: "Only teachers can add subjects" });
    }

    const subject = await Subject.create({ name, course: courseId });
    // update course subjects array
    course.subjects.push(subject._id);
    await course.save();

    res.status(201).json(subject);
  } catch (err) {
    next(err);
  }
};

// Get a single subject by ID (within course)
exports.getSubjectById = async (req, res, next) => {
  try {
    const { courseId, id } = req.params;
    const subject = await Subject.findOne({
      _id: id,
      course: courseId,
    }).populate("assignments");
    if (!subject) return res.status(404).json({ message: "Subject not found" });

    const course = await Course.findById(courseId);
    const isTeacher = course.teachers.some((t) => t.equals(req.user.id));
    const isStudent = course.students.some((s) => s.equals(req.user.id));
    if (!isTeacher && !isStudent) {
      return res.status(403).json({ message: "Forbidden" });
    }

    res.json(subject);
  } catch (err) {
    next(err);
  }
};

// Update subject name (teacher-only)
exports.updateSubject = async (req, res, next) => {
  try {
    const { courseId, id } = req.params;
    const { name } = req.body;

    const course = await Course.findById(courseId);
    if (!course.teachers.some((t) => t.equals(req.user.id))) {
      return res
        .status(403)
        .json({ message: "Only teachers can update subjects" });
    }

    const subject = await Subject.findOneAndUpdate(
      { _id: id, course: courseId },
      { name },
      { new: true }
    ).populate("assignments");
    if (!subject) return res.status(404).json({ message: "Subject not found" });

    res.json(subject);
  } catch (err) {
    next(err);
  }
};

// Delete subject (teacher-only)
exports.deleteSubject = async (req, res, next) => {
  try {
    const { courseId, id } = req.params;
    const course = await Course.findById(courseId);
    if (!course.teachers.some((t) => t.equals(req.user.id))) {
      return res
        .status(403)
        .json({ message: "Only teachers can delete subjects" });
    }

    const subject = await Subject.findOneAndDelete({
      _id: id,
      course: courseId,
    });
    if (!subject) return res.status(404).json({ message: "Subject not found" });

    // remove from course.subjects
    course.subjects.pull(id);
    await course.save();

    res.json({ message: "Subject deleted" });
  } catch (err) {
    next(err);
  }
};

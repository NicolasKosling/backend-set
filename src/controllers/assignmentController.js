// controllers/assignmentController.js
const Assignment = require("../models/Assignment");
const Subject = require("../models/Subject");
const Course = require("../models/Course");

// POST /api/assignments
// Teacher creates an assignment for a specific subject
exports.createAssignment = async (req, res, next) => {
  try {
    if (!req.user.isDocent) {
      return res
        .status(403)
        .json({ message: "Only teachers can create assignments" });
    }
    const { subjectId, naam, beschrijving, deadline, weging } = req.body;

    // Verify the subject exists and that the teacher teaches its course
    const subject = await Subject.findById(subjectId);
    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }
    const course = await Course.findById(subject.course);
    if (!course || !course.teachers.includes(req.user._id)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const assignment = await Assignment.create({
      subject: subjectId,
      naam,
      beschrijving,
      deadline,
      weging,
    });

    res.status(201).json(assignment);
  } catch (err) {
    next(err);
  }
};

// GET /api/assignments?subjectId=...&courseId=...
exports.getAssignments = async (req, res, next) => {
  try {
    const filter = {};
    const { subjectId, courseId } = req.query;

    if (subjectId) {
      filter.subject = subjectId;
    } else if (courseId) {
      // Find all subjects in that course, then filter assignments
      const subjects = await Subject.find({ course: courseId }).select("_id");
      filter.subject = { $in: subjects.map((s) => s._id) };
    }

    const assignments = await Assignment.find(filter).sort({ deadline: 1 });
    res.json(assignments);
  } catch (err) {
    next(err);
  }
};

// GET /api/assignments/:id
exports.getAssignmentById = async (req, res, next) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }
    res.json(assignment);
  } catch (err) {
    next(err);
  }
};

// PUT /api/assignments/:id
exports.updateAssignment = async (req, res, next) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    if (req.user.isDocent) {
      // Teacher updates grading fields
      const { resultaat, feedback } = req.body;
      assignment.resultaat = resultaat;
      assignment.feedback = feedback;
    } else {
      // Student submits URLs
      const { githubURL, publicatieURL } = req.body;
      assignment.githubURL = githubURL;
      assignment.publicatieURL = publicatieURL;
    }
    await assignment.save();
    res.json(assignment);
  } catch (err) {
    next(err);
  }
};

// DELETE /api/assignments/:id
exports.deleteAssignment = async (req, res, next) => {
  try {
    if (!req.user.isDocent) {
      return res.status(403).json({ message: "Forbidden" });
    }
    const deleted = await Assignment.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Assignment not found" });
    }
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};

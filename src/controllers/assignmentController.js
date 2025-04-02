// controllers/assignmentController.js
const Assignment = require("../models/Assignment");

exports.createAssignment = async (req, res, next) => {
  try {
    const {
      naam,
      beschrijving,
      resultaat,
      feedback,
      githubURL,
      publicatieURL,
      deadline,
      weging,
      classGroup,
    } = req.body;
    const assignment = new Assignment({
      naam,
      beschrijving,
      resultaat,
      feedback,
      githubURL,
      publicatieURL,
      deadline,
      weging,
      classGroup,
    });
    await assignment.save();
    res.status(201).json(assignment);
  } catch (err) {
    next(err);
  }
};

exports.getAssignments = async (req, res, next) => {
  try {
    const assignments = await Assignment.find().populate("classGroup");
    res.json(assignments);
  } catch (err) {
    next(err);
  }
};

exports.getAssignmentById = async (req, res, next) => {
  try {
    const assignment = await Assignment.findById(req.params.id).populate(
      "classGroup"
    );
    res.json(assignment);
  } catch (err) {
    next(err);
  }
};

exports.updateAssignment = async (req, res, next) => {
  try {
    const updatedAssignment = await Assignment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedAssignment);
  } catch (err) {
    next(err);
  }
};

exports.deleteAssignment = async (req, res, next) => {
  try {
    await Assignment.findByIdAndDelete(req.params.id);
    res.json({ message: "Assignment deleted" });
  } catch (err) {
    next(err);
  }
};

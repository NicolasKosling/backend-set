// controllers/classController.js
const ClassGroup = require("../models/ClassGroup");

exports.createClassGroup = async (req, res, next) => {
  try {
    const { naam, beginjaar, eindjaar, opleiding, studenten } = req.body;
    const classGroup = new ClassGroup({
      naam,
      beginjaar,
      eindjaar,
      opleiding,
      studenten,
    });
    await classGroup.save();
    res.status(201).json(classGroup);
  } catch (err) {
    next(err);
  }
};

exports.getClassGroups = async (req, res, next) => {
  try {
    const classGroups = await ClassGroup.find().populate("studenten");
    res.json(classGroups);
  } catch (err) {
    next(err);
  }
};

exports.getClassGroupById = async (req, res, next) => {
  try {
    const classGroup = await ClassGroup.findById(req.params.id).populate(
      "studenten"
    );
    res.json(classGroup);
  } catch (err) {
    next(err);
  }
};

exports.updateClassGroup = async (req, res, next) => {
  try {
    const updatedGroup = await ClassGroup.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedGroup);
  } catch (err) {
    next(err);
  }
};

exports.deleteClassGroup = async (req, res, next) => {
  try {
    await ClassGroup.findByIdAndDelete(req.params.id);
    res.json({ message: "Class group deleted" });
  } catch (err) {
    next(err);
  }
};

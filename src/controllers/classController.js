// controllers/classController.js
const ClassGroup = require("../models/ClassGroup");

exports.createClassGroup = async (req, res, next) => {
  try {
    // Assume teacher is authenticated and req.user contains teacher info.
    if (!req.user.isDocent) {
      return res
        .status(403)
        .json({ message: "Only teachers can create class groups" });
    }

    const { naam, beginjaar, eindjaar, opleiding } = req.body;
    const newGroup = new ClassGroup({ naam, beginjaar, eindjaar, opleiding });
    const savedGroup = await newGroup.save();

    // Optionally, update the teacher's managesClassGroups array.
    const teacherId = req.user.id;
    await User.findByIdAndUpdate(teacherId, {
      $push: { managesClassGroups: savedGroup._id },
    });

    res.status(201).json(savedGroup);
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

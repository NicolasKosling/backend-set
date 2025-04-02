// controllers/stagedayController.js
const StageDay = require("../models/StageDay");
const PDFDocument = require("pdfkit");

exports.createStageDay = async (req, res, next) => {
  try {
    const { datum, beschrijving, afbeelding, student } = req.body;
    const stageDay = new StageDay({ datum, beschrijving, afbeelding, student });
    await stageDay.save();
    res.status(201).json(stageDay);
  } catch (err) {
    next(err);
  }
};

exports.getStageDays = async (req, res, next) => {
  try {
    const stageDays = await StageDay.find().populate("student");
    res.json(stageDays);
  } catch (err) {
    next(err);
  }
};

exports.exportPDF = async (req, res, next) => {
  try {
    const stageDays = await StageDay.find({ student: req.params.studentId });
    const doc = new PDFDocument();
    res.setHeader("Content-Type", "application/pdf");
    doc.pipe(res);
    doc.fontSize(16).text("Stage Dagboek", { align: "center" });
    stageDays.forEach((day) => {
      doc
        .moveDown()
        .fontSize(12)
        .text(`Datum: ${new Date(day.datum).toDateString()}`);
      doc.text(`Beschrijving: ${day.beschrijving}`);
      doc.moveDown();
    });
    doc.end();
  } catch (err) {
    next(err);
  }
};

exports.deleteStageDay = async (req, res, next) => {
  try {
    await StageDay.findByIdAndDelete(req.params.id);
    res.json({ message: "StageDay deleted" });
  } catch (err) {
    next(err);
  }
};

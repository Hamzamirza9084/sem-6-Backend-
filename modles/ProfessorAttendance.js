import mongoose from "mongoose";

const ProfessorAttendanceSchema = new mongoose.Schema({
  UID: { type: String, required: true },
  Name: { type: String, required: true },
  Course: { type: String, required: true },
  Year: { type: String, required: true },
  Division: { type: String, required: true },
  RollNo: { type: String, required: true },
  Subject: { type: String, required: true },
  Timestamp: { type: String, required: true, default: Date.now },
});

const ProfessorAttendanceModel = mongoose.model(
  "professor_attendance",
  ProfessorAttendanceSchema
);

export { ProfessorAttendanceModel as ProfessorAttendance };

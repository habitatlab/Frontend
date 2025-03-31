const mongoose = require("mongoose");

const AnnotationSchema = new mongoose.Schema(
  {
    start_timestamp: { type: Number, required: true },
    end_timestamp: { type: Number, required: true },
    note: { type: String },
    // Optional for polygon annotations
    // polygon: [{ x: Number, y: Number }],
    createdDate: { type: Date, default: Date.now },
    lastModifiedDate: { type: Date, default: Date.now },
  },
  { _id: false }
);

// Automatically update lastModifiedDate before saving an annotation
AnnotationSchema.pre("save", function (next) {
  this.lastModifiedDate = new Date();
  next();
});

const TimelineSchema = new mongoose.Schema({
  id: { type: String, required: true }, // UUID
  name: { type: String, required: true },
  owner: { type: String },
  rig: { type: String },
  trial: { type: String },
  cohort: { type: String },
  dataset: { type: String },
  color: { type: String },
  createdDate: { type: Date, default: Date.now },
  annotations: [AnnotationSchema],
});

module.exports = mongoose.model("AnnotationTimeline", TimelineSchema);


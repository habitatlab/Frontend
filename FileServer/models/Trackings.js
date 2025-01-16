const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const AnimalLocationSchema = new Schema({
  animal: { type: String, required: true },
  start_timestamp: { type: Date, required: true },
  end_timestamp: { type: Date, required: true },
  x_position: { type: Number },
  y_position: { type: Number }
  // Add other fields as needed
});

module.exports = mongoose.model('Trackings', AnimalLocationSchema, 'animal_location');

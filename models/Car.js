const mongoose = require("mongoose");

const CarSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    default: null,
  },
  cat_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "category",
    default: null,
  },
  color: {
    type: String,
    required: true,
  },
  model: {
    type: String,
    required: true,
  },
  make: {
    type: String,
    required: true,
  },
  registration: {
    type: String,
    unique: true,
    required: true,
  },
  active: {
    type: Boolean,
    default: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Car = mongoose.model("car", CarSchema);

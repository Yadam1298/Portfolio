const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  tech: { type: [String], default: [] },
  abstract: { type: String, required: true },
  video: { type: String, required: true },
  view: { type: String, required: true },
});

module.exports = mongoose.model('Project', projectSchema);

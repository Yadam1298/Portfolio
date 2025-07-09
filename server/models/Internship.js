const mongoose = require('mongoose');

const internshipSchema = new mongoose.Schema({
  company: { type: String, required: true },
  role: { type: String, required: true },
  duration: { type: String, required: true },
  description: { type: String, required: true },
  certificate: { type: String }, // ✅ NEW FIELD
});

module.exports = mongoose.model('Internship', internshipSchema);

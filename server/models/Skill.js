const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
  name: { type: String, required: true },
  percent: { type: Number, required: true },
  note: { type: String, required: true },
});

const skillCategorySchema = new mongoose.Schema({
  category: { type: String, required: true },
  skills: [skillSchema],
});

module.exports = mongoose.model('SkillCategory', skillCategorySchema);

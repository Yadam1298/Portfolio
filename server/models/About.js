// models/About.js
const mongoose = require("mongoose");

const sectionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  items: [{ type: String }],
});

const aboutSchema = new mongoose.Schema({
  aboutMe: { type: String },
  sections: [sectionSchema],
});

module.exports = mongoose.model("About", aboutSchema);

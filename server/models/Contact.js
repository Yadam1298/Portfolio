const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const contactSchema = new mongoose.Schema({
  title: { type: String, required: true },
  paragraphs: { type: [String], required: true },
  messages: [messageSchema],
});

module.exports = mongoose.model('Contact', contactSchema);

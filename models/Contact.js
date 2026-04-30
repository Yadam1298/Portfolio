// models/Contact.js
import mongoose from 'mongoose';

// Schema for storing website contact info (your details)
const ContactInfoSchema = new mongoose.Schema({
  email: String,
  phone: String,
  address: String,
  socialLinks: {
    github: String,
    linkedin: String,
    twitter: String,
    whatsapp: String,
  },
  updatedAt: Date,
});

// Schema for user messages
const UserMessageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: false,
  },
  message: {
    type: String,
    required: true,
  },
  location: {
    lat: Number,
    lng: Number,
    address: String,
  },
  userAgent: String,
  ipAddress: String,
  read: {
    type: Boolean,
    default: false,
  },
  replied: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Contact =
  mongoose.models.Contact || mongoose.model('Contact', ContactInfoSchema);
export const UserMessage =
  mongoose.models.UserMessage ||
  mongoose.model('UserMessage', UserMessageSchema);

export default Contact;

// models/Certificate.js
const mongoose = require('mongoose');

const CertificateSchema = new mongoose.Schema({
    title: { type: String, required: true },
    organization: { type: String, required: true },
    date: String,
    link: String,
    logo: String,
});

module.exports = mongoose.model('Certificate', CertificateSchema);

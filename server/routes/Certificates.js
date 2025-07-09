// routes/certificates.js
const express = require('express');
const router = express.Router();
const Certificate = require('../models/Certificate');

// GET all certificates
router.get('/', async (req, res) => {
    try {
        const certificates = await Certificate.find();
        res.json(certificates);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST create a new certificate
router.post('/', async (req, res) => {
    const cert = new Certificate(req.body);
    try {
        const savedCert = await cert.save();
        res.status(201).json(savedCert);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// PUT update a certificate by id
router.put('/:id', async (req, res) => {
    try {
        const updatedCert = await Certificate.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedCert);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE a certificate by id
router.delete('/:id', async (req, res) => {
    try {
        await Certificate.findByIdAndDelete(req.params.id);
        res.json({ message: 'Certificate deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;

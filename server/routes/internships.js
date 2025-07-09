const express = require('express');
const router = express.Router();
const Internship = require('../models/Internship');

// CREATE Internship
router.post('/', async (req, res) => {
  try {
    const { company, role, duration, description, certificate } = req.body;
    const newIntern = new Internship({
      company,
      role,
      duration,
      description,
      certificate,
    });
    await newIntern.save();
    res.status(201).json(newIntern);
  } catch (err) {
    console.error('POST /api/internships error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET all Internships
router.get('/', async (req, res) => {
  try {
    const interns = await Internship.find();
    res.json(interns);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// UPDATE Internship by ID
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Internship.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (err) {
    console.error('PUT /api/internships/:id error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE Internship by ID
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Internship.findByIdAndDelete(id);
    res.json({ message: 'Internship deleted' });
  } catch (err) {
    console.error('DELETE /api/internships/:id error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

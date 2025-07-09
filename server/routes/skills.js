const express = require('express');
const router = express.Router();
const SkillCategory = require('../models/Skill');

// GET all categories and skills
router.get('/', async (req, res) => {
  try {
    const categories = await SkillCategory.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST overwrite all data
router.post('/', async (req, res) => {
  try {
    await SkillCategory.deleteMany({});
    const inserted = await SkillCategory.insertMany(req.body);
    res.status(201).json(inserted);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST create new category
router.post('/category', async (req, res) => {
  try {
    const { category } = req.body;
    const newCategory = new SkillCategory({ category, skills: [] });
    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT update category name
router.put('/category/:catId', async (req, res) => {
  try {
    const updated = await SkillCategory.findByIdAndUpdate(
      req.params.catId,
      { category: req.body.category },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE a category
router.delete('/category/:catId', async (req, res) => {
  try {
    await SkillCategory.findByIdAndDelete(req.params.catId);
    res.json({ message: 'Category deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST add new skill to a category
router.post('/:catId/skill', async (req, res) => {
  try {
    const category = await SkillCategory.findById(req.params.catId);
    category.skills.push(req.body);
    await category.save();
    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT update a skill in category
router.put('/:catId/skill/:skillId', async (req, res) => {
  try {
    const category = await SkillCategory.findById(req.params.catId);
    const skill = category.skills.id(req.params.skillId);
    Object.assign(skill, req.body);
    await category.save();
    res.json(category);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE a skill from category
router.delete('/:catId/skill/:skillId', async (req, res) => {
  try {
    const category = await SkillCategory.findById(req.params.catId);
    category.skills.id(req.params.skillId).remove();
    await category.save();
    res.json({ message: 'Skill deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

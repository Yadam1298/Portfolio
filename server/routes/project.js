const express = require('express');
const router = express.Router();
const Project = require('../models/Project');

// CREATE one or more projects
router.post('/', async (req, res) => {
  try {
    const data = req.body;

    // If body is an array, insert many
    if (Array.isArray(data)) {
      const savedProjects = await Project.insertMany(data);
      return res.status(201).json(savedProjects);
    }

    // Else, treat as a single project object
    const { title, description, tech, abstract, video, view } = data;

    const newProject = new Project({
      title,
      description,
      tech,
      abstract,
      video,
      view,
    });

    await newProject.save();
    res.status(201).json(newProject);
  } catch (err) {
    console.error('POST /api/projects error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET all projects
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// UPDATE a single project by ID
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const updatedProject = await Project.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedProject) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json(updatedProject);
  } catch (err) {
    console.error('PUT /api/projects/:id error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE a single project by ID
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Project.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json({ message: 'Project deleted successfully' });
  } catch (err) {
    console.error('DELETE /api/projects/:id error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

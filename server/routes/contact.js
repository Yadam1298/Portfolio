const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');

// GET contact page content
router.get('/', async (req, res) => {
  try {
    let contact = await Contact.findOne();

    // If not exists, create default
    if (!contact) {
      contact = await Contact.create({
        title: 'Contact Me',
        paragraphs: ['Feel free to reach out!'],
        messages: [],
      });
    }

    res.json(contact);
  } catch (err) {
    console.error('Error fetching contact:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST update contact content (title & paragraphs)
router.post('/update', async (req, res) => {
  try {
    console.log('Incoming body:', req.body); // 👈 Debug this
    const { title, paragraphs } = req.body;

    if (!title || !Array.isArray(paragraphs)) {
      return res.status(400).json({ error: 'Invalid format' });
    }

    const contact = await Contact.findOne();
    if (!contact) {
      return res.status(404).json({ error: 'Contact not found' });
    }

    contact.title = title;
    contact.paragraphs = paragraphs;
    await contact.save();

    res.json({ success: true });
  } catch (err) {
    console.error('Error updating contact:', err);
    res.status(500).json({ error: 'Failed to update contact' });
  }
});

// DELETE a received message
router.delete('/delete-message', async (req, res) => {
  try {
    const { email, message } = req.body;

    if (!email || !message) {
      return res.status(400).json({ error: 'Email and message are required' });
    }

    const contact = await Contact.findOne();
    if (!contact) {
      return res.status(404).json({ error: 'Contact data not found' });
    }

    contact.messages = contact.messages.filter(
      (msg) => !(msg.email === email && msg.message === message)
    );

    await contact.save();
    res.json({ success: true });
  } catch (err) {
    console.error('Error deleting message:', err);
    res.status(500).json({ error: 'Failed to delete message' });
  }
});

// Optional: POST new message
router.post('/submit-message', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !message) {
      return res.status(400).json({ error: 'Name and message are required' });
    }

    const contact = await Contact.findOne();
    if (!contact) {
      return res.status(404).json({ error: 'Contact data not found' });
    }

    contact.messages.push({ name, email, message });
    await contact.save();

    res.json({ success: true });
  } catch (err) {
    console.error('Error submitting message:', err);
    res.status(500).json({ error: 'Failed to submit message' });
  }
});

// GET all received messages
router.get('/messages', async (req, res) => {
  try {
    const contact = await Contact.findOne();

    if (!contact) {
      return res.status(404).json({ error: 'Contact data not found' });
    }

    res.json(contact.messages);
  } catch (err) {
    console.error('Error fetching messages:', err);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

module.exports = router;

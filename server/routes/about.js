const express = require('express');
const router = express.Router();
const { getAbout, postAbout } = require('../controllers/aboutController');

// GET about info
router.get('/', getAbout);

// POST or PUT about info (you can use PUT if you're always updating)
router.post('/', postAbout);

module.exports = router;

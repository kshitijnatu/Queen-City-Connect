const express = require('express');
const mainController = require('../controllers/mainController');

const router = express.Router();

// GET /: render the home page
router.get('/', mainController.index);

// GET /about: render the about page
router.get('/about', mainController.about);

// GET /contact: render the contact page
router.get('/contact', mainController.contact);

module.exports = router;
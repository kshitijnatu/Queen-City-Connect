const express = require('express');
const controller = require('../controllers/userController');
const {isGuest, isLoggedIn} = require('../middlewares/auth')

const router = express.Router();

// GET /user/login
router.get('/login', isGuest, controller.getUserLogin);

// GET /user/signup
router.get('/signup', isGuest, controller.getUserSignup);

// GET /user/profile
router.get('/profile', isLoggedIn, controller.getUserProfile);

// POST /user/login
router.post('/login', isGuest, controller.processUserLogin);

// POST /user/signup
router.post('/signup', isGuest, controller.processUserSignup);

// POST /user/logout
router.get('/logout', isLoggedIn, controller.logout);


module.exports = router;

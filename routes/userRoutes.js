const express = require('express');
const controller = require('../controllers/userController');
const { isGuest, isLoggedIn } = require('../middlewares/auth');
const { loginLimiter } = require('../middlewares/rateLimiters');
const { validateSignUp, validateLogin, validateResult } = require('../middlewares/validator');

const router = express.Router();

// GET /user/login
router.get('/login', isGuest, controller.getUserLogin);

// GET /user/signup
router.get('/signup', isGuest, controller.getUserSignup);

// GET /user/profile
router.get('/profile', isLoggedIn, controller.getUserProfile);

// POST /user/login
router.post('/login', isGuest, loginLimiter, validateLogin, validateResult, controller.processUserLogin);

// POST /user/signup
router.post('/signup', isGuest, validateSignUp, validateResult, controller.processUserSignup);

// GET /user/logout
router.get('/logout', isLoggedIn, controller.logout);

module.exports = router;

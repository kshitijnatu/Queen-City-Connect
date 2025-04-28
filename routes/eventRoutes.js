const userModel = require('../models/user');
const express = require('express');
const eventController = require('../controllers/eventController');
const multer = require('multer');
const path = require('path');
const { isLoggedIn, isAuthor } = require('../middlewares/auth');
const {validateId} = require('../middlewares/validator');

// Set up multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images/');
    },
    filename: async (req, file, cb) => {
        try {
            const user = await userModel.findById(req.session.user);
            const userName = user ? `${user.firstName}-${user.lastName}` : 'unknown';
            const currentDate = new Date().toISOString().split('T')[0];
            const fileName = file.originalname.split('.')[0];
            const customFileName = `${userName}-${fileName}-${currentDate}`;
            // cb(null, Date.now() + path.extname(file.originalname));
            cb(null, customFileName + path.extname(file.originalname));
        } catch (err) {
            cb(err);
        }
    }
});

const upload = multer({ storage: storage });


const router = express.Router();

// GET /events: send the list of events
router.get('/', eventController.index);

// GET /events/new: send html form for creating a new event
router.get('/newEvent', isLoggedIn, eventController.new);

// POST /events: create a new event
router.post('/', isLoggedIn, upload.single('image'), eventController.create);

// GET /events/:id: send details of event identified by id
router.get('/:id', validateId, eventController.show);

// GET /events/:id/edit: send html form for editing an existing event
router.get('/:id/edit', isLoggedIn, validateId, isAuthor, eventController.edit);

// PUT /events/:id: update the event identified by id
router.put('/:id', isLoggedIn, validateId, isAuthor, upload.single('image'), eventController.update);

// DELETE /events/:id: delete the event identified by id
router.delete('/:id', isLoggedIn, validateId, isAuthor, eventController.delete);

module.exports = router;
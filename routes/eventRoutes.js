const express = require('express');
const eventController = require('../controllers/eventController');
const multer = require('multer');
const path = require('path');

// Set up multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });


const router = express.Router();

// GET /events: send the list of events
router.get('/', eventController.index);

// GET /events/new: send html form for creating a new event
router.get('/newEvent', eventController.new);

// POST /events: create a new event
router.post('/', upload.single('image'), eventController.create);

// GET /events/:id: send details of event identified by id
router.get('/:id', eventController.show);

// GET /events/:id/edit: send html form for editing an existing event
router.get('/:id/edit', eventController.edit);

// PUT /events/:id: update the event identified by id
router.put('/:id', eventController.update);

// DELETE /events/:id: delete the event identified by id
router.delete('/:id', eventController.delete);

module.exports = router;
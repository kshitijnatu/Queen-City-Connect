const { body, validationResult } = require('express-validator');

// Validate ObjectId
exports.validateId = (req, res, next) => {
    let id = req.params.id;
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        let err = new Error('Invalid ID: ' + id);
        err.status = 400;
        return next(err);
    } else {
        return next();
    }
};

// Validate user signup
exports.validateSignUp = [
    body('firstName', 'First name cannot be empty').notEmpty().trim().escape(),
    body('lastName', 'Last name cannot be empty').notEmpty().trim().escape(),
    body('email', 'Email must be a valid email address').isEmail().trim().escape().normalizeEmail(),
    body('password', 'Password must be at least 8 characters and at most 64 characters').isLength({ min: 8, max: 64 })
];

// Validate user login
exports.validateLogin = [
    body('email', 'Email must be a valid email address').isEmail().trim().escape().normalizeEmail(),
    body('password', 'Password must be at least 8 characters and at most 64 characters').isLength({ min: 8, max: 64 })
];

// Validate event creation and update
exports.validateEvent = [
    body('title', 'Title cannot be empty').notEmpty().trim().escape(),
    body('category', 'Invalid category').isIn(['Professional Meetups', 'Hobby Groups', 'Local Gatherings', 'Workshops', 'Conferences']),
    body('startDateTime')
        .notEmpty().withMessage('Start date and time is required')
        .bail()
        .isISO8601().withMessage('The format of the Start date-time must be YYYY-MM-DDThh:mm:ss:TZD')
        .bail()
        .custom((value) => {
            const startDate = new Date(value);
            if (startDate < new Date()) {
                throw new Error('Start date must be after today');
            }
            return true;
        }),
    body('endDateTime')
        .notEmpty().withMessage('End date and time is required')
        .bail()
        .isISO8601().withMessage('The format of the End date-time must be YYYY-MM-DDThh:mm:ss:TZD')
        .bail()
        .custom((value, { req }) => {
            const startDate = new Date(req.body.startDateTime);
            const endDate = new Date(value);
            if (endDate <= startDate) {
                throw new Error('End date must be after the start date');
            }
            return true;
        }),
    body('location', 'Location cannot be empty').notEmpty().trim().escape(),
    body('details', 'Details cannot be empty').notEmpty().trim().escape(),
    body('image').custom((value, { req }) => {
        if (!req.file) {
            throw new Error('Event image is required');
        }
        return true;
    })
];

// Validate RSVP
exports.validateRSVP = [
    body('status')
        .notEmpty().withMessage('RSVP cannot be empty')
        .bail()
        .isIn(['YES', 'NO', 'MAYBE']).withMessage('RSVP can only be YES, NO or MAYBE')
        .trim().escape()
];

// Handle validation results
exports.validateResult = (req, res, next) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
        errors.array().forEach(err => {
            req.flash('error', err.msg);
        });
        return res.redirect(req.get('Referrer') || '/');
    } else {
        return next();
    }
};

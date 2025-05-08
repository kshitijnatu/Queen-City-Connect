const eventsModel = require('../models/event');
const RSVP = require('../models/rsvp');

// GET /events: send the list of events
exports.index = (req, res, next) => {
    eventsModel.find()
        .then((events) => {
            res.render('./event/index', { events });
        })
        .catch(err => {
            next(err);
        });
};

// GET /events/new: send html form for creating a new event
exports.new = (req, res) => {
    res.render('./event/newEvent');
};

// POST /events: create a new event
exports.create = (req, res, next) => {
    let event = new eventsModel(req.body);
    event.image = '/images/' + req.file.filename;
    event.host = req.session.user;
    event.save()
        .then(() => {
            req.flash('success', 'Event created successfully');
            res.redirect('/events');
        })
        .catch(err => {
            if (err.name === 'ValidationError') {
                err.status = 400;
            }
            next(err);
        });
};

// GET /events/:id: send details of event identified by id
exports.show = (req, res, next) => {
    let id = req.params.id;

    Promise.all([
        eventsModel.findById(id).populate('host', 'firstName lastName'),
        RSVP.countDocuments({ event: id, status: 'YES' }) // Only count "YES" RSVPs
    ])
    .then(([event, rsvpCount]) => {
        if (event) {
            res.render('./event/event', { event, rsvpCount });
        } else {
            let err = new Error('Cannot find an event with id ' + id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err => {
        next(err);
    });
};

// GET /events/:id/edit: send html form for editing an existing event
exports.edit = (req, res, next) => {
    let id = req.params.id;

    eventsModel.findById(id)
        .then((event) => {
            res.render('./event/edit', { event });
        })
        .catch(err => {
            next(err);
        });
};

// PUT /events/:id: update the event identified by id
exports.update = (req, res, next) => {
    let event = req.body;
    let id = req.params.id;

    if (req.file) {
        event.image = '/images/' + req.file.filename;
    }

    eventsModel.findByIdAndUpdate(id, event, { useFindAndModify: false, runValidators: true })
        .then(() => {
            req.flash('success', 'Event updated successfully');
            res.redirect('/events/' + id);
        })
        .catch(err => {
            if (err.name === 'ValidationError') {
                err.status = 400;
            }
            next(err);
        });
};

// DELETE /events/:id: delete the event identified by id
exports.delete = (req, res, next) => {
    let id = req.params.id;

    eventsModel.findByIdAndDelete(id, { useFindAndModify: false })
        .then(() => {
            req.flash('success', 'Event deleted successfully');
            // res.redirect('/events');
        })
        .catch(err => {
            next(err);
        });
        
    RSVP.deleteMany({ event: id })
        .then(() => {
            req.flash('success', 'RSVPs deleted successfully');
            res.redirect('/events');
        })
        .catch(err => {
            // console.error('Error deleting RSVPs:', err);
            req.flash('error', 'Error deleting RSVPs');
            next(err);
        });
};

// POST /events/:id/rsvp: handle RSVP logic
exports.rsvp = (req, res, next) => {
    const eventId = req.params.id;
    const userId = req.session.user;
    const status = req.body.status;

    eventsModel.findById(eventId)
        .then(event => {
            if (!event) {
                let err = new Error('Event not found');
                err.status = 404;
                return next(err);
            }
            if (event.host.toString() === userId) {
                req.flash('error', 'You cannot RSVP for your own event');
                return res.redirect(`/events/${eventId}`);
            }

            // Update or create the RSVP in the database
            return RSVP.findOneAndUpdate(
                { event: eventId, user: userId },
                { status },
                { upsert: true, new: true, runValidators: true }
            );
        })
        .then((result) => {
            if (result) {
                req.flash('success', 'RSVP updated successfully');
                return res.redirect('/user/profile');
            }
        })
        .catch(err => next(err));
};

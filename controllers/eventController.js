const eventsModel = require('../models/event');

// GET /events: send the list of events
exports.index = (req, res, next) => {
    eventsModel.find()
        .then((events) => {
            res.render('./event/index', {events});
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
    // console.log(event);
    event.save(event)
    .then(() => {
        res.redirect('/events');
    })
    .catch(err => {
        if (err.name === 'ValidationError') {
            err.status == 400;
        }
        next(err);
    });
    
};

// GET /events/:id: send details of event identified by id
exports.show = (req, res, next) => {
    let id = req.params.id;

    // a objectId is a 24-bit Hex String
    if(!id.match(/^[0-9a-fA-F]{24}$/)) {
        let err = new Error('Invalid story id');
        err.status = 400;
        return next(err);
    }    

    eventsModel.findById(id)
        .then((event) => {
            if (event) {
                res.render('./event/event', {event});
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

    // a objectId is a 24-bit Hex String
    if(!id.match(/^[0-9a-fA-F]{24}$/)) {
        let err = new Error('Invalid story id');
        err.status = 400;
        return next(err);
    }

    eventsModel.findById(id)
        .then((event) => {
            if (event) {
                res.render('./event/edit', {event});
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

// PUT /events/:id: update the event identified by id
exports.update = (req, res, next) => {
    let event = req.body;
    let id = req.params.id;

    // a objectId is a 24-bit Hex String
    if(!id.match(/^[0-9a-fA-F]{24}$/)) {
        let err = new Error('Invalid story id');
        err.status = 400;
        return next(err);
    }

    eventsModel.findByIdAndUpdate(id, event, {useFindAndModify: false, runValidators: true})
        .then((event) => {
            if (event) {
                res.redirect('/events/' + id);                
            } else {
                let err = new Error('Cannot find a story with id ' + id);
                err.status = 404;
                next(err);
            }
        })
        .catch(err => {
            if (err.name === 'ValidationError') {
                err.status(400);
            }
            next(err);
        });
};

// DELETE /events/:id: delete the event identified by id
exports.delete = (req, res, next) => {
    let id = req.params.id;

    // a objectId is a 24-bit Hex String
    if(!id.match(/^[0-9a-fA-F]{24}$/)) {
        let err = new Error('Invalid story id');
        err.status = 400;
        return next(err);
    }

    eventsModel.findByIdAndDelete(id, {useFindAndModify: false, runValidators: true})
        .then((event) => {
            if (event) {
                res.redirect('/events');                
            } else {
                let err = new Error('Cannot find a story with id ' + id);
                err.status = 404;
                next(err);
            }
        })
        .catch(err => {
            next(err);
        });
};

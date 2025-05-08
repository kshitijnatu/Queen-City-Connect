const Event = require('../models/event');

// check if user is a guest
exports.isGuest = (req, res, next) => {
    if(!req.session.user) {
        return next();
    } else {
        req.flash('error', 'You are already logged in');
        return res.redirect('/user/profile');
    }
};

// check if user is authenticated
exports.isLoggedIn = (req, res, next) => {
    if(req.session.user) {
        return next();
    } else {
        req.flash('error', 'You need to login first');
        return res.redirect('/user/login');
    }
};

// check if user is the author of the story
exports.isAuthor = (req, res, next) => {
    let id = req.params.id;
    
    Event.findById(id)
    .then(event => {
        if(event) {
            if(event.host == req.session.user) {
                return next();
            } else {
                let err = new Error('Unauthorized to edit this event');
                err.status = 401;
                return next(err);
            }
        } else {
            let err = new Error('Cannot find a event with id ' + id);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err => next(err));
};
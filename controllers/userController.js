const userModel = require('../models/user');
const eventModel = require('../models/event');
const RSVP = require('../models/rsvp');

exports.getUserLogin = (req, res) => {
    return res.render('user/login');
};

exports.getUserSignup = (req, res) => {
    return res.render('user/signup');
};

exports.getUserProfile = (req, res, next) => {
    let userId = req.session.user;

    Promise.all([
        userModel.findById(userId),
        eventModel.find({ host: userId }),
        RSVP.find({ user: userId }).populate('event', 'title startDateTime location')
    ])
        .then(([user, events, rsvps]) => {
            res.render('user/profile', { user, events, rsvps });
        })
        .catch(err => next(err));
};

exports.processUserLogin = (req, res, next) => {
    let email = req.body.email;
    if (email) {
        email = email.toLowerCase();

    }
    let password = req.body.password;

    userModel.findOne({ email: email })
    .then(user => {
        if (!user) {
            req.flash('error', 'Wrong email address');
            return res.redirect('/user/login');
        } else {
            user.comparePassword(password)
            .then(result => {
                if (result) {
                    req.session.user = user._id;

                    req.session.save(err => {
                        if (err) return next(err);
                        req.flash('success', 'You have successfully logged in');
                        res.redirect('/');
                    });
                } else {
                    req.flash('error', 'Wrong password');
                    res.redirect('/user/login');
                }
            })
        }
    })
    .catch(err => next(err));
};

exports.processUserSignup = (req, res, next) => {
    let user = new userModel(req.body);

    if (user.email) {
        user.email = user.email.toLowerCase();
    }
    user.save()
    .then(user => {
        req.flash('success', 'You have successfully signed up. Please login to continue');
        res.redirect('/user/login');
    })
    .catch(err => {
        if(err.name === 'ValidationError' ) {
            console.log('Validation error: ' + err.message);
            req.flash('error', err.message);  
            return res.redirect('/user/signup');
        }

        if(err.code === 11000 || err.name === 'MongooseError') {
            console.log('Email has been used');
            req.flash('error', 'Email has been used');  
            return res.redirect('/user/signup');
        }        
        next(err);
    });
};

exports.logout = (req, res, next) => {
    req.flash('success', 'You have successfully logged out');

    req.session.save(err => {
        if (err) return next(err);

        req.session.destroy(err => {
            if (err) return next(err);
            res.redirect('/user/login');
        });
    });
};
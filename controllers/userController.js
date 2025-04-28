const userModel = require('../models/user');
const eventModel = require('../models/event');

exports.getUserLogin = (req, res) => {
    return res.render('user/login');
};

exports.getUserSignup = (req, res) => {
    return res.render('user/signup');
};

exports.getUserProfile = (req, res, next) => {
    // res.render('user/profile');
    let id = req.session.user;
    Promise.all([userModel.findById(id), eventModel.find({host: id})])
    .then(results => {
        const [user, events] = results;
        res.render('user/profile', {user, events});
    })
    .catch(err => next(err));
};

exports.processUserLogin = (req, res, next) => {
    let email = req.body.email;
    let password = req.body.password;
    userModel.findOne({ email: email })
    .then(user => {
        if (!user) {
            req.flash('error', 'wrong email address');
            res.redirect('/user/login');
        } else {
            user.comparePassword(password)
            .then(result => {
                if (result) {
                    req.session.user = user._id;
                    req.flash('success', 'You have successfully logged in');
                    res.redirect('/');
                } else {
                    console.log('wrong password');
                    req.flash('error', 'wrong password');
                    res.redirect('/user/login');
                }
            })
        }
    })
    .catch(err => next(err));
};

exports.processUserSignup = (req, res, next) => {
    let user = new userModel(req.body);
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
    req.session.destroy(err => {
        if(err) 
            return next(err);
       else
            res.redirect('/user/login');  
    });
};
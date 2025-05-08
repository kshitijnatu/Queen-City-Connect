// require modules
const express = require('express');
const morgan = require('morgan');
require('dotenv').config();
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const mainRoutes = require('./routes/mainRoutes');
const eventRoutes = require('./routes/eventRoutes');
const userRoutes = require('./routes/userRoutes');
const User = require('./models/user');

// create express app
const app = express();

// configure app
let port = 3000;
let host = 'localhost';
const mongoURI = process.env.MONGO_URI;
app.set('view engine', 'ejs');

// connect to MongoDB
mongoose.connect(mongoURI)
    .then(() => {
        // start the server
        app.listen(port, host, () => { 
            console.log('Server is running on port', port);
        });    
    })
    .catch(err => {
        console.error(err.message);
    });

app.use(
    session({
        secret: "ajfeirf90aeu9eroejfoefj",
        resave: false,
        saveUninitialized: false,
        store: new MongoStore({mongoUrl: mongoURI}),
        cookie: {maxAge: 60*60*1000}
    })
);

app.use(flash());

app.use((req, res, next) => {
    if (req.session.user) {
        User.findById(req.session.user)
        .then(user => {
            res.locals.user = user || null;
            res.locals.errorMessages = req.flash('error');
            res.locals.successMessages = req.flash('success');
            next();
        })
        .catch(err => next(err));
    } else {
        res.locals.user = null;
        res.locals.errorMessages = req.flash('error');
        res.locals.successMessages = req.flash('success');
        next();
    }
});

// mount middleware
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('tiny'));
app.use(methodOverride('_method'));

// set up routes
app.use('/', mainRoutes);
app.use('/events', eventRoutes);
app.use('/user', userRoutes);

// set up 404 handler
app.use((req, res, next) => {
    let err = new Error('The server cannot locate ' + req.url);
    err.status = 404;
    next(err);
});

app.use((err, req, res, next) => {
    console.log(err.stack);
    if(!err.status) {
        err.status = 500;
        err.message = ('Internal Server Error');
    }
    res.status(err.status);
    res.render('error', { error: err });
});

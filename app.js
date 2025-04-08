// require modules
const express = require('express');
const morgan = require('morgan');
require('dotenv').config();
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const mainRoutes = require('./routes/mainRoutes');
const eventRoutes = require('./routes/eventRoutes');

// create express app
const app = express();

// configure app
let port = 3000;
let host = 'localhost';
const mongoURI = process.env.MONGO_URI; // Placed mongoDB URI in .env file for security
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

// mount middleware
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('tiny'));
app.use(methodOverride('_method'));

// set up routes
app.use('/', mainRoutes);
app.use('/events', eventRoutes);

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

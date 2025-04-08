// GET /: render the home page
exports.index = (req, res) => {
    res.render('index');
};

// GET /about: render the about page
exports.about = (req, res) => {
    res.render('about');
};

// GET /contact: render the contact page
exports.contact = (req, res) => {
    res.render('contact');
};
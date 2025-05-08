const rateLimit = require('express-rate-limit');

exports.loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    handler: (req, res, next) => {
        let err = new Error('Too many login requests. Try again later.');
        err.status = 429;
        return next(err);
    }
    // message: 'Too many login requests. Try again later.'
});
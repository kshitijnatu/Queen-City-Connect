const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const eventSchema = new Schema({
    category: {
        type: String,
        enum: ['Professional Meetups', 'Hobby Groups', 'Local Gatherings', 'Workshops', 'Conferences'],
        required: true
    },
    title: {
        type: String,
        required: true
    },
    host: {
        type: Schema.Types.ObjectId, ref: 'User',
        required: true
    },
    startDateTime: {
        type: Date,
        required: true
    },
    endDateTime: {
        type: Date,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    details: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Event', eventSchema);
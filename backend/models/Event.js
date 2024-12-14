const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    date: { 
        type: Date, 
        required: true 
    },
    time: { 
        type: String, 
        required: true 
    },
    location: { 
        type: String, 
        required: true 
    },
    description: { 
        type: String, 
        required: true 
    },
    capacity: { 
        type: Number, 
        required: true 
    },
    type: { 
        type: String, 
        required: true,
        enum: ['workshops', 'seminars', 'sports', 'club-activities']
    },
    rsvps: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    collection: 'events'  // Specify the collection name
});

module.exports = mongoose.model('Event', eventSchema); 
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    preferences: [{
        type: String,
        enum: ['workshops', 'seminars', 'sports', 'club-activities']
    }],
    isAdmin: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    events: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event'
    }]
}, {
    collection: 'users'
});

module.exports = mongoose.model('User', userSchema); 
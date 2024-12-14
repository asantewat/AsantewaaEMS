const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Event = require('../models/Event');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// Admin registration route
router.post('/create', async (req, res) => {
    try {
        const { firstName, lastName, email, password, adminSecretKey } = req.body;

        // Verify admin secret key
        if (adminSecretKey !== process.env.ADMIN_SECRET_KEY) {
            return res.status(401).json({ msg: 'Unauthorized: Invalid admin key' });
        }

        // Check if user exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        // Create admin user
        user = new User({
            firstName,
            lastName,
            email,
            password,
            preferences: ['workshops', 'seminars', 'sports', 'club-activities'],
            isAdmin: true
        });

        // Hash password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();
        res.json({ msg: 'Admin user created successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Get dashboard statistics
router.get('/dashboard', [auth, admin], async (req, res) => {
    try {
        // Get counts
        const totalEvents = await Event.countDocuments();
        const activeEvents = await Event.countDocuments({ 
            date: { $gte: new Date() } 
        });
        const totalUsers = await User.countDocuments();
        const newUsers = await User.countDocuments({
            createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
        });

        res.json({
            totalEvents,
            activeEvents,
            totalUsers,
            newUsers
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Get recent activity
router.get('/activity', [auth, admin], async (req, res) => {
    try {
        // Get recent events
        const recentEvents = await Event.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .select('name createdAt');

        // Get recent users
        const recentUsers = await User.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .select('firstName lastName createdAt');

        res.json({
            events: recentEvents,
            users: recentUsers
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

module.exports = router; 
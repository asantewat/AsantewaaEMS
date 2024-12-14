const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
const mongoose = require('mongoose');

// Register User
router.post('/register', async (req, res) => {
    try {
        console.log('Starting registration...'); // Debug log
        const { firstName, lastName, email, password, adminSecretKey } = req.body;
        
        // Check if user exists
        let user = await User.findOne({ email });
        console.log('Existing user check:', user); // Debug log
        
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        // Create new user
        user = new User({
            firstName,
            lastName,
            email,
            password,
            isAdmin: adminSecretKey === process.env.ADMIN_SECRET_KEY
        });

        // Hash password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        console.log('Saving user...'); // Debug log
        await user.save();
        console.log('User saved:', user); // Debug log

        // Create token
        const token = jwt.sign(
            { userId: user._id, isAdmin: user.isAdmin },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({
            token,
            isAdmin: user.isAdmin,
            user: {
                id: user._id,
                name: user.firstName + ' ' + user.lastName,
                email: user.email
            }
        });

    } catch (err) {
        console.error('Registration error:', err);
        res.status(500).send('Server error');
    }
});

// Login User
router.post('/login', async (req, res) => {
    try {
        console.log('Login request body:', req.body); // Debug log
        const { email, password } = req.body;

        // Check if email and password are provided
        if (!email || !password) {
            console.log('Missing email or password'); // Debug log
            return res.status(400).json({ msg: 'Please enter all fields' });
        }

        // Find user
        let user = await User.findOne({ email });
        if (!user) {
            console.log('User not found'); // Debug log
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log('Password incorrect'); // Debug log
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // Create token
        const token = jwt.sign(
            { userId: user._id, isAdmin: user.isAdmin },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        console.log('Login successful for:', email); // Debug log

        res.json({
            token,
            isAdmin: user.isAdmin,
            user: {
                id: user._id,
                name: user.firstName + ' ' + user.lastName,
                email: user.email
            }
        });

    } catch (err) {
        console.error('Login error:', err); // Debug log
        res.status(500).send('Server error');
    }
});

// Add this temporary route to check users in database
router.get('/check-users', async (req, res) => {
    try {
        console.log('Database name:', mongoose.connection.db.databaseName);
        console.log('Collections:', await mongoose.connection.db.listCollections().toArray());
        
        const users = await User.find({});
        console.log('All users in database:', users);
        res.json({
            dbName: mongoose.connection.db.databaseName,
            collections: await mongoose.connection.db.listCollections().toArray(),
            users: users
        });
    } catch (err) {
        console.error('Error checking users:', err);
        res.status(500).send('Server error');
    }
});

// Add this route to get user profile
router.get('/me', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId)
            .select('-password'); // Exclude password from response
        
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        res.json(user);
    } catch (err) {
        console.error('Error fetching user:', err);
        res.status(500).send('Server Error');
    }
});

// Add this route to update user preferences
router.put('/preferences', auth, async (req, res) => {
    try {
        const { preferences } = req.body;
        const user = await User.findById(req.user.userId);

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        user.preferences = preferences;
        await user.save();

        res.json({ msg: 'Preferences updated successfully', preferences: user.preferences });
    } catch (err) {
        console.error('Error updating preferences:', err);
        res.status(500).send('Server Error');
    }
});

module.exports = router; 
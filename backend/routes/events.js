const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const auth = require('../middleware/auth');
const User = require('../models/User');

// Get all events
router.get('/', async (req, res) => {
    try {
        const events = await Event.find().sort({ date: 1 });
        res.json(events);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Create event (admin only)
router.post('/', auth, async (req, res) => {
    try {
        console.log('Received event data:', req.body);
        const { name, date, time, location, description, capacity, type } = req.body;

        const event = new Event({
            name,
            date,
            time,
            location,
            description,
            capacity: parseInt(capacity),
            type,
            createdBy: req.user.userId
        });

        await event.save();
        res.json(event);
    } catch (err) {
        console.error('Error creating event:', err);
        res.status(500).json({ msg: 'Server Error', error: err.message });
    }
});

// RSVP to an event
router.post('/:id/rsvp', auth, async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ msg: 'Event not found' });
        }

        // Check if event is full
        if (event.rsvps && event.rsvps.length >= event.capacity) {
            return res.status(400).json({ msg: 'Event is at full capacity' });
        }

        // Check if user already RSVPed
        if (event.rsvps && event.rsvps.includes(req.user.userId)) {
            return res.status(400).json({ msg: 'Already RSVPed to this event' });
        }

        // Add user to event's RSVP list
        if (!event.rsvps) {
            event.rsvps = [];
        }
        event.rsvps.push(req.user.userId);
        await event.save();

        // Add event to user's events
        const user = await User.findById(req.user.userId);
        if (!user.events) {
            user.events = [];
        }
        user.events.push(event._id);
        await user.save();

        res.json({ 
            msg: 'Successfully RSVPed to event',
            remainingCapacity: event.capacity - event.rsvps.length
        });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).send('Server Error');
    }
});

// Get user's RSVPed events
router.get('/my-events', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).populate('events');
        res.json(user.events);
    } catch (err) {
        console.error('Error:', err);
        res.status(500).send('Server Error');
    }
});

// Get all events with RSVP details
router.get('/all-rsvps', auth, async (req, res) => {
    try {
        // Fetch all events and populate the rsvps field with user details
        const events = await Event.find()
            .populate('rsvps', 'firstName lastName email')
            .sort({ date: 1 }); // Sort by date ascending

        res.json(events);
    } catch (err) {
        console.error('Error:', err);
        res.status(500).send('Server Error');
    }
});

// Get RSVP list for specific event
router.get('/:id/rsvp-list', auth, async (req, res) => {
    try {
        const event = await Event.findById(req.params.id)
            .populate('rsvps', 'firstName lastName email');
        
        if (!event) {
            return res.status(404).json({ msg: 'Event not found' });
        }

        res.json({
            eventName: event.name,
            rsvps: event.rsvps
        });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).send('Server Error');
    }
});

// Cancel specific user's RSVP (admin)
router.post('/:eventId/cancel-user-rsvp/:userId', auth, async (req, res) => {
    try {
        const event = await Event.findById(req.params.eventId);
        if (!event) {
            return res.status(404).json({ msg: 'Event not found' });
        }

        // Remove user from event's RSVP list
        event.rsvps = event.rsvps.filter(userId => 
            userId.toString() !== req.params.userId
        );
        await event.save();

        // Remove event from user's events
        const user = await User.findById(req.params.userId);
        if (user) {
            user.events = user.events.filter(eventId => 
                eventId.toString() !== req.params.eventId
            );
            await user.save();
        }

        res.json({ msg: 'RSVP cancelled successfully' });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).send('Server Error');
    }
});

// Cancel all RSVPs for an event (admin)
router.post('/:id/cancel-all-rsvps', auth, async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ msg: 'Event not found' });
        }

        // Store users who RSVPed to remove event from their lists
        const rsvpedUsers = [...event.rsvps];

        // Clear all RSVPs from event
        event.rsvps = [];
        await event.save();

        // Remove event from all users' events lists
        for (const userId of rsvpedUsers) {
            const user = await User.findById(userId);
            if (user) {
                user.events = user.events.filter(eventId => 
                    eventId.toString() !== req.params.id
                );
                await user.save();
            }
        }

        res.json({ msg: 'All RSVPs cancelled successfully' });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).send('Server Error');
    }
});

// Delete event
router.delete('/:id', auth, async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({ msg: 'Event not found' });
        }

        // Use deleteOne instead of remove
        await Event.deleteOne({ _id: req.params.id });

        res.json({ msg: 'Event removed' });
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Event not found' });
        }
        res.status(500).send('Server Error');
    }
});

module.exports = router; 
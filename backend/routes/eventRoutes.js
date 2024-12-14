const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const auth = require('../middleware/auth');

// Get all events
router.get('/', async (req, res) => {
    try {
        const events = await Event.find();
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// RSVP to an event
router.post('/:id/rsvp', auth, async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Check if user already RSVP'd
        const userIndex = event.rsvps.indexOf(req.user.id);
        
        if (userIndex > -1) {
            // If already RSVP'd, remove the RSVP (un-RSVP)
            event.rsvps.splice(userIndex, 1);
            event.availableSeats += 1;
            await event.save();
            return res.json({ message: 'RSVP removed successfully', event });
        }

        // If not RSVP'd, add new RSVP
        if (event.availableSeats <= 0) {
            return res.status(400).json({ message: 'No available seats' });
        }

        event.rsvps.push(req.user.id);
        event.availableSeats -= 1;
        await event.save();

        res.json({ message: 'RSVP added successfully', event });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;

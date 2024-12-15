require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

// Connect to the database
connectDB();

// Middleware
app.use(cors({
    origin: [
        'https://eventicity-frontend.onrender.com', // Add your frontend Render URL
        'https://eventicity-backend.onrender.com'  // Backend Render URL
    ],
    credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/users', require('./routes/users'));
app.use('/api/events', require('./routes/events'));
app.use('/api/admin', require('./routes/admin'));

// Serve static files (for a built frontend, if applicable)
if (process.env.NODE_ENV === 'production') {
    app.use(express.static('frontend')); // Ensure your built frontend is in the 'frontend' directory
}

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        console.log('Connected to MongoDB');
        console.log('Database name:', mongoose.connection.db.databaseName);
    })
    .catch(err => console.error('MongoDB connection error:', err));

// Port configuration
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

// Connect Database
connectDB();

// Middleware
app.use(cors({
    origin: ['http://localhost:5504', 'http://127.0.0.1:5504', 'https://your-frontend-url.onrender.com'],
    credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/users', require('./routes/users'));
app.use('/api/events', require('./routes/events'));
app.use('/api/admin', require('./routes/admin'));

// Add this for Render deployment
if (process.env.NODE_ENV === 'production') {
    app.use(express.static('frontend'));
}

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('Connected to MongoDB');
        console.log('Database name:', mongoose.connection.db.databaseName);
        console.log('Collections:', mongoose.connection.db.listCollections().toArray());
    })
    .catch(err => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect('mongodb+srv://YawGyamera:CTiJ6grPFzIcWjr6@eventicity-cluster.wkgkt.mongodb.net/', {
            dbName: 'Eventicity'  // Add this line to be explicit
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        
        // Test the connection and log more details
        const db = conn.connection.db;
        const collections = await db.listCollections().toArray();
        console.log('Database name:', db.databaseName);
        console.log('Available collections:', collections.map(c => c.name));
        
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;
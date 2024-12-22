const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect('mongodb+srv://asantewaa:notasant2004@ems-2.hrnj2.mongodb.net/', {
            dbName: 'Camara',  // Explicitly specify the database name
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        console.log('Database name:', conn.connection.db.databaseName);
        
        // Test the connection and log collections
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
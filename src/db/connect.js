const mongoose = require('mongoose');
require("dotenv").config()
const mongo_uri = process.env.DB_URI;

const connectDB = async () => {
    try {
        await mongoose.connect(mongo_uri, {
            family: 4,
        });
        console.log('MongoDB connected');
    } catch (error) {
        console.error('MongoDB connection error:', error)
    }
}

module.exports = connectDB;
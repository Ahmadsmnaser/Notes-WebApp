import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config(); 

const mongoUrl = process.env.MONGODB_CONNECTION_URL;

if (!mongoUrl) {
    throw new Error("Missing MONGODB_CONNECTION_URL in .env file");
}

export const connectToDB = async () => {
    try {
        await mongoose.connect(mongoUrl);
        console.log('✅ Connected to MongoDB');
    } catch (error) {
        console.error('❌ MongoDB connection error:', error);
        process.exit(1); 
    }
};

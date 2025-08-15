import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ecomart';
    console.log('Connecting to MongoDB:', mongoUri);
    
    const conn = await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000
    });
    
    // Test the connection
    await conn.connection.db.admin().ping();
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    return conn;
  } catch (error) {
    console.error('MongoDB Connection Error:', error);
    if (error.name === 'MongoServerSelectionError') {
      console.error('Could not connect to MongoDB server. Please check if MongoDB is running.');
    }
    process.exit(1);
  }
};

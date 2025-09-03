import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ecomart';

async function cleanupChatDatabase() {
  try {
    console.log('Connecting to MongoDB:', MONGODB_URI);
    await mongoose.connect(MONGODB_URI);
    
    const db = mongoose.connection.db;
    
    // Check if chats collection exists
    const collections = await db.listCollections({ name: 'chats' }).toArray();
    
    if (collections.length > 0) {
      console.log('Found chats collection, cleaning up...');
      
      // Drop all indexes on chats collection
      try {
        const indexes = await db.collection('chats').indexes();
        console.log('Current indexes:', indexes);
        
        // Drop all indexes except _id
        for (const index of indexes) {
          if (index.name !== '_id_') {
            console.log('Dropping index:', index.name);
            await db.collection('chats').dropIndex(index.name);
          }
        }
      } catch (indexError) {
        console.log('Index cleanup error (may be expected):', indexError.message);
      }
      
      // Remove any documents with null values
      const deleteResult = await db.collection('chats').deleteMany({
        $or: [
          { productId: null },
          { buyerId: null },
          { sellerId: null }
        ]
      });
      
      console.log('Deleted documents with null values:', deleteResult.deletedCount);
      
      // Create the correct compound index
      try {
        await db.collection('chats').createIndex(
          { productId: 1, buyerId: 1, sellerId: 1 }, 
          { unique: true, name: 'productId_1_buyerId_1_sellerId_1' }
        );
        console.log('Created correct compound index');
      } catch (indexCreateError) {
        console.log('Index creation error:', indexCreateError.message);
      }
    } else {
      console.log('No chats collection found, nothing to clean up');
    }
    
    console.log('Database cleanup completed successfully');
    
  } catch (error) {
    console.error('Database cleanup failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Database connection closed');
  }
}

// Run the cleanup
cleanupChatDatabase().catch(console.error);

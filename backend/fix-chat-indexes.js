import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

async function fixChatIndexes() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to database');
    
    const chatCollection = mongoose.connection.db.collection('chats');
    
    // Drop existing wrong indexes (except _id)
    const indexes = await chatCollection.indexes();
    for (const index of indexes) {
      if (index.name !== '_id_') {
        console.log(`Dropping index: ${index.name}`);
        try {
          await chatCollection.dropIndex(index.name);
        } catch (error) {
          console.log(`Failed to drop index ${index.name}:`, error.message);
        }
      }
    }
    
    // Create the correct unique compound index
    console.log('Creating correct compound unique index...');
    await chatCollection.createIndex(
      { productId: 1, buyerId: 1, sellerId: 1 }, 
      { unique: true, background: true }
    );
    
    // Create other useful indexes
    await chatCollection.createIndex({ buyerId: 1 }, { background: true });
    await chatCollection.createIndex({ sellerId: 1 }, { background: true });
    await chatCollection.createIndex({ productId: 1 }, { background: true });
    await chatCollection.createIndex({ updatedAt: -1 }, { background: true });
    
    console.log('Indexes fixed successfully');
    
    // Verify new indexes
    const newIndexes = await chatCollection.indexes();
    console.log('New indexes:', JSON.stringify(newIndexes, null, 2));
    
    mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error.message);
    mongoose.connection.close();
  }
}

fixChatIndexes();

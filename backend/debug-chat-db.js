import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

async function checkChatDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to database');
    
    const chatCollection = mongoose.connection.db.collection('chats');
    const messageCollection = mongoose.connection.db.collection('messages');
    
    // Check indexes
    const indexes = await chatCollection.indexes();
    console.log('Chat collection indexes:', JSON.stringify(indexes, null, 2));
    
    // Check for duplicate chats
    const duplicateChats = await chatCollection.aggregate([
      {
        $group: {
          _id: { productId: '$productId', buyerId: '$buyerId', sellerId: '$sellerId' },
          count: { $sum: 1 },
          docs: { $push: '$_id' }
        }
      },
      {
        $match: { count: { $gt: 1 } }
      }
    ]).toArray();
    
    console.log('Duplicate chats found:', duplicateChats.length);
    if (duplicateChats.length > 0) {
      console.log('Duplicates:', JSON.stringify(duplicateChats, null, 2));
      
      // Remove duplicates, keeping the first one
      for (const duplicate of duplicateChats) {
        const idsToRemove = duplicate.docs.slice(1); // Remove all but the first
        console.log(`Removing duplicate chat IDs: ${idsToRemove.join(', ')}`);
        await chatCollection.deleteMany({ _id: { $in: idsToRemove } });
        
        // Also remove associated messages
        await messageCollection.deleteMany({ chatId: { $in: idsToRemove } });
      }
      console.log('Duplicates cleaned up');
    }
    
    // Check total counts
    const chatCount = await chatCollection.countDocuments();
    const messageCount = await messageCollection.countDocuments();
    console.log(`Total chats: ${chatCount}, Total messages: ${messageCount}`);
    
    mongoose.connection.close();
    console.log('Database check completed');
  } catch (error) {
    console.error('Error:', error.message);
    mongoose.connection.close();
  }
}

checkChatDatabase();

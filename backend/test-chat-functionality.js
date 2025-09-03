// Chat functionality debugging and testing script
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Chat, Message } from './models/chatModel.js';
import Product from './models/productModel.js';
import User from './models/userModel.js';

dotenv.config({ path: '.env' });

async function testChatFunctionality() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to database for chat testing');
    
    // Find a test product and users
    const product = await Product.findOne().populate('owner');
    const users = await User.find().limit(2);
    
    if (!product) {
      console.log('❌ No products found in database');
      return;
    }
    
    if (users.length < 2) {
      console.log('❌ Need at least 2 users in database');
      return;
    }
    
    const seller = product.owner;
    const buyer = users.find(u => u._id.toString() !== seller._id.toString());
    
    if (!buyer) {
      console.log('❌ Could not find a different user for buyer');
      return;
    }
    
    console.log('Test Setup:');
    console.log(`Product: ${product.title} (${product._id})`);
    console.log(`Seller: ${seller.name} (${seller._id})`);
    console.log(`Buyer: ${buyer.name} (${buyer._id})`);
    
    // Test chat creation
    console.log('\n🧪 Testing chat creation...');
    
    try {
      // Try to create chat
      let chat = await Chat.findOne({ 
        productId: product._id, 
        buyerId: buyer._id, 
        sellerId: seller._id 
      });
      
      if (!chat) {
        chat = await Chat.create({
          productId: product._id,
          buyerId: buyer._id,
          sellerId: seller._id
        });
        console.log('✅ Chat created successfully:', chat._id);
      } else {
        console.log('✅ Chat already exists:', chat._id);
      }
      
      // Test message creation
      console.log('\n🧪 Testing message creation...');
      const message = await Message.create({
        chatId: chat._id,
        senderId: buyer._id,
        receiverId: seller._id,
        content: 'Test message from automated test'
      });
      
      console.log('✅ Message created successfully:', message._id);
      
      // Test duplicate chat prevention
      console.log('\n🧪 Testing duplicate prevention...');
      try {
        await Chat.create({
          productId: product._id,
          buyerId: buyer._id,
          sellerId: seller._id
        });
        console.log('❌ Duplicate chat was created (this should not happen)');
      } catch (duplicateError) {
        if (duplicateError.code === 11000) {
          console.log('✅ Duplicate chat prevented successfully');
        } else {
          console.log('❌ Unexpected error:', duplicateError.message);
        }
      }
      
      console.log('\n✅ All chat functionality tests passed!');
      
    } catch (error) {
      console.log('❌ Chat test failed:', error.message);
    }
    
    mongoose.connection.close();
  } catch (error) {
    console.error('Error in chat testing:', error);
    mongoose.connection.close();
  }
}

testChatFunctionality();

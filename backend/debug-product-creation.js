// Quick test script to debug product creation issue
// Run this from the backend directory with: node debug-product-creation.js

import mongoose from 'mongoose';
import Product from './models/productModel.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

console.log('🔧 DEBUG: Testing Product Creation');
console.log('MongoDB URI:', process.env.MONGODB_URI);

// Connect to MongoDB
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error);
    process.exit(1);
  }
}

// Test product creation
async function testProductCreation() {
  try {
    console.log('\n🧪 Testing Product Creation...');
    
    const testProduct = {
      title: 'Test Product for Sell',
      description: 'This is a test product to debug the creation issue',
      price: 100,
      category: 'Electronics',
      condition: 'New',
      type: 'sell',
      location: 'Test City',
      owner: new mongoose.Types.ObjectId('507f1f77bcf86cd799439011'), // Dummy ObjectId
      images: []
    };
    
    console.log('📝 Test product data:', testProduct);
    
    // Create product
    const product = await Product.create(testProduct);
    console.log('✅ Product created successfully:', product);
    
    // Test finding the product
    const foundProduct = await Product.findById(product._id);
    console.log('✅ Product found:', foundProduct);
    
    // Clean up - delete test product
    await Product.findByIdAndDelete(product._id);
    console.log('🧹 Test product deleted');
    
  } catch (error) {
    console.error('❌ Product Creation Error:', error);
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      errors: error.errors
    });
  }
}

// Run tests
async function runDebugTests() {
  await connectDB();
  await testProductCreation();
  
  console.log('\n🔍 Product Model Schema:');
  console.log(Product.schema.paths);
  
  await mongoose.connection.close();
  console.log('📤 MongoDB Disconnected');
}

runDebugTests().catch(console.error);

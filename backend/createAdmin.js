// Admin Recovery Script for ECOMART
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './models/userModel.js';

dotenv.config({ path: '.env' });

const MONGODB_URI = process.env.MONGODB_URI;

async function createAdmin() {
  try {
    console.log('🔧 Admin Recovery Script Starting...');
    
    // Connect to database
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ 
      $or: [
        { email: 'admin@ecomart.com' },
        { role: 'admin' }
      ]
    });

    if (existingAdmin) {
      console.log('ℹ️  Admin user already exists:');
      console.log(`   Email: ${existingAdmin.email}`);
      console.log(`   Name: ${existingAdmin.name}`);
      console.log(`   Role: ${existingAdmin.role}`);
      
      // Update password if needed
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin123', salt);
      
      await User.updateOne(
        { _id: existingAdmin._id },
        { 
          password: hashedPassword,
          role: 'admin',
          isVerified: true 
        }
      );
      
      console.log('✅ Admin password reset to: admin123');
    } else {
      // Create new admin user
      console.log('📝 Creating new admin user...');
      
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin123', salt);
      
      const adminUser = await User.create({
        name: 'Admin User',
        email: 'admin@ecomart.com',
        password: hashedPassword,
        phone: '1234567890',
        address: {
          street: 'Admin Street',
          city: 'Admin City',
          state: 'NY',
          zipCode: '10001',
          country: 'USA'
        },
        role: 'admin',
        isVerified: true
      });

      console.log('✅ New admin user created successfully!');
      console.log(`   ID: ${adminUser._id}`);
      console.log(`   Email: ${adminUser.email}`);
      console.log(`   Name: ${adminUser.name}`);
    }

    console.log('\n🔑 Admin Login Credentials:');
    console.log('   Email: admin@ecomart.com');
    console.log('   Password: admin123');
    console.log('\n✅ Admin recovery completed successfully!');

    await mongoose.disconnect();
    console.log('✅ Disconnected from database');
    process.exit(0);

  } catch (error) {
    console.error('❌ Error during admin recovery:', error);
    
    if (error.code === 11000) {
      console.log('ℹ️  Admin user already exists with that email.');
      console.log('🔑 Login with: admin@ecomart.com / admin123');
    }
    
    await mongoose.disconnect();
    process.exit(1);
  }
}

// Run the script
createAdmin();

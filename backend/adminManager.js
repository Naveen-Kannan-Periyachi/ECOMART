// Comprehensive Admin Management Script
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './models/userModel.js';

dotenv.config({ path: '.env' });

const MONGODB_URI = process.env.MONGODB_URI;

async function manageAdmin(action = 'create') {
  try {
    console.log(`🔧 Admin Management - ${action.toUpperCase()} mode`);
    
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    switch (action) {
      case 'create':
      case 'recreate':
        await createOrRecreateAdmin();
        break;
      case 'reset':
        await resetAdminPassword();
        break;
      case 'check':
        await checkAdminStatus();
        break;
      case 'delete':
        await deleteAdmin();
        break;
      default:
        console.log('❓ Invalid action. Use: create, recreate, reset, check, or delete');
    }

    await mongoose.disconnect();
    console.log('✅ Disconnected from database');
    process.exit(0);

  } catch (error) {
    console.error('❌ Error:', error.message);
    await mongoose.disconnect();
    process.exit(1);
  }
}

async function createOrRecreateAdmin() {
  // Delete existing admin if recreating
  if (process.argv.includes('recreate')) {
    await User.deleteMany({ role: 'admin' });
    console.log('🗑️  Deleted existing admin users');
  }

  // Check if admin exists
  const existingAdmin = await User.findOne({ role: 'admin' });
  
  if (existingAdmin && !process.argv.includes('recreate')) {
    console.log('ℹ️  Admin already exists:');
    console.log(`   Email: ${existingAdmin.email}`);
    console.log(`   Name: ${existingAdmin.name}`);
    return;
  }

  // Create new admin
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

  console.log('✅ Admin user created successfully!');
  console.log(`   ID: ${adminUser._id}`);
  console.log(`   Email: ${adminUser.email}`);
  console.log(`   Name: ${adminUser.name}`);
}

async function resetAdminPassword() {
  const admin = await User.findOne({ role: 'admin' });
  
  if (!admin) {
    console.log('❌ No admin user found. Creating new admin...');
    await createOrRecreateAdmin();
    return;
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash('admin123', salt);
  
  await User.updateOne(
    { _id: admin._id },
    { password: hashedPassword }
  );

  console.log('✅ Admin password reset successfully!');
  console.log(`   Email: ${admin.email}`);
  console.log('   New Password: admin123');
}

async function checkAdminStatus() {
  const admins = await User.find({ role: 'admin' });
  
  if (admins.length === 0) {
    console.log('❌ No admin users found in database');
    console.log('💡 Run: node adminManager.js create');
    return;
  }

  console.log(`✅ Found ${admins.length} admin user(s):`);
  admins.forEach((admin, index) => {
    console.log(`   ${index + 1}. ${admin.name} (${admin.email})`);
    console.log(`      ID: ${admin._id}`);
    console.log(`      Verified: ${admin.isVerified}`);
    console.log(`      Created: ${admin.createdAt}`);
  });
}

async function deleteAdmin() {
  const result = await User.deleteMany({ role: 'admin' });
  console.log(`🗑️  Deleted ${result.deletedCount} admin user(s)`);
  
  if (result.deletedCount > 0) {
    console.log('⚠️  All admin access removed!');
    console.log('💡 To restore admin access, run: node adminManager.js create');
  }
}

// Get action from command line arguments
const action = process.argv[2] || 'create';

// Show usage if help requested
if (action === 'help' || action === '--help') {
  console.log('📖 Admin Manager Usage:');
  console.log('  node adminManager.js create    - Create admin if not exists');
  console.log('  node adminManager.js recreate  - Delete and recreate admin');
  console.log('  node adminManager.js reset     - Reset admin password');
  console.log('  node adminManager.js check     - Check admin status');
  console.log('  node adminManager.js delete    - Delete all admin users');
  console.log('  node adminManager.js help      - Show this help');
  console.log('\n🔑 Default Admin Credentials:');
  console.log('  Email: admin@ecomart.com');
  console.log('  Password: admin123');
  process.exit(0);
}

// Run the management function
manageAdmin(action);

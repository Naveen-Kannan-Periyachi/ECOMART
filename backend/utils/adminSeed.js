import User from '../models/userModel.js';
import dotenv from 'dotenv';

dotenv.config();

export const createAdminIfNotExists = async () => {
  try {
    // Check if any admin exists
    const adminExists = await User.findOne({ role: 'admin' });
    
    if (!adminExists) {
      const adminEmail = process.env.ADMIN_EMAIL;
      const adminPassword = process.env.ADMIN_PASSWORD;
      
      if (!adminEmail || !adminPassword) {
        console.log('⚠️  ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env to create default admin');
        return;
      }

      // Check if user with admin email already exists
      const existingUser = await User.findOne({ email: adminEmail });
      
      if (existingUser) {
        // Promote existing user to admin
        existingUser.role = 'admin';
        await existingUser.save();
        console.log(`✅ Promoted existing user ${adminEmail} to admin`);
      } else {
        // Create new admin user
        const adminUser = await User.create({
          name: 'Admin',
          email: adminEmail,
          password: adminPassword,
          phone: '0000000000',
          role: 'admin',
          address: {
            street: 'Admin Street',
            city: 'Admin City',
            state: 'Admin State',
            zipCode: '00000',
            country: 'Admin Country'
          }
        });
        
        console.log(`✅ Created default admin user: ${adminEmail}`);
      }
    } else {
      console.log('✅ Admin user already exists');
    }
  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
  }
};

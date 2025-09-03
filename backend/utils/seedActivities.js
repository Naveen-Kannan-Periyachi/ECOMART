import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { connectDB } from '../config/db.js';
import User from '../models/userModel.js';
import Product from '../models/productModel.js';
import Activity from '../models/Activity.js';

dotenv.config();

const seedActivities = async () => {
  try {
    await connectDB();
    console.log('Connected to MongoDB for seeding activities...');

    // Clear existing activities
    await Activity.deleteMany({});
    console.log('Cleared existing activities');

    // Get all users and products
    const users = await User.find({});
    const products = await Product.find({});

    if (users.length === 0 || products.length === 0) {
      console.log('No users or products found. Please seed users and products first.');
      process.exit(1);
    }

    const activities = [];
    const actions = ['viewed', 'bought', 'rented', 'added_to_cart'];
    const categories = ['Electronics', 'Fashion', 'Home & Garden', 'Sports', 'Books', 'Automotive'];

    // Generate activities for each user
    for (const user of users) {
      // Each user will have 10-30 activities
      const numActivities = Math.floor(Math.random() * 21) + 10;
      
      for (let i = 0; i < numActivities; i++) {
        const randomProduct = products[Math.floor(Math.random() * products.length)];
        const randomAction = actions[Math.floor(Math.random() * actions.length)];
        
        // Create more realistic activity patterns
        let weight = 1;
        if (randomAction === 'viewed') weight = 0.8; // Views are more common
        if (randomAction === 'bought') weight = 0.1; // Purchases are rare
        if (randomAction === 'rented') weight = 0.15; // Rentals are somewhat rare
        if (randomAction === 'added_to_cart') weight = 0.3; // Cart additions are moderate
        
        if (Math.random() < weight) {
          // Create activity with realistic timing (last 90 days)
          const daysAgo = Math.floor(Math.random() * 90);
          const activityDate = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
          
          activities.push({
            userId: user._id,
            productId: randomProduct._id,
            action: randomAction,
            createdAt: activityDate,
            metadata: {
              timeSpent: randomAction === 'viewed' ? Math.floor(Math.random() * 300) + 30 : undefined,
              referrer: Math.random() > 0.5 ? 'search' : 'browse'
            }
          });
        }
      }

      // Add some category-specific activities to create patterns
      const userPreferredCategories = categories.slice(0, Math.floor(Math.random() * 3) + 1);
      for (const category of userPreferredCategories) {
        const categoryProducts = products.filter(p => p.category === category);
        if (categoryProducts.length > 0) {
          for (let i = 0; i < Math.floor(Math.random() * 5) + 2; i++) {
            const randomProduct = categoryProducts[Math.floor(Math.random() * categoryProducts.length)];
            const daysAgo = Math.floor(Math.random() * 30); // Recent activities
            const activityDate = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
            
            activities.push({
              userId: user._id,
              productId: randomProduct._id,
              action: 'viewed',
              createdAt: activityDate,
              metadata: {
                timeSpent: Math.floor(Math.random() * 300) + 60,
                referrer: 'category_browse'
              }
            });
          }
        }
      }
    }

    // Insert all activities
    await Activity.insertMany(activities);
    console.log(`✅ Successfully seeded ${activities.length} activities`);

    // Show some statistics
    const stats = await Activity.aggregate([
      {
        $group: {
          _id: '$action',
          count: { $sum: 1 }
        }
      }
    ]);

    console.log('\n📊 Activity Statistics:');
    stats.forEach(stat => {
      console.log(`${stat._id}: ${stat.count}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error seeding activities:', error);
    process.exit(1);
  }
};

seedActivities();

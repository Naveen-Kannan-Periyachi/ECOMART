// Sample data seed script for Ecomart
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/userModel.js';
import Product from './models/productModel.js';
import Order from './models/Order.js';

dotenv.config({ path: '.env' });

const MONGODB_URI = process.env.MONGODB_URI;

const users = [
  {
    name: 'Alice Seller',
    email: 'alice@example.com',
    password: 'password123',
    phone: '1234567890',
    address: { street: '1 Main St', city: 'New York', state: 'NY', zipCode: '10001', country: 'USA' },
    role: 'user'
  },
  {
    name: 'Bob Buyer',
    email: 'bob@example.com',
    password: 'password123',
    phone: '0987654321',
    address: { street: '2 Main St', city: 'Los Angeles', state: 'CA', zipCode: '90210', country: 'USA' },
    role: 'user'
  },
  {
    name: 'Charlie Chen',
    email: 'charlie@example.com',
    password: 'password123',
    phone: '5551234567',
    address: { street: '3 Tech Ave', city: 'San Francisco', state: 'CA', zipCode: '94102', country: 'USA' },
    role: 'user'
  }
];

const products = [
  {
    title: 'iPhone 14 Pro',
    description: 'Latest iPhone 14 Pro with 128GB storage, barely used for 2 months. Includes original box and accessories.',
    price: 900,
    category: 'Electronics',
    condition: 'Like New',
    type: 'sell',
    images: [],
    location: 'New York, NY',
    status: 'available',
  },
  {
    title: 'Mountain Bike - Trek X5',
    description: 'Professional mountain bike, perfect for trail riding. Well maintained with recent tune-up.',
    price: 500,
    rentPricePerDay: 25,
    category: 'Sports',
    condition: 'Good',
    type: 'rent',
    images: [],
    location: 'Los Angeles, CA',
    status: 'available',
  },
  {
    title: 'Vintage Leather Sofa',
    description: 'Beautiful vintage brown leather sofa, 3-seater. Perfect for modern living rooms.',
    price: 750,
    category: 'Furniture',
    condition: 'Good',
    type: 'sell',
    images: [],
    location: 'San Francisco, CA',
    status: 'available',
  },
  {
    title: 'MacBook Pro 2023',
    description: 'MacBook Pro M2 chip, 16GB RAM, 512GB SSD. Perfect for professional work.',
    price: 1800,
    rentPricePerDay: 50,
    category: 'Electronics',
    condition: 'New',
    type: 'rent',
    images: [],
    location: 'New York, NY',
    status: 'available',
  },
  {
    title: 'Nike Air Jordan Sneakers',
    description: 'Limited edition Nike Air Jordan sneakers, size 10. Worn only a few times.',
    price: 200,
    category: 'Fashion',
    condition: 'Like New',
    type: 'sell',
    images: [],
    location: 'Los Angeles, CA',
    status: 'available',
  }
];

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({ role: { $ne: 'admin' } }); // Keep admin users
    await Product.deleteMany();
    await Order.deleteMany();
    console.log('Cleared existing data');

    // Create users
    const createdUsers = await User.insertMany(users);
    console.log(`Created ${createdUsers.length} users`);

    // Assign products to users
    products[0].owner = createdUsers[0]._id; // Alice
    products[1].owner = createdUsers[0]._id; // Alice
    products[2].owner = createdUsers[1]._id; // Bob
    products[3].owner = createdUsers[2]._id; // Charlie
    products[4].owner = createdUsers[2]._id; // Charlie

    const createdProducts = await Product.insertMany(products);
    console.log(`Created ${createdProducts.length} products`);

    // Create sample orders
    const sampleOrders = [
      {
        buyer: createdUsers[1]._id, // Bob buying from Alice
        products: [createdProducts[0]._id], // iPhone
        total: createdProducts[0].price,
        status: 'confirmed'
      },
      {
        buyer: createdUsers[2]._id, // Charlie buying from Bob
        products: [createdProducts[2]._id], // Sofa
        total: createdProducts[2].price,
        status: 'pending'
      }
    ];

    const createdOrders = await Order.insertMany(sampleOrders);
    console.log(`Created ${createdOrders.length} orders`);

    console.log('\n🎉 Seed data created successfully!');
    console.log('\nSample Users:');
    console.log('alice@example.com / password123');
    console.log('bob@example.com / password123');
    console.log('charlie@example.com / password123');
    console.log('\nAdmin User:');
    console.log('admin@ecomart.com / admin123');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
}

// Run if called directly
if (process.argv[1] === new URL(import.meta.url).pathname) {
  seed();
}

export default seed;

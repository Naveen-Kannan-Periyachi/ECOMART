// Sample data seed script for Ecomart
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/userModel.js';
import Product from './models/productModel.js';

dotenv.config({ path: '.env' });

const MONGODB_URI = process.env.MONGODB_URI;

const users = [
  {
    name: 'Alice Seller',
    email: 'alice@example.com',
    password: 'password123',
    phone: '1234567890',
    address: { street: '1 Main St', city: 'Town', state: 'ST', zipCode: '12345', country: 'Country' },
  },
  {
    name: 'Bob Buyer',
    email: 'bob@example.com',
    password: 'password123',
    phone: '0987654321',
    address: { street: '2 Main St', city: 'Town', state: 'ST', zipCode: '12345', country: 'Country' },
  },
];

const products = [
  {
    title: 'iPhone 14',
    description: 'Latest iPhone, barely used',
    price: 900,
    rentPricePerDay: 20,
    category: 'Electronics',
    condition: 'Like New',
    type: 'sell',
    images: [],
    location: 'Town',
    status: 'available',
  },
  {
    title: 'Mountain Bike',
    description: 'Great for trails',
    price: 300,
    rentPricePerDay: 10,
    category: 'Sports',
    condition: 'Good',
    type: 'rent',
    images: [],
    location: 'Town',
    status: 'available',
  },
];

async function seed() {
  await mongoose.connect(MONGODB_URI);
  await User.deleteMany();
  await Product.deleteMany();
  const createdUsers = await User.insertMany(users);
  products[0].owner = createdUsers[0]._id;
  products[1].owner = createdUsers[0]._id;
  await Product.insertMany(products);
  console.log('Seeded users and products');
  process.exit();
}

seed();

<<<<<<< HEAD
# ECOMART
=======
# Ecomart - Full-Stack Marketplace

A complete marketplace platform for selling, buying, and renting products.

## Features

- User authentication with JWT
- Product management (CRUD operations)
- Buy and sell products
- Rent products with booking system
- Shopping cart
- Secure payments with Stripe
- Image upload with AWS S3
- Email notifications
- Responsive design

## Tech Stack

### Frontend

- React (Vite)
- Redux Toolkit for state management
- React Router for navigation
- Material-UI for components
- Stripe Elements for payments
- React Image Gallery

### Backend

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- AWS S3 for image storage
- Stripe for payment processing
- Nodemailer for emails

## Setup Instructions

### Prerequisites

- Node.js (v14 or later)
- MongoDB
- AWS account (for S3)
- Stripe account
- SMTP server (for emails)

### Backend Setup

1. Navigate to backend directory:

   ```bash
   cd backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create .env file:

   ```
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRES_IN=30d
   AWS_ACCESS_KEY_ID=your_aws_key
   AWS_SECRET_ACCESS_KEY=your_aws_secret
   AWS_REGION=your_region
   AWS_BUCKET_NAME=your_bucket
   USE_S3_STORAGE=true
   STRIPE_SECRET_KEY=your_stripe_key
   STRIPE_WEBHOOK_SECRET=your_webhook_secret
   EMAIL_HOST=your_smtp_host
   EMAIL_PORT=587
   EMAIL_USER=your_email
   EMAIL_PASS=your_password
   EMAIL_FROM=noreply@ecomart.com
   ```

4. Start the server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to frontend directory:

   ```bash
   cd frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create .env file:

   ```
   VITE_API_URL=http://localhost:5000
   VITE_STRIPE_PUBLIC_KEY=your_stripe_public_key
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## API Documentation

### Authentication

- POST /api/users/register - Register new user
- POST /api/users/login - Login user
- GET /api/users/profile - Get user profile

### Products

- GET /api/products - List products (with pagination)
- GET /api/products/:id - Get product details
- POST /api/products - Create product
- PUT /api/products/:id - Update product
- DELETE /api/products/:id - Delete product

### Orders

- POST /api/orders - Create order
- GET /api/orders/:id - Get order details
- PUT /api/orders/:id/pay - Update order to paid
- GET /api/orders/myorders - Get user orders

### Bookings

- POST /api/bookings - Create booking request
- GET /api/bookings/mybookings - Get user's bookings
- GET /api/bookings/owner - Get owner's bookings
- PUT /api/bookings/:id/confirm - Confirm booking
- PUT /api/bookings/:id/cancel - Cancel booking
- PUT /api/bookings/:id/pay - Complete booking payment

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

## License

This project is licensed under the MIT License.
>>>>>>> 278ddf3 (Initial commit)

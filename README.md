# 🛍️ EcoMart - Professional Marketplace Platform

**EcoMart** is a comprehensive full-stack marketplace application that combines the best features of Amazon, OLX, and rental platforms. Users can buy, sell, and rent products with a modern, secure, and user-friendly interface.

![EcoMart Banner](https://img.shields.io/badge/EcoMart-Marketplace-blue?style=for-the-badge&logo=shopping-cart)

## 🌟 Key Features

### 🛒 **Marketplace Functionality**

- **Buy Products**: Browse and purchase from thousands of listings
- **Sell Items**: List your products with detailed descriptions and images
- **Rent & Lend**: Rent items you need or earn by lending your valuables
- **Real-time Chat**: Communicate directly with buyers and sellers
- **Advanced Search**: Filter by category, price, condition, location, and more

### 👥 **User Management**

- **Role-based Authentication**: User, Admin roles with secure JWT tokens
- **Profile Management**: Complete user profiles with addresses and preferences
- **Order Tracking**: Track purchases, sales, and rental history
- **Wishlist**: Save favorite products for later

### 🔐 **Admin Panel**

- **User Management**: View, manage, and moderate user accounts
- **Product Management**: Oversee all product listings and approvals
- **Order Management**: Monitor transactions and resolve disputes
- **Analytics Dashboard**: Comprehensive insights and statistics
- **Content Moderation**: Review and approve user-generated content

### 🎨 **Professional UI/UX**

- **Modern Design**: Clean, responsive interface with Material-UI
- **Dark/Light Themes**: Customizable theme support
- **Mobile Responsive**: Optimized for all device sizes
- **Accessibility**: WCAG compliant with keyboard navigation
- **Progressive Web App**: Installable with offline capabilities

## 🏗️ Technology Stack

### **Frontend**

- **React 19.1.1** - Latest React with concurrent features
- **Vite 7.1.1** - Lightning-fast build tool and dev server
- **Material-UI 7.3.1** - Professional component library
- **Tailwind CSS 3.4.0** - Utility-first CSS framework
- **Redux Toolkit** - State management with RTK Query
- **React Router DOM** - Client-side routing
- **Socket.IO Client** - Real-time communication

### **Backend**

- **Node.js & Express.js** - Server runtime and web framework
- **MongoDB & Mongoose** - NoSQL database with ODM
- **Socket.IO** - Real-time bidirectional communication
- **JWT** - JSON Web Tokens for authentication
- **Express Validator** - Input validation and sanitization
- **Multer** - File upload handling
- **Bcrypt** - Password hashing and security

### **Development Tools**

- **ESLint & Prettier** - Code linting and formatting
- **Concurrently** - Run multiple processes simultaneously
- **Nodemon** - Auto-restart development server
- **PostCSS** - CSS transformation and optimization

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v18+ recommended)
- **MongoDB** (v6+ recommended)
- **npm** or **yarn** package manager

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/ecomart.git
   cd ecomart
   ```

2. **Install dependencies**

   ```bash
   # Install backend dependencies
   cd backend
   npm install

   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. **Environment Configuration**

   Create `backend/.env` file:

   ```env
   # Server Configuration
   PORT=5001
   NODE_ENV=development

   # Database
   MONGODB_URI=mongodb://127.0.0.1:27017/ecomart

   # Authentication
   JWT_SECRET=your_super_secure_jwt_secret_key_here

   # Email Configuration (Optional)
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   ```

4. **Start the application**

   **Development Mode (Recommended):**

   ```bash
   # From project root - starts both frontend and backend
   npm run dev
   ```

   **Or start separately:**

   ```bash
   # Terminal 1 - Backend
   cd backend
   npm run dev

   # Terminal 2 - Frontend
   cd frontend
   npm run dev
   ```

5. **Seed the database** (Optional)
   ```bash
   cd backend
   node seed.js
   ```

### 🌐 Application URLs

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5001
- **Admin Panel**: http://localhost:5173/admin

### 🔑 Default Credentials

**Admin Account:**

- Email: `admin@ecomart.com`
- Password: `admin123`

**Test Users:** (after seeding)

- Email: `alice@example.com` / Password: `password123`
- Email: `bob@example.com` / Password: `password123`
- Email: `charlie@example.com` / Password: `password123`

## 📁 Project Structure

```
ecomart/
├── backend/                 # Express.js server
│   ├── config/             # Database and app configuration
│   ├── controllers/        # Request handlers and business logic
│   ├── middleware/         # Authentication, validation, error handling
│   ├── models/            # MongoDB schemas and models
│   ├── routes/            # API endpoint definitions
│   ├── services/          # External service integrations
│   ├── socket/            # Socket.IO real-time functionality
│   ├── uploads/           # File upload storage
│   ├── utils/             # Utility functions and helpers
│   ├── server.js          # Main server entry point
│   └── seed.js            # Database seeding script
│
├── frontend/               # React application
│   ├── public/            # Static assets and PWA files
│   ├── src/
│   │   ├── app/           # Redux store configuration
│   │   ├── assets/        # Images, icons, and media
│   │   ├── components/    # Reusable UI components
│   │   ├── config/        # App configuration and constants
│   │   ├── features/      # Redux slices and async thunks
│   │   ├── pages/         # Route components and page layouts
│   │   ├── utils/         # Frontend utility functions
│   │   ├── App.jsx        # Main app component
│   │   ├── main.jsx       # React app entry point
│   │   ├── theme.js       # Material-UI theme configuration
│   │   └── index.css      # Global styles and Tailwind
│   │
│   ├── index.html         # HTML template
│   ├── vite.config.js     # Vite build configuration
│   └── package.json       # Frontend dependencies
│
├── README.md              # Project documentation
└── package.json           # Root package.json for scripts
```

## 🔧 Available Scripts

### Root Level

```bash
npm run dev          # Start both frontend and backend
npm run frontend     # Start only frontend
npm run backend      # Start only backend
npm run seed         # Seed database with sample data
```

### Backend Scripts

```bash
npm start           # Production server
npm run dev         # Development with nodemon
npm test            # Run test suite
```

### Frontend Scripts

```bash
npm run dev         # Development server
npm run build       # Production build
npm run preview     # Preview production build
npm run lint        # ESLint code analysis
```

## 🌟 Core Features Deep Dive

### 🛒 **Product Management**

- **Multi-type Listings**: Support for sell, rent, and buy requests
- **Rich Media**: Multiple image uploads with drag-and-drop
- **Advanced Filters**: Category, condition, price range, location
- **Search Functionality**: Full-text search across titles and descriptions
- **Condition Tracking**: New, Like New, Good, Fair, Poor conditions

### 💬 **Real-time Chat System**

- **Socket.IO Integration**: Instant messaging between users
- **Chat History**: Persistent message storage
- **Typing Indicators**: Real-time typing status
- **Online Status**: User presence indicators
- **File Sharing**: Send images and documents

### 🛡️ **Security Features**

- **JWT Authentication**: Secure token-based authentication
- **Input Validation**: Comprehensive server-side validation
- **CSRF Protection**: Cross-site request forgery prevention
- **Rate Limiting**: API request throttling
- **Secure Headers**: Security-focused HTTP headers
- **Password Hashing**: Bcrypt with salt rounds

### 📊 **Admin Dashboard**

- **User Analytics**: User growth, activity metrics
- **Product Statistics**: Listing trends, category performance
- **Revenue Tracking**: Sales and rental income monitoring
- **Moderation Tools**: Content approval and user management
- **System Health**: Server status and database metrics

## 🎨 UI/UX Design Philosophy

### **Design Principles**

- **Accessibility First**: WCAG 2.1 AA compliance
- **Mobile Responsive**: Progressive enhancement for all devices
- **Performance Optimized**: Lazy loading, code splitting, caching
- **User-Centric**: Intuitive navigation and clear call-to-actions

### **Theme Customization**

- **Color Palette**: Professional gradients with accessibility considerations
- **Typography**: System fonts with optimal readability
- **Spacing**: Consistent rhythm and visual hierarchy
- **Animations**: Smooth micro-interactions and transitions

## 🔐 API Documentation

### **Authentication Endpoints**

```
POST /api/auth/register     # User registration
POST /api/auth/login        # User login
POST /api/auth/logout       # User logout
GET  /api/auth/me          # Get current user
PUT  /api/auth/profile     # Update profile
```

### **Product Endpoints**

```
GET    /api/products            # Get all products (with filters)
GET    /api/products/:id        # Get single product
POST   /api/products            # Create product (auth required)
PUT    /api/products/:id        # Update product (owner only)
DELETE /api/products/:id        # Delete product (owner/admin only)
POST   /api/products/:id/images # Upload product images
```

### **Order Endpoints**

```
GET    /api/orders              # Get user orders
GET    /api/orders/:id          # Get single order
POST   /api/orders              # Create order
PUT    /api/orders/:id/status   # Update order status
DELETE /api/orders/:id          # Cancel order
```

### **Admin Endpoints**

```
GET    /api/admin/users         # Get all users
PUT    /api/admin/users/:id     # Update user (admin only)
DELETE /api/admin/users/:id     # Delete user (admin only)
GET    /api/admin/products      # Get all products (admin view)
GET    /api/admin/orders        # Get all orders (admin view)
GET    /api/admin/dashboard     # Get dashboard statistics
```

## 🧪 Testing

### **Backend Testing**

```bash
cd backend
npm test                # Run all tests
npm run test:watch      # Watch mode
npm run test:coverage   # Coverage report
```

### **Frontend Testing**

```bash
cd frontend
npm run test           # Jest test runner
npm run test:watch     # Watch mode
npm run test:coverage  # Coverage report
```

## 🚀 Deployment

### **Backend Deployment**

1. **Environment Setup**

   ```bash
   NODE_ENV=production
   MONGODB_URI=your_production_mongodb_uri
   JWT_SECRET=your_production_jwt_secret
   PORT=5001
   ```

2. **Build and Start**
   ```bash
   npm run build    # If build process exists
   npm start        # Production server
   ```

### **Frontend Deployment**

1. **Build for Production**

   ```bash
   cd frontend
   npm run build
   ```

2. **Deploy Static Files**
   - Upload `dist/` folder to your hosting service
   - Configure routing for SPA (Single Page Application)

### **Recommended Hosting Platforms**

- **Frontend**: Vercel, Netlify, Firebase Hosting
- **Backend**: Railway, Render, DigitalOcean, AWS
- **Database**: MongoDB Atlas, AWS DocumentDB

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### **Development Workflow**

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### **Code Style**

- Follow ESLint configuration
- Use Prettier for consistent formatting
- Write meaningful commit messages
- Add tests for new features

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Material-UI Team** - For the excellent component library
- **Vite Team** - For the incredibly fast build tool
- **MongoDB** - For the flexible NoSQL database
- **Socket.IO** - For real-time communication capabilities
- **Open Source Community** - For countless libraries and inspiration

## 📞 Support

- **Documentation**: [Wiki](https://github.com/yourusername/ecomart/wiki)
- **Issues**: [GitHub Issues](https://github.com/yourusername/ecomart/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/ecomart/discussions)
- **Email**: support@ecomart.com

---

<div align="center">
  <p>Made with ❤️ by the EcoMart Team</p>
  <p>
    <a href="#-ecomart---professional-marketplace-platform">Back to Top</a>
  </p>
</div>

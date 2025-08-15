# Ecomart Backend

## Getting Started

1. Install dependencies:
   ```sh
   cd backend
   npm install
   ```
2. Copy `.env.example` to `.env` and fill in your values:
   ```sh
   cp .env.example .env
   # Edit .env as needed
   ```
3. Start MongoDB locally (or use your own connection string).
4. Start the backend server:
   ```sh
   npm run dev
   ```

## API Endpoints

- `/api/auth` — Auth routes (register, login)
- `/api/products` — Product CRUD, search, filter, pagination
- `/api/orders` — Order creation, my orders, order details
- `/api/dashboard` — User dashboard (profile, products, stats)
- `/api/users` — User profile, avatar upload
- `/api/chat` — Start chat, get messages, send message

## Real-time Chat

- Socket.io server runs on the same port as Express.
- Connect from frontend using the backend URL and `CLIENT_URL` for CORS.

## Seeding Sample Data

- (Optional) Add a script or route to seed products/users for testing.

## Verification Checklist

- Register and login
- Create a product
- Visit product detail page and click Buy Now (order created)
- Start negotiation chat with product owner and exchange messages (persisted)

---

For frontend setup, see the frontend/README.md after backend is running.

# 🔐 Admin Management Guide

## Quick Solutions

### If you accidentally delete the admin user from MongoDB:

**Option 1: Use the recovery script (Fastest)**

```bash
cd backend
node createAdmin.js
```

**Option 2: Use npm scripts**

```bash
cd backend
npm run admin:create
```

**Option 3: Use the comprehensive admin manager**

```bash
cd backend
node adminManager.js create
```

## 🛠️ Admin Management Commands

### Using npm scripts:

```bash
npm run admin:create    # Create/restore admin user
npm run admin:check     # Check admin status
npm run admin:reset     # Reset admin password
npm run admin:recreate  # Delete and recreate admin
npm run admin:help      # Show help
```

### Using direct commands:

```bash
node createAdmin.js                 # Simple admin recovery
node adminManager.js create         # Create admin if not exists
node adminManager.js recreate       # Delete and recreate admin
node adminManager.js reset          # Reset admin password
node adminManager.js check          # Check admin status
node adminManager.js delete         # Delete all admin users
node adminManager.js help           # Show help
```

## 🔑 Default Admin Credentials

- **Email**: `admin@ecomart.com`
- **Password**: `admin123`

## 📋 Common Scenarios

### 1. Lost Admin Access

```bash
cd backend
npm run admin:create
```

This will either create a new admin or reset the existing admin password.

### 2. Check if Admin Exists

```bash
cd backend
npm run admin:check
```

### 3. Reset Admin Password

```bash
cd backend
npm run admin:reset
```

### 4. Start Fresh with New Admin

```bash
cd backend
npm run admin:recreate
```

### 5. Completely Remove Admin (Be Careful!)

```bash
cd backend
node adminManager.js delete
```

## 🔒 Security Notes

1. **Always change the default password** after first login in production
2. **Keep admin credentials secure** and don't commit them to version control
3. **Use environment variables** for production admin credentials
4. **Regular backups** of your MongoDB database are recommended

## 🚨 Emergency Recovery

If you're completely locked out:

1. **Stop the backend server**
2. **Run the recovery script**: `node createAdmin.js`
3. **Start the backend server**
4. **Login with**: `admin@ecomart.com` / `admin123`
5. **Change password immediately** through the admin panel

## 📝 Environment Variables

You can customize admin credentials using environment variables in `.env`:

```env
ADMIN_EMAIL=admin@ecomart.com
ADMIN_PASSWORD=admin123
```

The scripts will use these values if available, otherwise fall back to defaults.

---

**Need help?** Run `npm run admin:help` for quick reference.

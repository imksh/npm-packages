# Node.js Prisma Backend Boilerplate

A production-ready Node.js & Express boilerplate project with best-practice architectures, modular routing, and Prisma ORM integration.

## Features

- ⚙️ **Modular Architecture:** Express application setup decoupled into `app.js` (middleware + router wiring) and `index.js` (server initialization & db connection).
- 🗄️ **Prisma ORM:** Built-in PostgreSQL datasource configuration and schema mapping for `User`, `Otp`, and `PushSubscription` models.
- 📝 **Colorized Logging:** Zero-dependency custom logger with timestamped success, warning, info, and error layouts.
- 🛡️ **Security Out-of-the-Box:** Pre-configured with Helmet headers, CORS policies, and global rate limiters (`apiLimiter`, `authLimiter`, `uploadLimiter`).
- 🔑 **Authentication & JWT:** Custom middlewares for route protection, sign-ups, and log-ins with HTTP-only cookie-based tokens.
- 📧 **SMTP Mailer & OTP:** Standard mailer transport using Gmail NodeMailer wrapper, integrated with an OTP generator and email template.
- 🖼️ **File Uploads:** Cloudinary integration utilizing Multer memory buffers for secure, single or multi-file uploads.
- 🔌 **Socket.io Setup:** Pre-installed Socket.io hooks mapping connected user sessions to active sockets.
- ✉️ **Web Push:** Push notifications integration powered by VAPID key generators and web-push subscriptions.

## Getting Started

### 1. Configure Environment Variables

Create a `.env` file in the root directory (based on `.env.example`):

```env
PORT=5001
JWT_SECRET=your_super_secret_jwt_key
DATABASE_URL=postgresql://user:password@localhost:5432/db_name

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# SMTP Settings
GMAIL_USER=your_email@gmail.com
GMAIL_PASSCODE=your_app_password

# Web Push
VAPID_SUBJECT=mailto:your_email@example.com
VAPID_PUBLIC_KEY=your_vapid_public_key
VAPID_PRIVATE_KEY=your_vapid_private_key
```

### 2. Install & Sync Schema

```bash
# Install dependencies
npm install

# Push database schema changes locally
npm run db:push

# Generate Prisma Client types
npm run db:generate

# Start development server with reload
npm run dev
```

## API Endpoints

### Auth Routes (`/api/auth`)
- `POST /signup` - Registers a new user session
- `POST /login` - Log in user and write token cookie
- `POST /logout` - Clear token session cookies
- `GET /me` - Returns logged-in user profile (requires auth)
- `PUT /me` - Edit profile info and upload avatars (requires auth)

### Upload Routes (`/api/upload`)
- `POST /` - Securely uploads image/file to Cloudinary (requires auth)

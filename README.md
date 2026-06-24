# 🛒 Snapcart

**Snapcart** is a full-stack, real-time grocery delivery platform featuring a comprehensive 3-tier architecture for Users, Admins, and Delivery Partners. Built with a focus on performance, security, and a premium user experience, it handles everything from secure online payments to real-time socket-based map tracking and AI-assisted live chat.

---

## ✨ Key Features

### 👤 User App

- **Seamless Authentication:** Secure email/password login with OTP verification, plus Google OAuth via NextAuth.
- **Smart Shopping:** Browse groceries, manage cart, and seamlessly checkout.
- **Flexible Payments:** Choose between Cash on Delivery (COD) or secure online payments via **Stripe**.
- **Live Order Tracking:** Real-time map tracking of the assigned delivery partner using **Socket.io** and **Leaflet**.
- **Smart Live Chat:** Communicate directly with the delivery partner via real-time chat, featuring **AI-suggested quick replies**.
- **Secure Handover:** Receive a unique OTP via email upon delivery arrival to securely claim the order.

### 🛡️ Admin Dashboard

- **Inventory Management:** Add, edit, and view grocery items.
- **Order Management:** Monitor all active and past orders, and assign delivery partners.
- **Revenue Analytics:** Comprehensive dashboard tracking daily earnings and total revenue.

### 🛵 Delivery Partner Portal

- **Live Navigation:** View customer delivery locations on an interactive map.
- **Order Status:** Accept orders and update statuses in real-time.
- **Secure Delivery:** Prompt the customer for their email OTP to mark the order as "Delivered."
- **Earnings Dashboard:** Track completed deliveries and total earnings.

### ⚙️ Core Technical Features

- **Real-Time Engine:** Socket.io handles live location polling and instant messaging.
- **AI Integration:** Context-aware smart replies in the chat box powered by Google Gemini.
- **Robust Security:** JWT-based sessions, Bcrypt password hashing, and secure password recovery (Forgot/Reset Password) via Nodemailer.
- **Premium UI/UX:** Fully responsive, highly polished interfaces featuring smooth page transitions and micro-interactions powered by **Framer Motion**.

---

## 🛠️ Tech Stack

**Frontend:**
- Next.js (App Router)
- React 18
- TypeScript
- Tailwind CSS
- Framer Motion (Animations)
- Redux Toolkit (State Management)
- React-Leaflet (Maps)
- Lucide React / React Icons

**Backend:**
- Next.js API Routes (Serverless Functions)
- Node.js
- Socket.io (Real-time WebSocket communication)

**Database & Storage:**
- MongoDB & Mongoose
- Cloudinary / AWS S3 (Image hosting)

**Third-Party Integrations:**
- **Stripe** — Payment Gateway
- **NextAuth.js** — Authentication
- **Nodemailer** — Transactional Emails & OTPs
- **Google Gemini API** — AI Chat Suggestions
- **OpenStreetMap / Nominatim** — Geocoding & Reverse Geocoding

---

## 🚀 Installation & Setup

Follow these steps to run Snapcart locally on your machine.

### 1. Clone the repository

```bash
git clone https://github.com/SayanIndra83/snapcart.git
cd snapcart
```

### 2. Install dependencies

```bash
npm install
# or
yarn install
```

### 3. Setup Environment Variables

Create a `.env` or `.env.local` file in the root directory and add the following keys:

```env
# Database
MONGODB_URI=your_mongodb_connection_string

# Authentication (NextAuth)
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Stripe Payments
STRIPE_SECRET_KEY=your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key

# Nodemailer (Email/OTP)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# AI Chat Suggestions
GEMINI_API_KEY=your_gemini_api_key
```

### 4. Run the Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

> **Note:** For the Socket.io server to function properly locally, ensure your custom socket server script is running alongside the Next.js app.

---

## 👨‍💻 Developer

Designed and engineered by **Sayan Indra**

Full-Stack Developer | Electrical Engineering, Jadavpur University

- GitHub: [@SayanIndra83](https://github.com/SayanIndra83)
- LinkedIn: [Sayan Indra](https://www.linkedin.com/in/sayan-indra-a41319369/)

---

## 📄 License

This project is licensed under the [MIT License](./LICENSE).

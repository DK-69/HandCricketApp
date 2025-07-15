// index.js
import express from 'express';
import mongoose from 'mongoose';
import http from 'http';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

import authRoutes from './routes/authRoutes.js';
import { checkUser, requireAuth } from './middleware/addMiddleware.js';
import { setupSocket } from './socketHandler.js';

dotenv.config();

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 8000;
const MONGO_URI = process.env.MONGO_URI;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ MongoDB connection
mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

// ✅ Middleware

// Manual CORS headers to allow all origins + cookies
app.use((req, res, next) => {
  const origin = req.headers.origin;
  res.setHeader('Access-Control-Allow-Origin', origin || '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.sendStatus(200); // preflight
  next();
});

app.use(cors({
  origin: true,             // Allow any origin (with credentials)
  credentials: true         // Allow cookies
}));

app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// ✅ Routes
app.use(authRoutes);

// Auth check route
app.get('/checkUser', checkUser, (req, res) => {
  res.json({ user: res.locals.user });
});

// Home route — protected
app.get('/', requireAuth, (req, res) => {
  res.redirect(process.env.CLIENT_URL || 'http://localhost:5173');
});

// Logout
app.get('/logout', (req, res) => {
  res.clearCookie('jwt', {
    httpOnly: true,
    sameSite: 'none',
    secure: true
  });
  res.status(200).json({ message: 'Logged out' });
});

// ✅ Socket.io setup
setupSocket(server);

// ✅ Start server
server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

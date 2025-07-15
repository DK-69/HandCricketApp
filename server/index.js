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
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';
const MONGO_URI = process.env.MONGO_URI;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

// ✅ Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: CLIENT_URL,
  credentials: true,
}));
app.use(express.static(path.join(__dirname, 'public')));

// ✅ Routes
app.use(authRoutes);

app.get('/checkUser', checkUser, (req, res) => {
  res.json({ user: res.locals.user });
});

app.get('/', requireAuth, (req, res) => {
  res.redirect(CLIENT_URL);
});

app.get('/logout', (req, res) => {
  res.clearCookie('jwt');
  res.status(200).json({ message: 'Logged out' });
});

// ✅ Sockets
setupSocket(server);

// ✅ Start server
server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

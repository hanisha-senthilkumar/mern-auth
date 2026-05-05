import express from 'express';
import cors from 'cors';
import 'dotenv/config.js';
import cookieParser from 'cookie-parser';
import helmet from "helmet";
import connectDB from './config/mongodb.js';
import authRouter from './routes/authRoutes.js';
import userRouter from './routes/userRoutes.js';

const app = express();
const port = process.env.PORT || 4000;

connectDB();

const allowedOrigins = ['http://localhost:5173', 'http://127.0.0.1:5173'];

// ✅ CORS
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

// Request Logger
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// ✅ DISABLE CSP (DEV ONLY 🔥)
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cookieParser());

// Test route
app.get('/', (req, res) => {
  res.send('API Working !');
});

// Routes
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);

import fs from 'fs';
import path from 'path';

import util from 'util';

const logStream = fs.createWriteStream(path.join(process.cwd(), 'server.log'), { flags: 'a' });
const log = (...args) => {
  const message = util.format(...args);
  const msg = `${new Date().toISOString()} - ${message}\n`;
  process.stdout.write(msg);
  logStream.write(msg);
};

console.log = log;
console.error = log;

process.on('uncaughtException', (err) => {
  log(`Uncaught Exception: ${err.message}`);
  log(err.stack);
});

process.on('unhandledRejection', (reason, promise) => {
  log(`Unhandled Rejection at: ${promise}, reason: ${reason}`);
});

app.listen(port, () =>
  log(`Server running on port: ${port}`)
);

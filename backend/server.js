import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import contentRoutes from './routes/contentRoutes.js';
import quizRoutes from './routes/quizRoutes.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Allow cookies and requests only from your frontend (port 8080)
app.use(
  cors({
    origin: 'http://localhost:8080', // 👈 your frontend origin
    credentials: true,               // ✅ allows cookies in cross-origin requests
  })
);

// ✅ Middleware
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());

// ✅ Connect DB
await connectDB();

// ✅ Routes
app.use('/api/auth', authRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/quiz', quizRoutes);

// ✅ Test route
app.get('/', (req, res) => {
  res.json({ ok: true, message: 'Backend connected!' });
});

// ✅ Start server
app.listen(PORT, () => console.log(`✅ Server running at http://localhost:${PORT}`));

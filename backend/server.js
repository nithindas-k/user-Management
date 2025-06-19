import express from 'express';
import dotenv from 'dotenv';
import adminRoutes from './Routes/adminRoutes.js';
import userRoutes from './Routes/userRoutes.js';
import { connectDB } from './config/db.js';
import cors from 'cors';
import cookieParser from 'cookie-parser'
import { logout } from './controller/auth.js';


const app = express();
app.use(cookieParser());

dotenv.config();

app.use('/uploads', express.static('uploads'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

await connectDB();

app.get('/', (req, res) => {
  res.send("👋 Hello from the server!");
});
app.get("/api/logout", logout)
app.use('/api/admin', adminRoutes);
app.use('/api', userRoutes);

const PORT = process.env.PORT || 3005;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});

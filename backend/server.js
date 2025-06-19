import express from 'express';
import dotenv from 'dotenv';
import adminRoutes from './Routes/adminRoutes.js';
import userRoutes from './Routes/userRoutes.js';
import { connectDB } from './config/db.js';
import cors from 'cors';
import cookieParser from 'cookie-parser' 
import jwt from 'jsonwebtoken';


const app = express();
app.use(cookieParser());

dotenv.config();


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

await connectDB();
app.get('/api/refresh',(req,res)=>{
const JWT_SECRET = process.env.JWT_SECRET_2

  const token = req.cookies.refreshToken;
  const payLoad = jwt.verify(token, JWT_SECRET);
  const token1 = jwt.sign(
        payLoad,
        process.env.JWT_SECRET || "yoursecretkey",
        { expiresIn: "7d" }
      );
       res.cookie('accessToken', token1, {
      httpOnly: true,
      secure: false,
      maxAge: 2000,
      sameSite: 'Lax', // Or 'None' + secure: true for cross-origin
    });

})
app.get('/', (req, res) => {
  res.send("👋 Hello from the server!");
});

app.use('/api/admin', adminRoutes);
app.use('/api', userRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});

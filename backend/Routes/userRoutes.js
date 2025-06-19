import express from 'express';
import { register, verifyToken, login } from '../controller/userController.js';
import { updateUser } from '../controller/adminController.js';
import upload from '../middleware/upload.js';
import { decodeTokenMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/verify-token', verifyToken);
router.put('/user/profile', decodeTokenMiddleware, upload.single('avatar'), updateUser);


export default router;

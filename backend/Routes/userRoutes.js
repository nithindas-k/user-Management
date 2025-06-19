import express from 'express';
import { register, verifyToken, login } from '../controller/userController.js';
import { updateUser, logoutUser } from '../controller/adminController.js';
import upload from '../middleware/upload.js';
import { decodeTokenMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/verify-token', verifyToken);

router.put('/user/profile', decodeTokenMiddleware, upload.single('avatar'), updateUser);

router.post('/logout', logoutUser);

export default router;

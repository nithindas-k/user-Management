import express from 'express';
import { register, verifyToken, login, getUserById, getAllUsers,updateUserProfile } from '../controller/userController.js';
import { updateUser, logoutUser } from '../controller/adminController.js';
import upload from '../middleware/upload.js';


const router = express.Router();

router.post('/register', register);
router.post('/login', login);

router.post('/verify-token', verifyToken);


router.get('/user/:id', getUserById);
router.get('/', getAllUsers);

router.put('/user/profile/:id',upload.single('avatar'),updateUser);

router.post('/logout', logoutUser);

export default router;

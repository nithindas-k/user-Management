import express from 'express';
import { register, verifyToken, login, getUserById, getAllUsers } from '../controller/userController.js';
import { updateUser } from '../controller/adminController.js';


const router = express.Router();

router.post('/register', register);
router.post('/login', login); 

router.post('/verify-token', verifyToken); 


router.get('/user/:id', getUserById);
router.get('/', getAllUsers); 
router.put('/user/profile/:id',updateUser)

export default router;

import express from 'express';
import { registerUser, loginUser } from '../controllers/user.controllers.js';
import { isAuthenticated } from '../middlewares/authMiddleware.js';
import { getUser } from '../controllers/user.controllers.js';
const userRouter = express.Router();

userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)
userRouter.get('/me', isAuthenticated, getUser)
export default userRouter;
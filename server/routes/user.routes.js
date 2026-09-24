import express from 'express';
import { registerUser, loginUser, getUserProfile, followUser, unFollowUser, testUpload } from '../controllers/user.controllers.js';
import { isAuthenticated } from '../middlewares/authMiddleware.js';
import upload from '../middlewares/upload.middleware.js';
import { getUser } from '../controllers/user.controllers.js';
const userRouter = express.Router();

userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)
userRouter.get('/me', isAuthenticated, getUser)
userRouter.get('/profile/:username', isAuthenticated, getUserProfile)
userRouter.post('/follow/:id', isAuthenticated, followUser)
userRouter.post('/unfollow/:id', isAuthenticated, unFollowUser)
userRouter.post('/testUpload', upload.single('profileImage'), testUpload)
export default userRouter;
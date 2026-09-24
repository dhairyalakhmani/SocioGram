import express from 'express';
import { registerUser, loginUser, getUserProfile, followUser, unFollowUser, updateProfile } from '../controllers/user.controllers.js';
import { isAuthenticated } from '../middlewares/authMiddleware.js';
import upload from '../middlewares/upload.middleware.js';
import { getUser } from '../controllers/user.controllers.js';
const userRouter = express.Router();

// Multer rejects bad files by calling next(err); without this the client gets Express's HTML 500 page
const uploadProfileImage = (req, res, next) => {
    upload.single('profileImage')(req, res, (error) => {
        if (error) return res.status(400).json({ message: error.message });
        next();
    });
}

userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)
userRouter.get('/me', isAuthenticated, getUser)
userRouter.get('/profile/:username', isAuthenticated, getUserProfile)
userRouter.post('/follow/:id', isAuthenticated, followUser)
userRouter.post('/unfollow/:id', isAuthenticated, unFollowUser)
// userRouter.post('/testUpload', upload.single('profileImage'), testUpload)
userRouter.post('/updateProfile', isAuthenticated, uploadProfileImage, updateProfile)
export default userRouter;
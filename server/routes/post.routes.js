import express from 'express';
import { isAuthenticated } from '../middlewares/authMiddleware.js';

postRouter = express.Router();
postRouter.post('/createPost', isAuthenticated, upload.single('image'), createPost)
export default postRouter;
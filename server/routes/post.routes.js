import express from 'express';
import { isAuthenticated } from '../middlewares/authMiddleware.js';

import upload from '../middlewares/upload.middleware.js';
import { createPost } from '../controllers/post.controllers.js';

const postRouter = express.Router();
postRouter.post('/createPost', isAuthenticated, upload.single('image'), createPost)
export default postRouter;
import express from 'express';
import { isAuthenticated } from '../middlewares/authMiddleware.js';
import uploadReel from '../middlewares/uploadReel.middleware.js';
import { createReel } from '../controllers/reel.controllers.js';
const reelRouter = express.Router();

reelRouter.post('/createReel', isAuthenticated, uploadReel.single('video'), createReel)
export default reelRouter;
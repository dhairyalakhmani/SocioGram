import jwt from 'jsonwebtoken';
import userModel from '../models/user.model.js';

export const isAuthenticated = async (req, res, next) => {
    const token = req.cookies.SGAT;
    if(!token) res.status(401).json({message: "Not authorized"});
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(decoded.userId);
    if(!user) res.status(404).json({message: "User not found."})
    req.user = user;
    
}
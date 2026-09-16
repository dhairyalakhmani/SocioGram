import jwt from 'jsonwebtoken';
import userModel from '../models/user.model.js';

export const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.cookies.SGAT;
        if (!token) return res.status(401).json({ message: "Not authorized" });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded.userId).select('-password');
        if (!user) return res.status(404).json({ message: "User not found." });

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Not authorized.", error: error.message });
    }
}

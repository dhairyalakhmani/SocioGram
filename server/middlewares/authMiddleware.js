import jwt from 'jsonwebtoken';
import userModel from '../models/user.model.js';

export const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.cookies?.SGAT;
        if (!token) return res.status(401).json({ message: "Not authorized" });

        let decoded;
        // Only a failed jwt.verify is an auth problem. A database fault below
        // is a server error, so it must not be reported as a 401.
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (error) {
            return res.status(401).json({ message: "Invalid or expired authentication token." });
        }

        const user = await userModel.findById(decoded.userId).select('-password');
        if (!user) return res.status(404).json({ message: "User not found." });

        req.user = user;
        next();
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error.", error: error.message });
    }
}

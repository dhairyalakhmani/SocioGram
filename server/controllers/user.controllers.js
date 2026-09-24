import userModel from "../models/user.model.js";
import bcrypt from 'bcrypt';
import { genToken } from "../utils/generateToken.js";

const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 2 * 24 * 60 * 60 * 1000
}

export const registerUser = async (req, res) => {
    try {
        const { name, email, password, username } = req.body;
        if (!name || !username || !password || !email) {
            return res.status(400).json({ message: "All fields are mandatory." })
        }
        if (password.length < 8) {
            return res.status(400).json({ message: "Password must be atleast 8 characters long." })
        }
        const userNameExists = await userModel.findOne({ username });
        if (userNameExists) return res.status(409).json({ message: "Username already taken." });
        const emailExists = await userModel.findOne({ email });
        if (emailExists) return res.status(409).json({ message: "Account with this email already exists." });
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = await userModel.create({
            name, username, email, password: hashedPassword
        })
        const token = genToken(newUser._id);
        res.cookie("SGAT", token, cookieOptions);

        const userData = newUser.toObject();
        delete userData.password;

        return res.status(201).json({ message: "User registered successfully.", userData });
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error.", error: error.message });
    }
}

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ message: "Email and password are mandatory." })

        const user = await userModel.findOne({ email })
        if (!user) return res.status(404).json({ message: "User not found." })

        const passwordCheck = await bcrypt.compare(password, user.password);
        if (!passwordCheck) return res.status(400).json({ message: "Incorrect Password Entered." })

        const token = genToken(user._id);
        res.cookie("SGAT", token, cookieOptions);

        const userData = user.toObject();
        delete userData.password;

        return res.status(200).json({ message: "Logged in successfully.", userData })
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error.", error: error.message });
    }
}

export const getUser = async (req, res) => {
    return res.status(200).json({ message: "User authenticated.", userData: req.user })
}

export const getUserProfile = async (req, res) => {
    try {
        const { username } = req.params;
        const user = await userModel.findOne({ username }).select('-password');
        if (!user) return res.status(404).json({ message: "User does not exist." })
        return res.status(200).json({ message: "User found.", profileData: user })
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error.", error: error.message });
    }
}

export const followUser = async (req, res) => {
    try {
        const currentUserId = req.user._id.toString();
        const targetUserId = req.params.id;

        if (currentUserId === targetUserId) {
            return res.status(409).json({ message: "You cannot follow yourself." })
        }

        const targetUser = await userModel.findById(targetUserId);
        if (!targetUser) return res.status(404).json({ message: "User not found." })

        const alreadyFollowing = targetUser.followers.some((id) => id.toString() === currentUserId);
        if (alreadyFollowing) return res.status(409).json({ message: "You already follow this user." })

        await userModel.findByIdAndUpdate(currentUserId, {
            $addToSet: { following: targetUserId }
        })
        await userModel.findByIdAndUpdate(targetUserId, {
            $addToSet: { followers: currentUserId }
        })

        return res.status(201).json({ message: "User followed." })
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error.", error: error.message });
    }
}

export const unFollowUser = async (req, res) => {
    try {
        const currentUserId = req.user._id.toString();
        const targetUserId = req.params.id;

        if (currentUserId === targetUserId) {
            return res.status(409).json({ message: "You cannot unfollow yourself." })
        }

        const targetUser = await userModel.findById(targetUserId);
        if (!targetUser) return res.status(404).json({ message: "User not found." })

        const alreadyFollowing = targetUser.followers.some((id) => id.toString() === currentUserId);
        if (!alreadyFollowing) return res.status(409).json({ message: "You do not follow this user." })

        await userModel.findByIdAndUpdate(currentUserId, {
            $pull: { following: targetUserId }
        })
        await userModel.findByIdAndUpdate(targetUserId, {
            $pull: { followers: currentUserId }
        })

        return res.status(200).json({ message: "User unfollowed." })
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error.", error: error.message });
    }
}

export const testUpload = async (req, res) => {
    try {
        res.send(req.file)
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error.", error: error.message });
    }
}

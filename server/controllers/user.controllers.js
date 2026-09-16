import userModel from "../models/user.model.js";
import bcrypt from 'bcrypt';
import { genToken } from "../utils/generateToken.js";

const cookieOptions = {
    httpOnly: true,
    secure: true
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

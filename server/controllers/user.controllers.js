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
            res.status(400).json({ message: "All fields are mandatory." })
        }
        if (password.length < 8) {
            res.status(400).json({ message: "Password must be atleast 8 characters long." })
        }
        const userNameExists = await userModel.findOne({ username });
        if (userNameExists) res.status(409).json("Username already taken.");
        const emailExists = await userModel.findOne({ email });
        if (emailExists) res.status(409).json("Account with this email already exists.");
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = await userModel.create({
            name, username, email, password: hashedPassword
        })
        const token = genToken(newUser._id);
        res.cookie("SGAT", token, cookieOptions);
        res.status(201).json({ message: "User registered successfully.", user: newUser });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error.", error: error});
    }
}

export const loginUser = async (req, res) => {
    try{
        const {email, password} = req.body;
        const user = await userModel.findOne({email})
        if(!user) return res.status(404).json({message: "User not found."})
        if(!email) return res.status(404).json({message: "User with this email does not exist."})
        const passwordCheck = await bcrypt.compare(password, user.password);
        if(!passwordCheck) res.status(400).json({message: "Incorrect Password Entered."})
        const token = genToken(user._id);
        res.cookie("SGAT", token, cookieOptions);
        res.status(200).json({message: "Logged in successfully."})
    } catch(error){
        res.status(500).json({ message: "Internal Server Error.", error: error});
    }
}

export const getUser = async (req, res) => {
    res.status(200).json({message: "User authenticated.", })
}
import userModel from "../models/user.model.js";
import bcrypt from 'bcrypt';
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
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = await userModel.create({
            name, username, email, password: hashedPassword
        })
        res.status(201).json({ message: "User registered successfully.", user: newUser });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error.", error: error});
    }
}
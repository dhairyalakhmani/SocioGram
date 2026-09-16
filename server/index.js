import dns from 'node:dns';
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import userRouter from './routes/user.routes.js';
dotenv.config()

    if (dns.getServers().includes('127.0.0.1')) {
        dns.setServers(['8.8.8.8', '1.1.1.1']);
    }

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))
app.use(express.json())
app.use(cookieParser());

app.get('/', (req, res) => {
    res.send("Hello from the server");
})
app.use('/users', userRouter)

const dbURL = process.env.MONGODB_URL;

mongoose.connect(dbURL).then(() => {
    console.log("DB connected")
    app.listen(PORT, () => (
        console.log("Server listening at port ", PORT)
    ))
}).catch((error) => {
    console.log("Failed due to the error: ", error)
})

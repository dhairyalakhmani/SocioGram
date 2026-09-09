import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String, 
        required: true,
        unique: true
    },
    email: {
        type: String, 
        required: true,
        unique: true
    },
    password: {
        type: String, 
        required: true,
    },
    profileImage: {
        type: String
    },
    followers: [],
    following: [],
    posts: [],
    stories: [],
    reels: []
}, {timestamps: true})

const userModel = mongoose.model('User', userSchema);
export default userModel;
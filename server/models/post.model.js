import mongoose, { Mongoose } from 'mongoose';

const postSchema = mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "userModel",
        required: true
    },
    caption: {
        type: String,
        maxLength: 500
    },
    image: {
        type: String
    }
}, {timestamps: true})

const postModel = mongoose.model('User', postSchema);
export default postModel;
import uploadToCloudinary from "../utils/uploadCloudinary.js";
import postModel from "../models/post.model.js";
import userModel from "../models/user.model.js";

export const createPost = async (req, res) => {
    try{
        const userId = req.user._id;
        if(!userId) return res.status(404).json({message: "User not found."})
        const {caption} = req.body;
        if(caption?.length > 500) return res.status(400).json({message: "Caption should be max 500 characters long"})
        let image;
        if(req.file){
            const uploadedImage = await uploadToCloudinary(req.file.buffer);
            image = uploadedImage.secure_url;
        }

       const postCreated = await postModel.create({
            author: req.user._id,
            image: image, 
            caption: caption?.trim() || ''
        })

        await userModel.findByIdAndUpdate(userId, {$push: {posts: postCreated._id}});
        const populatedPost = await postModel.findById(postCreated._id).populate('author', "name username profileImage")
        res.status(201).json({message: "Post Created.", post: populatedPost})
    } catch(error) {
        res.status(500).json({message: "Internal server error.", error: error})
    }
}
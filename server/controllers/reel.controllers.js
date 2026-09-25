import uploadVideoToCloudinary from "../utils/uploadVideoCloudinary.js";
import userModel from "../models/user.model.js";
import reelModel from "../models/reel.model.js";

export const createReel = async (req, res) => {
    try{
        const userId = req.user._id;
        if(!userId) return res.status(404).json({message: "User not found."})
        const {caption} = req.body;
        if(caption?.length > 500) return res.status(400).json({message: "Caption should be max 500 characters long"})
        let video;
        if(req.file){
            const uploadedVideo = await uploadVideoToCloudinary(req.file.buffer);
            video = uploadedVideo.secure_url;
        }

       const reelCreated = await reelModel.create({
            author: req.user._id,
            video: video, 
            caption: caption?.trim() || ''
        })

        await userModel.findByIdAndUpdate(userId, {$push: {reels: reelCreated._id}});
        const populatedReel = await reelModel.findById(reelCreated._id).populate('author', "name username profileImage")
        res.status(201).json({message: "Reel Created.", reel: populatedReel})
    } catch(error) {
        res.status(500).json({message: "Internal server error.", error: error})
    }
}
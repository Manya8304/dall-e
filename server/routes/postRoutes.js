//creating this file to actually upload the image and the prompt in the post itself to our AI image sharing social media platform

import express from 'express';
import * as dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';
import Post from '../mongodb/models/post.js';

dotenv.config(); //to ensure that our environment variables are indeed getting populated

const router = express.Router();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// "get" route to get all the posts
router.route('/').get(async (req, res) => {
    try {
        const posts = await Post.find({});

        res.status(200).json({ success: true, data: posts});
    } catch(error) {
        res.status(500).json({ success: false, message: error});
    }
});

//create a post route
router.route('/').post(async (req, res) => {
   try {
     //firstly we need to get all of the data that we are sending from frontend
     const { name, prompt, photo } = req.body;
     //then we need to upload the photo URL to cloudinary
     const photoUrl = await cloudinary.uploader.upload(photo);
     //here, we are getting "photo" from frontend and then we get the optimized "photoUrl" from cloudinary
 
     //these four lines are going to create new post in our database.
     const newPost = await Post.create({
         name, prompt, photo: photoUrl.url,
     });
     res.status(200).json({ success: true, data: newPost});
   } catch(error) {
    res.status(500).json({ success: false, message: error });
   }
});

export default router;
import express from 'express';
import * as dotenv from 'dotenv';
import { OpenAI } from 'openai';

dotenv.config(); //to ensure that our environment variables are indeed getting populated

const router = express.Router();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

router.route('/').get((req, res) => {
    res.status(200).json({message: 'Hello From DALL-E!'});
});

router.route('/').post(async (req, res) => {
    try {
        const { prompt } = req.body; //this prompt is going to come from frontend side, from create post page's "surprise me" prompt
        const aiResponse = await openai.images.generate({
            prompt,
            n: 1, //meaning one image
            size: '1024x1024',
            response_format: 'b64_json',
        });
        //now as we need to extract image from aiResponse
        const image = aiResponse.data[0].b64_json;
        //here, we are sending the extracted image back to the frontend
        res.status(200).json({ photo: image });
    } catch(error) {
        console.log(error);
        res.status(500).send(error?.response.data.error.message || 'Something went wrong');
    }
})

export default router;
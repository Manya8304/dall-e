import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './mongodb/connect.js';
import postRoutes from './routes/postRoutes.js';
import dalleRoutes from './routes/dalleRoutes.js';

dotenv.config(); //setting dotenv
//the above line allows us to pull our environment varibles from our dotenv file

//initialising express application
const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' })); //additional middleware

app.use('/api/v1/post', postRoutes);
app.use('/api/v1/dalle', dalleRoutes);
//So, here basically we have created API endpoints, that we can connect/hook onto from our frontend side!

//routes
app.get('/', async (req, res) => {
    res.status(200).json({
        message: 'Hello from DALL.E!',
      });
})

const startServer = async () => {
    try {
        connectDB(process.env.MONGODB_URL);
        app.listen(8080, () => console.log('Server has started on port http://localhost:8080'));
    } catch(error) {
        console.log(error);
    }
};

startServer();
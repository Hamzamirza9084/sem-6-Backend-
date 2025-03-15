import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
dotenv.config()
import { UserRouter } from './routes/user.js'
import cookieParser from 'cookie-parser'

const app = express()

app.use(express.json())

const corsOptions = {
    origin: ['http://localhost:5173', 'https://gregarious-fudge-8d4f5d.netlify.app'], 
    methods: ['GET', 'POST', 'PUT', 'DELETE'], 
    credentials: true, 
};

app.use(cors(corsOptions));
app.use(cookieParser())
app.use('/auth',UserRouter)

mongoose
    .connect(process.env.MURL{
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("MongoDB connection error:", err));

app.get("/", (req, res) => {
    res.json("Hello");
});

app.listen(process.env.PORT,()=>{
    console.log("server is running")
})

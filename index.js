import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
dotenv.config()
import { UserRouter } from './routes/user.js'
import cookieParser from 'cookie-parser'
import session from 'express-session';
import MongoStore from 'connect-mongo';




const app = express()

app.use(express.json())


const corsOptions = {
    origin: ['http://localhost:5173','https://frolicking-marigold-49ce1d.netlify.app'], 
    methods: ['GET', 'POST', 'PUT', 'DELETE'], 
    credentials: true, 
};

app.use(session({
    secret: process.env.SESSION_SECRET || 'yoursecretkey',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MURL }), // Optional: store in MongoDB
    cookie: {
      maxAge: 3600000, // 1 hour
      secure: process.env.NODE_ENV === 'production', // Use HTTPS in production
      httpOnly: true
    }
  }));

app.use(cors(corsOptions));
app.use(cookieParser())
app.use('/auth',UserRouter)

mongoose
    .connect(process.env.MURL,{
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("MongoDB connection error:", err));

app.get("/", (req, res) => {
    res.json("Hellos");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

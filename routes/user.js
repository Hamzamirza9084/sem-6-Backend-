import express, { Router } from 'express';
import bcrypt from 'bcrypt';
const router =express.Router();
import { User } from '../modles/User.js';
import { Admin } from '../modles/Admin.js';
import { HOD } from '../modles/HOD.js';
import { Faculty } from '../modles/Faculty.js';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import { Principal } from '../modles/Principal.js';
import { Contactus } from '../modles/Contactus.js';
import { ProfessorAttendance } from '../modles/ProfessorAttendance.js';
import axios from 'axios';
import mongoose from "mongoose";


router.post('/signuph', async(req,res)=>{
    const{linkid,name,email,password} =req.body;
    const user=await HOD.findOne({email})
    if(user)
    {
        return res.json({message:"user already existed"})
    }

     try{
        const hashpassword = await bcrypt.hash(password,10)
        const newUser =new HOD({
          linkid,
          name,
          email,
          password: hashpassword,
      })
      await newUser.save()
    }
    catch(err)
      {
        console.error("Error hashing password:", err);
        return res.status(500).json({ message: "Server error while hashing password" });
      }

    return res.json({status:true ,message :"record registed"})
    
})

router.post('/signupf', async(req,res)=>{
  const{linkid,name,email,password} =req.body;
  const user=await Faculty.findOne({email})
  if(user)
  {
      return res.json({message:"user already existed"})
  }

   try{
      const hashpassword = await bcrypt.hash(password,10)
      const newUser =new Faculty({
        linkid,
        name,
        email,
        password: hashpassword,
    })
    await newUser.save()
  }
  catch(err)
    {
      console.error("Error hashing password:", err);
      return res.status(500).json({ message: "Server error while hashing password" });
    }

  return res.json({status:true ,message :"record registed"})
  
})

router.post('/signup', async(req,res)=>{
  const{linkid,name,email,password} =req.body;
  const user=await User.findOne({email})
  if(user)
  {
      return res.json({message:"user already existed"})
  }

   try{
      const hashpassword = await bcrypt.hash(password,10)
      const newUser =new User({
        linkid,
        name,
        email,
        password: hashpassword,
    })
    await newUser.save()
  }
  catch(err)
    {
      console.error("Error hashing password:", err);
      return res.status(500).json({ message: "Server error while hashing password" });
    }

  return res.json({status:true ,message :"record registed"})
  
})

router.post('/login/student', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
      return res.json({ message: "Student is not registered" });
  }

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
      return res.json({ message: "password is incorrect" });
  }

  const token = jwt.sign({ id: user._id, role: "Student" }, process.env.KEY, { expiresIn: '1h' });
  res.cookie('token', token, { httpOnly: true, maxAge: 10800000 });
  return res.json({ status: true, message: "Student logged in successfully" });
});

router.post('/login/faculty', async (req, res) => {
  const { email, password } = req.body;
  const faculty = await Faculty.findOne({ email });
  if (!faculty) {
      return res.json({ message: "Faculty is not registered" });
  }

  const validPassword = await bcrypt.compare(password, faculty.password);
  if (!validPassword) {
      return res.json({ message: "password is incorrect" });
  }

  const token = jwt.sign({ id: faculty._id, role: "Faculty" }, process.env.KEY, { expiresIn: '1h' });
  res.cookie('token', token, { httpOnly: true, maxAge: 10800000 });
  return res.json({ status: true, message: "Faculty logged in successfully" });
});

router.post('/login/hod', async (req, res) => {
  const { email, password } = req.body;
  const hod = await HOD.findOne({ email });
  if (!hod) {
      return res.json({ message: "HOD is not registered" });
  }

  const validPassword = await bcrypt.compare(password, hod.password);
  if (!validPassword) {
      return res.json({ message: "password is incorrect" });
  }

  const token = jwt.sign({ id: hod._id, role: "HOD" }, process.env.KEY, { expiresIn: '1h' });
  res.cookie('token', token, { httpOnly: true, maxAge: 10800000 });
  return res.json({ status: true, message: "HOD logged in successfully" });
});

router.post('/login/principal', async (req, res) => {
  const { email, password } = req.body;
  const principal = await Principal.findOne({ email });
  if (!principal) {
      return res.json({ message: "Principal is not registered" });
  }

  const validPassword = await bcrypt.compare(password, principal.password);
  if (!validPassword) {
      return res.json({ message: "password is incorrect" });
  }

  const token = jwt.sign({ id: principal._id, role: "Principal" }, process.env.KEY, { expiresIn: '1h' });
  res.cookie('token', token, { httpOnly: true, maxAge: 10800000 });
  return res.json({ status: true, message: "Principal logged in successfully" });
});


router.post('/login', async(req,res)=>{
    const {email,password} =req.body;
    const user =await User.findOne({email});
    if(!user)
    {
        return res.json({message:"user is not registered"})
    }

    const vaildPassword = await bcrypt.compare(password, user.password)
    if(!vaildPassword)
    {
        return res.json({message:"password is incorrect"})
    }

    const token = jwt.sign({name: user.name,email:user.email},process.env.KEY,{expiresIn: '1h'})
    res.cookie('token',token,{httpOnly:true,maxAge:10800000})
    return res.json({status:true,message:"login successfully"})
})

router.post('/forget',async (req,res)=>{
    const {email} =req.body;
    try
    {
        const user = await User.findOne({email})
        if(!user)
        {
            return res.json({message:"user not registered"})
        }

        const token=jwt.sign({ id: user._id}, process.env.KEY, { expiresIn: '5m' })
        
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: 'hamzamirzaop786@gmail.com',
              pass: 'nhaj ddyh frgh iitj'
            }
          });
          
          var mailOptions = {
            from: 'hamzamirzaop786@gmail.com',
            to: email,
            subject: 'Reset Password',
            text: `http://localhost:5173/reset/${token}`
          };
          
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              return res.json({message:"error sending email"})
            } else {
              return res.json({status:true ,message:"email sent"+ info.response})
            }
          });
    }
    catch(err)
    {
        console.log(err)
    }
})

router.post('/reset/:token',async (req,res)=>{
  const {token} = req.params;
  const {password} =req.body
  try{
    const decoded =await jwt.verify(token,process.env.KEY);
    const id=decoded.id;
    const hashpassword=await bcrypt.hash(password,10)
    await User.findByIdAndUpdate({_id:id},{password:hashpassword})
    return res.json({status:true ,message:"Update Password"})
  }
  catch (err) {
    return res.json("invaild token ")
  }
})

const verifyUser = (role) => {
  return async (req, res, next) => {
    try {
      const token = req.cookies.token;
      if (!token) {
        return res.status(401).json({ status: false, message: "No token provided" });
      }
      const decoded = jwt.verify(token, process.env.KEY);

      let user;
      if (role === "User") user = await User.findById(decoded.id);
      else if (role === "Faculty") user = await Faculty.findById(decoded.id);
      else if (role === "HOD") user = await HOD.findById(decoded.id);

      if (!user) {
        return res.status(403).json({ status: false, message: "Unauthorized access" });
      }

      req.user = user;
      next();
    } catch (err) {
      return res.status(401).json({ status: false, message: "Invalid token" });
    }
  };
};



// router.get('/verify',verifyUser,(req,res)=>{
//   const userEmail = req.user.email;
//     return res.json({status:true ,message:"authorized",email:userEmail})
// })


router.get('/user/verify', verifyUser("User"), (req, res) => res.json({ status: true, message: "Authorized", email: req.user.email }));


router.get('/faculty/verify', verifyUser("Faculty"), (req, res) => res.json({ status: true, message: "Authorized", email: req.user.email }));


router.get('/hod/verify', verifyUser("HOD"), (req, res) => res.json({ status: true, message: "Authorized", email: req.user.email }));


router.get('/home',verifyUser,(req,res)=>{
  const userEmail = req.user.email;
    return res.json({status:true ,message:"authorized",email:userEmail})
})

router.get('/logout',(req,res)=>{
  res.clearCookie('token')
  return res.json({status:true}) 
})



router.post('/admin', async(req, res) => {
  const { name, password } = req.body;


  const user1 = await Admin.findOne({ name });
  const password1 =await Admin.findOne({ password });
  if (!user1) {
    return res.json({ message: "user is not registered" });
  }

 
  if (!password1) {
    return res.json({ message: "password is incorrect" });
  }


  const token = jwt.sign({ name: user1.name }, process.env.KEY, { expiresIn: '1h' });
  

  res.cookie('token', token, { httpOnly: true, maxAge: 10800000 }); 
  
  return res.json({ status: true, message: "Admin login successfully" });
});


const verifyAdmin = async (req, res, next) => {
  try {
    const token = req.cookies.token; 
    if (!token) {
      return res.json({ status: false, message: "no token" });
    }
    const decoded = jwt.verify(token, process.env.KEY);
    req.user1 = decoded; 
    next();
  } catch (err) {
    return res.json({ status: false, message: err.message });
  }
};

router.get('/verifyadmin',verifyAdmin,(req,res)=>{
  const Adminname = req.user1.name;
    return res.json({status:true ,message:"authorized",name:Adminname})
})

router.get('/adminlogout',(req,res)=>{
  res.clearCookie('token')
  return res.json({status:true}) 
})

router.get('/admininfo',async(req,res)=>{
  try {
    const user=await User.find({})
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
})

router.post('/contactus',async(req,res)=>{
  const{name,email,message} =req.body;
   try{
      const newContactus =new Contactus({
        name,
        email,
        message,
    })
    await newContactus.save()
  }
  catch(err)
    {
      console.error("Error:", err);
      return res.status(500).json({ message: "Server error while" });
    }

  return res.json({status:true ,message :"record"})
  
})


router.post('/start', async (req, res) => { 
  const { subject, raspberryPiIp } = req.body;

  if (!subject || !raspberryPiIp) {
      return res.status(400).json({ message: "Subject name and Raspberry Pi IP are required." });
  }

  try {
      const response = await axios.post(`http://${raspberryPiIp}:5000/start`, { subject });
      res.json(response.data);
  } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ message: 'Failed to start script' });
  }
});


router.get("/attendance", async (req, res) => {
  try {
    const { UID, date, startTime, endTime } = req.query;

    let query = {};
    if (UID) query.UID = UID;

    if (date && startTime && endTime) {
      query.Timestamp = { $regex: `^${date} ${startTime}:00|${date} ${endTime}:00` };
    } else if (date) {
      query.Timestamp = { $regex: `^${date}` }; 
    }


    const records = await ProfessorAttendance.find(query);
  
    res.json(records);
  } catch (err) {
    console.error("Error fetching attendance:", err);
    res.status(500).json({ error: err.message });
  }
});

router.get('/faculty/fetchByLinkId', verifyUser("Faculty"), async (req, res) => {
  try {
    const { linkid } = req.user; 

    const collectionName = `${linkid}`; 
    const collection = mongoose.connection.db.collection(collectionName); 

    const records = await collection.find({ Division: { $ne: "N/A" } }).toArray();

    if (records.length === 0) {
      return res.json({ status: false, message: "No records found or all have Division as N/A" });
    }

    return res.json({ status: true, data: records });
  } catch (err) {
    console.error("Error fetching records:", err);
    return res.status(500).json({ message: "Server error while fetching records" });
  }
});

router.get('/hod/fetchByLinkId', verifyUser("HOD"), async (req, res) => {
  try {
    const { linkid } = req.user; 

    const collectionName = `${linkid}`; 
    const collection = mongoose.connection.db.collection(collectionName); 

    const records = await collection.find({ Division: { $ne: "N/A" } }).toArray();

    if (records.length === 0) {
      return res.json({ status: false, message: "No records found or all have Division as N/A" });
    }

    return res.json({ status: true, data: records });
  } catch (err) {
    console.error("Error fetching records:", err);
    return res.status(500).json({ message: "Server error while fetching records" });
  }
});

router.get('/student/fetchByLinkId', verifyUser("User"), async (req, res) => {
  try {
    const { linkid } = req.user;
    const { date, startTime, endTime } = req.query;

    let query = { UID: linkid };

    if (date && startTime && endTime) {
      query.Timestamp = {
        $gte: new Date(`${date}T${startTime}:00.000Z`), 
        $lte: new Date(`${date}T${endTime}:59.999Z`)
      };
    } else if (date) {
      query.Timestamp = { $regex: `^${date}` };
    }

    const records = await ProfessorAttendance.find(query);
    res.json(records);
  } catch (err) {
    console.error("Error fetching attendance:", err);
    res.status(500).json({ error: err.message });
  }
});

router.get('/faculty/fetchAll', async (req, res) => {
  try {
    const facultyList = await Faculty.find({}, 'linkid'); // Fetch only linkid field

    if (!facultyList.length) {
      return res.json({ status: false, message: "No faculty linkids found" });
    }

    const results = {};

    for (const faculty of facultyList) {
      const { linkid } = faculty;
      if (!linkid) continue;

      const collection = mongoose.connection.db.collection(linkid); // Dynamic collection

      const records = await collection.find({ Division: { $ne: "N/A" } }).toArray();
      results[linkid] = records.length ? records : "No records found";
    }

    return res.json({ status: true, data: results });
  } catch (err) {
    console.error("Error fetching faculty records:", err);
    return res.status(500).json({ message: "Server error while fetching records", error: err.message });
  }
});

export {router as UserRouter}
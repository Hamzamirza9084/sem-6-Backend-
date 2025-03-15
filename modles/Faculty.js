import mongoose from 'mongoose';

const FacultySchema= new mongoose.Schema({
    linkid: {type:String,required:true},
    name: {type:String,required:true},
    email : {type:String,required:true,unique:true},
    password: {type:String,required:true}
})

const Facultymodel= mongoose.model("Faculty",FacultySchema)

export {Facultymodel as Faculty} 
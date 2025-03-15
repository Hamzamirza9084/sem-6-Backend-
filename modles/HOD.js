import mongoose from 'mongoose';

const HODSchema= new mongoose.Schema({
    name: {type:String,required:true},
    email : {type:String,required:true,unique:true},
    password: {type:String,required:true}
})

const HODmodel= mongoose.model("HOD",HODSchema)

export {HODmodel as HOD} 
import mongoose from 'mongoose';

const PrincipalSchema= new mongoose.Schema({
    name: {type:String,required:true},
    email : {type:String,required:true,unique:true},
    password: {type:String,required:true}
})

const Principalmodel= mongoose.model("Principal",PrincipalSchema)

export {Principalmodel as Principal} 
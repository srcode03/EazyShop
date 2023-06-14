const mongoose=require('mongoose')
const validator=require('validator')
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
const crypto = require('crypto');
const dotenv=require('dotenv')
dotenv.config({path:'../backend/config/config.env'}); 
const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please enter your name"],
        maxLength:[30,'Name cannot exceed 30 characters'],
        minLength:[2,'Name should be atlest 2 characers'],
    },
    email:{
        type:String,
        required:[true,'Please enter your email'],
        unique:true,
        validator:[validator.isEmail,'Please enter a valid email'],

    },
    password:{
        type:String,
        select:false,
        required:[true,"Please enter a valid password"],
        minLength:[5,"Password must be atleast 5 chracters"],
    },
    avater:{
        public_id:{
            type:String,
            required:true,
        },
        url:{
            type:String,
            required:true,
        }
    },
    role:{
        type:String,
        default:"user",
    },
    createdAt:{
        type:Date,
        default:Date.now(),
    },

    resetPasswordToken:String,
    resetPasswordExpire:Date,
})
//we are generating of the hash of the password and storing it in the database for security reasons
//if the hash has been generated once then we do not have to hash it once again :)
userSchema.pre("save",async function(next){
    if(!this.isModified("password"))
    {
        next()
    }
    this.password=await bcrypt.hash(this.password,10)
})
//the beelow method helps us in genrating the JWT Token for verification
//Uses of it are:when we have logged in once it generates a token which can compared when we visit the the website again
//made for user convenience
const secret='helloworld'
userSchema.methods.getJWTToken=function(){
    return jwt.sign({id:this._id},secret,{
        expiresIn:'1d',   
    })
}
//the below method compares the normal password which we have sent hashes it and then compares with that present in the schema
userSchema.methods.comparepassword=async function(epassword){
    const val=await bcrypt.compare(epassword,this.password)
    return val
}
//making arrangements for resetting of the password
userSchema.methods.resetpassword=async function(){
    //we will be making use of the crypto module which is already inbuiult
    //we will generate 20 random bytes using .randomBytes method
    //and then convert it to string using .toString method and then making use of hex
    let token=await crypto.randomBytes(20).toString("hex")
    //now we will create the hash of the token
    //here we have made use of the shai256 algorithm to create the hash of th token and then update the token with the hash of it
    this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
    
    return token
}
module.exports=mongoose.model("user",userSchema)
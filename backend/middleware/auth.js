const catchAsyncErrors = require("./catchAsyncErrors");
const jwt=require('jsonwebtoken')
const User=require('../models/userModel')
const dotenv=require('dotenv');
const { findOne, findById } = require("../models/userModel");
dotenv.config({path:'../backend/config/config.env'}); 
const secret='helloworld'
exports.isAuthenticatedUser=catchAsyncErrors(async(req,res,next)=>{
    const {token}=req.cookies
    if(!token)
    {
        return res.status(400).json({message:"Please login to view this page"})
    }
    const decodeddata=jwt.verify(token,secret)
    req.user=await User.findById(decodeddata.id)
    next()
})
//authorize the role of the person
//... syntax is used for concatenating entire array or in short traversing the whole array
exports.authorizerole=(...roles)=>{
    return (req,res,next)=>{
    if(!roles.includes(req.user.role))
    {
        return res.status(400).json({message:"Access denied"})
    }
    next()
}
}
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const Errorhandler = require("../utils/errorhandler");
const User=require('../models/userModel')
const sendToken=require('../utils/jwtToken')
const sendEmail=require('../utils/sendemail')
const crypto=require('crypto');
const { findByIdAndUpdate } = require("../models/userModel");
//register of the user
exports.registerUser=catchAsyncErrors(async(req,res)=>{
    const {name,email,password}=req.body
    const user=await User.create({
        name,email,password,
        avater:{
            public_id:"this is a sample id",
            url:"profilepic",
        }
    })
    // const token=await user.getJWTToken()
    // res.status(201).json({
    //     success:true,
    //     token
    // })
    sendToken(user,200,res)
})
//Login of the user
exports.loginUser=catchAsyncErrors(async(req,res)=>{
   const {email,password}=req.body
   //checking if user has sent both email and pasword
   if(!email || !password)
   {
        return res.status(400).json({message:"Please enter valid credentials"})
   }
   const user=await User.findOne({email}).select("+password")
   if(!user)
   {
        return res.status(400).json({message:"Please enter valid credentials"})
   }
   const passwordmatch=await user.comparepassword(password)
   if(!passwordmatch)
   {
    return res.status(400).json({message:"Please enter valid credentials"})
   }
//    const token=await user.getJWTToken()
//     res.status(201).json({
//         success:true,
//         token
//     })
    sendToken(user,200,res)

})
//Logout of the User
exports.loginOutuser=catchAsyncErrors(async(req,res)=>{
    res.cookie("token",null,{
        expires:new Date(Date.now()),
        httpOnly:true
    })
    res.status(200).json({
        success:true,
        message:"Sucessfully logged out"
    })
 })
 //Forgot password
 exports.forgotPassword=catchAsyncErrors(async(req,res,next)=>{
    const {email}=req.body
    const user=await User.findOne({email})
    if(!user){
        return res.status(404).json({message:"User Not found"})
    }
    const resettoken=await user.resetpassword()
    await user.save()
    const resetPasswordUrl = `${req.protocol}://${req.get("host")}/password/reset/${resettoken}`;

  const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\nIf you have not requested this email then, please ignore it.`;
  
//   try {
//     await sendEmail({
//       email: user.email,
//       subject: `Ecommerce Password Recovery`,
//       message,
//     });

//     res.status(200).json({
//       success: true,
//       message: `Email sent to ${user.email} successfully`,
//     });
//   } catch (error) {
//     console.log(message)
//     return next(res.status(400).json({message:"Failed to send the messages"}));
//   }
    console.log(message)
    res.status(400).json({message:"Failed to send the messages"});

 })
 //Reset Password
 exports.resetPassword=catchAsyncErrors(async(req,res,next)=>{
    const resetPasswordToken =await crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
  });

  if (!user) {
    return next(
      res.status(400).json({message:"User not found"})
      )
  }

  if (req.body.password !== req.body.confirmPassword) {
    return res.status(400).json({message:"Password must be the same"});
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  sendToken(user, 200, res);

 })
//User Details:
exports.getUserDetails = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({
    success: true,
    user,
  });
});
//Update password of the user:
exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
  const user=await User.findById(req.user.id).select("+password")
  const passcompare=await user.comparepassword(req.body.oldpassword)
  if(!passcompare)
  {
    res.status(400).json({message:"Old password is incorrect"})
  }
  if(req.body.confirmpassword!==req.body.newpassword)
  {
    res.status(400).json({messsage:"Confirm password and new password must match each other"})
  }
  user.password=req.body.newpassword
  await user.save()
  res.status(201).json({success:"true",message:"Password has been updated sucessfully"})
});
//Update the user profile
exports.updateProfile=catchAsyncErrors(async(req,res,next)=>{
  const token=req.cookies.token
  console.log(token)
  const newuserdata={
    name:req.body.name,
    email:req.body.email,
  }
  //we will add cloudinary later
  const user=await User.findByIdAndUpdate(req.user.id,newuserdata,{
    new:true,
    runValidators:true,
    userFindAndModify:false
  })
  res.status(200).json({success:"true",message:"Profile Updated Sucessfully"})
})
//Get all users:
exports.getAllUser = catchAsyncErrors(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    success: true,
    users,
  });
});
// Get single user (admin)
exports.getSingleUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      res.status(201).json({success:"true"})
    );
  }

  res.status(200).json({
    success: true,
    user,
  });
});
// update User Role -- Admin
exports.updateUserRole = catchAsyncErrors(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  };

  await User.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
  });
});
// Delete User --Admin
exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      res.status(400).json({message:"user not found"})
    );
  }

  //we will remove cloudinary later

  await User.deleteOne({id:req.user.id});

  res.status(200).json({
    success: true,
    message: "User Deleted Successfully",
  });
});

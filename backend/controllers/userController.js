const ErrorHander = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const User = require("../models/UserModels");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");

//Register a user
exports.registerUser = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password } = req.body;

  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: "this is a sample id",
      url: "profilepic",
    },
  });

  // const token = user.getJWTToken();
  // // console.log(token);

  // res.status(201).json({
  //   success: true,
  //   token,
  // });

  sendToken(user, 201, res);
});

// Login User
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  //checking if user has given password and email both.

  if (!email || !password) {
    return next(new ErrorHander("Please Enter Email & Password", 400));
  }

  // find user                       because we had falsed password so using select.
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHander("Invalid email or password", 401));
  }

  const isPasswordMatched = user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHander("Invalid email or password", 401));
  }

  // const token = user.getJWTToken();
  // // console.log(token);

  // res.status(200).json({
  //   success: true,
  //   token,
  // });

  // -----------------  or --------------------

  sendToken(user, 200, res);
});

//Logout User
exports.logout = catchAsyncErrors(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now),
    httpOnly: true,
  });

  res.status(200).json({
    sucess: true,
    message: "Logout successfully",
  });
});

//Forgot Password
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorHander("User not found", 404));
  }

  // Get ResetPassword Token
  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  //mail link
  const reserPasswordUrl = `${req.protocol}//${req.get(
    "host"
  )}/api/v1/password/reset/${resetToken}`;

  const message = `Your password reset token is :- \n\nIf you heve not requested this emil then, please ignore it`;

  try {
    await sendEmail({
      email:user.email,
      subject:`Ecommerce Password Recovery`,
      message,

    });

    res.status(200).json({
      sucess:true,
      message:`Email sent to ${user.email} successfully`,
    })
    
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new ErrorHander(error.message,500));
    
  }

});

//Reset Password
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {

  //creating hased token
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire:{$gt:Date.now()}, //greater than time now
    });

    if(!user){
      return next(new ErrorHander("Reset password token is not valid or has expired!!",404));
    }

    if(req.body.password !== req.body.confirmPassword){
      return next(new ErrorHander("Password doesnot password!!",404));
    }

    user.password = req.body.password;
    user.resetPasswordExpire = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();
    sendToken(user,200,res);
});

//Get USer Details
exports.getUserDetails = catchAsyncErrors(async(req,res,next)=>{
  const user = await User.findById(req.user.id);
  res.status(200).json({
    sucess:true,
    user
  })
});

//Update User Password
exports.updatePassword = catchAsyncErrors(async(req,res,next)=>{
  const user = await User.findById(req.user.id).select("+password");
  const isPasswordMatched =await user.comparePassword(req.body.oldPassword);

  if(!isPasswordMatched){
    return next(new ErrorHander("old password is incorrect",400));
  }

  if(req.body.newPassword !== req.body.confirmPassword){
    return next(new ErrorHander("password doesn't match!!",400));
  }

  user.password = req.body.newPassword;

  await user.save();

  sendToken(user,200,res);
});

//Update User profile
exports.updateProfile = catchAsyncErrors(async(req,res,next)=>{
  
  const newUserData={
    name:req.body.name,
    email:req.body.email
  }

  //will cloudinay later

  const user=await User.findByIdAndUpdate(req.user.id, newUserData,{
    new:true,
    runValidators:true,
    useFindAndModify:false,
  });

  res.status(200).json({
    sucess:true,
    user
  });
});

//Get All Users(admin)
exports.getAllUser =catchAsyncErrors(async(req,res,next)=>{
  const users=await User.find();

  res.status(200).json({
    success:true,
    users,
  });
});


//Get single Users(admin)
exports.getSingleUser=catchAsyncErrors(async(req,res,next)=>{
  const user=await User.findById(req.params.id);

  if(!user){
    return next(new ErrorHander(`User does not exist with id: ${req.params.id}`))
  }

  res.status(200).json({
    success:true,
    user
  })
});


//update User Role --Admin
exports.updateUserRole = catchAsyncErrors(async(req,res,next)=>{
  
  const newUserData={
    name:req.body.name,
    email:req.body.email,
    role:req.body.role
  }

  const user=await User.findByIdAndUpdate(req.user.id, newUserData,{
    new:true,
    runValidators:true,
    useFindAndModify:false,
  });

  res.status(200).json({
    sucess:true,
    message:"Updated User Successfully",
    user
  });
});

//Delete User Role --Admin
exports.deleteUserProfile = catchAsyncErrors(async(req,res,next)=>{

  const user=await User.findById(req.params.id);;

  if(!user){
    return next(new ErrorHander(`User does not exixt with id: ${req.params.id}`))
  }

  await user.remove();

  res.status(200).json({
    sucess:true,
    message:"User deleted Successfully",
    user
  });
});


const ErrorHander = require("../utils/errorhandler");
const catchAsysncErrors = require("./catchAsyncErrors");
const jwt = require("jsonwebtoken");
const User = require("../models/UserModels");

exports.isAuthenticatedUser = catchAsysncErrors(async(req,res,next)=>{

    const {token} = req.cookies;

    // console.log(token);

    if(!token){
        return next(new ErrorHander("Please Login to access this resource",401));
    }

    const decodedData = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decodedData.id) //accessing id of jwt token.

    next();
    
})

exports.authorizeRoles=(...roles)=>{
    return (req,res,next)=>{

        if(!roles.includes(req.user.role)){ //if roles contains admin
          return next (  new ErrorHander(`Role: ${req.user.role} is not allowed to use this resource`,403));
        }
        
        next();
    }
}
const jwt=require('jsonwebtoken')
const asyncHandler=require('./asyncHandler')
const MyError=require('../utils/myError')
const User=require('../models/User')



exports.protect = asyncHandler(async (req, res, next) => {
 if(!req.headers.authorization){
  throw new MyError('Энэ үйлдэл хийхэд таны эрх хүрэхгүй байна.Та эхлээд логин хийнэ үү ', 401)
 }
 
 const token=req.headers.authorization.split(' ')[1];

 if(!token){
    throw new MyError('Токен байхгүй байна', 401)
   }

  const tokenObj= jwt.verify(token,process.env.JWT_SECRET)


//   req.user=await User.findById(tokenObj.id)
  req.userId=tokenObj.id
  req.userRole=tokenObj.role

  next();
  });
  

  exports.authorize=(...roles)=>{
    return (req, res, next)=>{
    
        if(!roles.includes(req.userRole)){
            throw new MyError('Таны эрх хүрэлцэхгүй байна'+req.userRole,403)
        }
        next()
    }
  }
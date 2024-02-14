const User = require("../models/User");
const MyError = require("../utils/myerror");
const asyncHandler = require("../middleware/asyncHandler");
const paginate = require("../utils/paginate");
const sendEmail = require("../utils/email");
const crypto =require('crypto')
exports.register = asyncHandler(async (req, res, next) => {
  console.log("data", req.body);

  const user = await User.create(req.body);

  const token = user.getJsonWebToken();

  res.status(200).json({
    success: true,
    token,
    user: user,
  });
});

exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  //orolt shalgana

  if (!email || !password) {
    throw new MyError("Имэйл болон нууц үгээ дамжуулна уу", 400);
  }

  // тухайн хэрэглэгчийг шалгана
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new MyError("Имэйл болон нууц үгээ зөв оруулна уу", 401);
  }

  const ok = await user.checkPassword(password);
  if (!ok) {
    throw new MyError("Имэйл болон нууц үгээ зөв оруулна уу", 401);
  }

  res.status(200).json({
    success: true,
    token: user.getJsonWebToken(),
    user: user,
  });
});
exports.getUsers = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  // delete req.query.page
  const limit = parseInt(req.query.limit) || 10;
  // delete req.query.limit
  const sort = req.query.sort;
  // delete req.query.sort
  const select = req.query.select;
  // delete req.query.select
  console.log(req.query);
  ["select", "sort", "page", "limit"].forEach((el) => delete req.query[el]);

  //Pagination
  const pagination = paginate(User, page, limit);

  const users = await User.find(req.query, select)
    .sort(sort)
    .skip(pagination.start - 1)
    .limit(limit);
  res.status(200).json({
    success: true,
    data: users,
    pagination,
  });
});

exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    throw new MyError(
      req.params.id + "ID hereglegch байхгүй байна shuu my error working ",
      400
    );
  }

  // category.name +="-";
  // category.save(function(err){
  //   if(err){
  //     console.log('error:',err);
  //   }
  //   console.log("save");
  // });

  res.status(200).json({
    success: true,
    data: user,
  });
});

exports.createUser = asyncHandler(async (req, res, next) => {
  console.log("data", req.body);

  const user = await User.create(req.body);
  res.status(200).json({
    success: true,
    data: user,
  });
});

exports.updateUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    throw new MyError(
      req.params.id + "ID hereglegch байхгүй байна shuu my error working ",
      400
    );
  }
  res.status(200).json({
    success: true,
    data: user,
  });
});
exports.deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);

  if (!user) {
    throw new MyError(
      req.params.id + "ID hereglegch байхгүй байна shuu my error working ",
      400
    );
  }

  res.status(200).json({
    success: true,
    data: user,
  });
});

exports.forgotPassword = asyncHandler(async (req, res, next) => {
  if (!req.body.email) {
    throw new MyError("Та нууц үгээ сэргээх и мэйл хаягаа дамжуулна уу", 400);
  }
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    throw new MyError(req.body.email + "Email тэй хэрэглэгч олдсонгүй  ", 400);
  }
 
  const resetToken = user.generatePasswordChangeToken();
  await user.save();

  //email илгээнэ
  const link = `https://amazon.mn/changepassword/${resetToken}`;
  const message = ` Сайн байна ууу <br/> Та нууц үгээ солих линк илгээлээ <br/> Нууц үг доорх линк
  дээр дарж солино уу <br/> ${link}<br/> Өдрийг сайхан өнгөрүүлээрэй `;
  const info =await sendEmail({
    email: user.email,
    subject: "Нууц үг өөрчлөх хүсэлт",
    message: "",
  });
  console.log("message", info.messageId);
  res.status(200).json({
    success: true,
    resetToken,
  });
});


exports.resetPassword = asyncHandler(async (req, res, next) => {
  if (!req.body.resetToken || !req.body.password) {
    throw new MyError("Токен болон нууц үгээ дамжуулна уу", 400);
  }

const encrypted=crypto.createHash('sha256').update(req.body.resetToken).digest('hex')


  const user = await User.findOne({ resetPasswordToken: encrypted,resetPasswordExpire:{$gt:Date.now()}});

  if (!user) {
    throw new MyError( "Хүчингүй токен байна ", 400);
  }
 
user.password=req.body.password;
user.resetPasswordExpire=undefined;
user.resetPasswordToken=undefined;


  await user.save();


  const token = user.getJsonWebToken();

  res.status(200).json({
    success: true,
    token,
    user: user,
  });
});

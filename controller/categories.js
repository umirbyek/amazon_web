const Category = require("../models/Category");
const MyError = require("../utils/myerror");
const asyncHandler = require("../middleware/asyncHandler");
const paginate=require("../utils/paginate")
exports.getCategories = asyncHandler(async (req, res, next) => {
  
  const page=parseInt( req.query.page)||1;
  // delete req.query.page

  const limit=parseInt(req.query.limit)||10;
  // delete req.query.limit


  const sort=req.query.sort;
  // delete req.query.sort
  
  const select=req.query.select;
  // delete req.query.select
  console.log(req.query);

  ['select','sort','page','limit'].forEach(el=>delete req.query[el])


//Pagination
const pagination=paginate(Category,page,limit,)

  const categories = await Category.find(req.query,select).sort(sort).skip(pagination.start-1).limit(limit);
  res.status(200).json({
    success: true,
    data: categories,
    pagination
  });
});

exports.getCategory = asyncHandler(async (req, res, next) => {
  
req.db.teacher.create({
  
  id:2,
  name:'Naraaa',
  phone:'9999',
  password:'123123'
});
req.db.course.create({
  id:1,
  name:'С++  алгоримт ',
  price:'32000',
  tailbar:'123123'
}
)


  const category = await Category.findById(req.params.id).populate('books');

  if (!category) {
    throw new MyError(
      req.params.id + "ID категори байхгүй байна shuu my error working ",
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
    data: category,
  });
});

exports.createCategory = asyncHandler(async (req, res, next) => {
  console.log("data", req.body);

  const category = await Category.create(req.body);
  res.status(200).json({
    success: true,
    data: category,
  });
});

exports.updateCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!category) {
    throw new MyError(
      req.params.id + "ID категори байхгүй байна shuu my error working ",
      400
    );
  }
  res.status(200).json({
    success: true,
    data: category,
  });
});
exports.deleteCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findByIdAndDelete(req.params.id);

  if (!category) {
    throw new MyError(
      req.params.id + "ID категори байхгүй байна shuu my error working ",
      400
    );
  }
  res.status(200).json({
    success: true,
    data: category,
  });
});

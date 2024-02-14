const Book = require("../models/Book");
const Category = require("../models/Category");
const MyError = require("../utils/myerror");
const asyncHandler = require("../middleware/asyncHandler");
const path = require("path");
const paginate = require("../utils/paginate");
const protect = require("../middleware/protect");
//api/v1/books/
const User = require("../models/User");

exports.getBooks = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  // delete req.query.page

  const limit = parseInt(req.query.limit) || 5;
  // delete req.query.limit

  const sort = req.query.sort;
  // delete req.query.sort

  const select = req.query.select;
  // delete req.query.select
  console.log(req.query);

  ["select", "sort", "page", "limit"].forEach((el) => delete req.query[el]);

  const pagination = paginate(Book, page, limit);

  const books = await Book.find(req.query, select)
    .populate({
      path: "category",
      select: "name averagePrice",
    })
    .sort(sort)
    .skip(pagination.start - 1)
    .limit(limit);
  res.status(200).json({
    success: true,
    count: books.length,
    data: books,
    pagination,
  });
});

//api/v1/categories/:catId/books
exports.getCategoryBooks = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  // delete req.query.page

  const limit = parseInt(req.query.limit) || 5;
  // delete req.query.limit

  const sort = req.query.sort;
  // delete req.query.sort

  const select = req.query.select;
  // delete req.query.select
  console.log(req.query);

  ["select", "sort", "page", "limit"].forEach((el) => delete req.query[el]);
  //req.query ,select
  const pagination = paginate(Book, page, limit);

  const books = await Book.find(
    { ...req.query, category: req.params.categoryId },
    select
  )
    .sort(sort)
    .skip(pagination.start - 1)
    .limit(limit);
  res.status(200).json({
    success: true,
    count: books.length,
    data: books,
    pagination,
  });
});

exports.getBook = asyncHandler(async (req, res, next) => {
  const book = await Book.findById({ _id: req.params.id });

  if (!book) {
    throw new MyError(req.params.id + "ID tei nom baihgui baina ", 404);
  }
  //throw shuud graad ybchin a gsen ug
  res.status(200).json({
    success: true,
    data: book,
  });
});

exports.deleteBook = asyncHandler(async (req, res, next) => {
  const book = await Book.findByIdAndDelete(req.params.id);
  if (!book) {
    throw new MyError(req.params.id + "ID tei nom baihgui baina ", 404);
  }

  if(book.createUser.toString()!==req.userId &&req.userRole!=='admin'){
    throw new MyError('Ta зөвхөн өөрийн номыг засварлах эрхтэй',403);

  }

  const user = User.findById(req.userId);
  //throw shuud graad ybchin a gsen ug
  res.status(200).json({
    success: true,
    data: book,
    whoDelete: user.name,
  });
});

exports.createBook = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.body.category);

  if (!category) {
    throw new MyError(
      req.body.category + "ID категори байхгүй байна shuu my error working ",
      400
    );
  }
  req.body.createUser = req.userId;
  const book = await Book.create(req.body);

  res.status(200).json({
    success: true,
    data: book,
  });
});

exports.updateBook = asyncHandler(async (req, res, next) => {
 


  const book = await Book.findById(req.params.id);

  if (!book) {
    throw new MyError(
      req.params.id + "ID nom, байхгүй байна shuu my error working ",
      400
    );
  }

  if(book.createUser.toString()!==req.userId &&req.userRole!=='admin'){
    throw new MyError('Ta зөвхөн өөрийн номыг засварлах эрхтэй',403);

  }
 
  req.body.updateUser=req.userId

  for(let attr in req.body){
  book[attr]=req.body[attr]
  }

  book.save();
  // req.body.updateUser = req.userId;
  //  book = await Book.findByIdAndUpdate(req.params.id, req.body, {
  //   new: true,
  //   runValidators: true,
  // });

 
  res.status(200).json({
    success: true,
    data: book,
  });
});

//PUT api/v1/books/:id/photo
exports.updateBookPhoto = asyncHandler(async (req, res, next) => {
  const book = await Book.findById(req.params.id);

  if (!book) {
    throw new MyError(
      req.params.id + "ID nom, байхгүй байна shuu my error working ",
      400
    );
  }

  //image upload

  book.save();
  res.status(200).json({
    success: true,
    data: book,
  });
  // res.end()
});

exports.getUserBooks = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  // delete req.query.page

  const limit = parseInt(req.query.limit) || 5;
  // delete req.query.limit

  const sort = req.query.sort;
  // delete req.query.sort

  const select = req.query.select;
  // delete req.query.select
  console.log(req.query);

  ["select", "sort", "page", "limit"].forEach((el) => delete req.query[el]);

  const pagination = paginate(Book, page, limit);
  req.query.createUser = req.userId;
  const books = await Book.find(req.query, select)
    .populate({
      path: "category",
      select: "name averagePrice",
    })
    .sort(sort)
    .skip(pagination.start - 1)
    .limit(limit);
  res.status(200).json({
    success: true,
    count: books.length,
    data: books,
    pagination,
  });
});

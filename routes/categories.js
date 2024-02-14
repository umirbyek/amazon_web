const express = require("express");
const router = express.Router();
const {protect,authorize }= require('../middleware/protect');
const {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controller/categories");
//api/v1/categories/:id/books
const { getCategoryBooks } = require("../controller/books");
router.route("/:categoryId/books").get(protect, getCategoryBooks)

//api/v1/categories

// const booksRouter =require("./books");
// router.use("/:categoryId/books",booksRouter)

router.route("/").get(getCategories).post(protect,authorize('admin'), createCategory);
// /api/v1/categories/:id/books
// router.route("/:categoryId/books").get(getBooks);


router
  .route("/:id")
  .get(getCategory)
  .put(protect,authorize('admin','operator'), updateCategory)
  .delete(protect,authorize('admin')
    , deleteCategory);

module.exports = router;

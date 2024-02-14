const express = require("express");
const {protect,authorize }= require('../middleware/protect');
const {
  getBooks,
  getBook,
  createBook,
  deleteBook,
  updateBook,
  updateBookPhoto,
} = require("../controller/books");

const router = express.Router();

router.route("/").get(getBooks).post(protect,authorize('admin','operator'),createBook);
router.route("/:id").get(getBook).delete(protect,authorize('admin'), deleteBook).put(protect,authorize('admin','operator'), updateBook);
router.route("/:id/photo").put(authorize('admin','operator'),updateBookPhoto);

module.exports = router;

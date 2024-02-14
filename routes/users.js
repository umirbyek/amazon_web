const express = require("express");

const {
   protect,authorize
    
    } = require("../middleware/protect");
const {
register,login,getUser,getUsers,createUser,deleteUser,updateUser, forgotPassword, resetPassword

} = require("../controller/user");

const {
getUserBooks
    
    } = require("../controller/books");
const router = express.Router();
//"/api/v1/users"


router.route("/register").post(register);
router.route("/login").post(login);
router.route("/forgot-password").post(forgotPassword);
router.route("/reset-password").post(resetPassword);
router.use(protect)
router.route("/").get(authorize('admin'), getUsers).post(authorize('admin'),createUser);
router.route("/:id").get(authorize('admin','operator'),getUser).put(authorize('admin'),updateUser).delete(authorize('admin'),deleteUser);

router.route("/:id/books").get(protect,authorize('admin','operator','user'),getUserBooks);


module.exports = router;

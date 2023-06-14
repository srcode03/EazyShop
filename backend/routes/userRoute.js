const express=require('express')
const { registerUser, loginUser, loginOutuser, forgotPassword, resetPassword } = require('../controllers/userController')
const { getUserDetails, updatePassword, updateProfile, getAllUser, getSingleUser, updateUserRole, deleteUser } = require('../controllers/userController');
const router=express.Router()
const { isAuthenticatedUser,authorizerole } = require('../middleware/auth');
router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route("/forgot/password").post(forgotPassword)
router.route("/password/reset/:token").put(resetPassword)
router.route("/logout").get(loginOutuser)
router.route("/me").get(isAuthenticatedUser,getUserDetails);
router.route("/password/update").put(isAuthenticatedUser,updatePassword)
router.route("/me/update").put(isAuthenticatedUser,updateProfile)
router.route("/admin/users").get(isAuthenticatedUser,authorizerole("admin"),getAllUser)
router
  .route("/admin/user/:id")
  .get(isAuthenticatedUser,authorizerole("admin"), getSingleUser)
  .put(isAuthenticatedUser,authorizerole("admin"), updateUserRole)
  .delete(isAuthenticatedUser,authorizerole("admin"), deleteUser);


module.exports=router
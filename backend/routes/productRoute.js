const express = require('express');
const { getAllProducts,createProduct, updateProduct, deleteProduct, getProductDetails, createProductReview, getProductReviews, deleteReview} = require('../controllers/productController');
const { isAuthenticatedUser,authorizerole } = require('../middleware/auth');
const router = express.Router();
//both user and admin can access this admin
router.route("/products").get(getAllProducts);
router.route("/products/details/:id").get(getProductDetails)
//only admin can access this route
router.route("/admin/products").post(isAuthenticatedUser,authorizerole("admin"),createProduct);
router.route("/admin/products/:id").put(isAuthenticatedUser,authorizerole("admin"),updateProduct).delete(isAuthenticatedUser,authorizerole("admin"),deleteProduct).get(getProductDetails);

//Reviews
router.route("/review").put(isAuthenticatedUser,createProductReview)
router.route("/getallreviews").post(getProductReviews)
router.route("/deletereview").delete(deleteReview)

module.exports = router;



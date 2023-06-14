const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const Product = require("../models/productModel");
const ApiFeature = require("../utils/apiFeatures");
const Errorhandler = require("../utils/errorhandler");



// create product --Admin
exports.createProduct = catchAsyncErrors(async (req,res,next)=>{
    req.body.user=req.user.id
    
    const product = await Product.create(req.body);
    res.status(201).json({
        success:true,
        product
    })
})

// get all products
exports.getAllProducts = catchAsyncErrors(async (req,res)=>{

  const resultPerPage = 5;
  const productsCount = await Product.countDocuments();

  const apiFeature=new ApiFeature(Product.find(), req.query)
    .search()
    .filter()
    .pagination(resultPerPage);
  const products = await apiFeature.query;

  res.status(200).json({
    success: true,
    products,
    productsCount,
    resultPerPage,
  });
});


// get product details

exports.getProductDetails = catchAsyncErrors(async(req,res,next)=>{
    const product = await Product.findById(req.params.id);
    if(!product){
        return next(new Errorhandler("Product not found",404));
    }
    res.status(200).json({
        success:true,
        product
    })
})


// Update Product --Admin
exports.updateProduct=catchAsyncErrors(async(req,res)=>{
    let product = Product.findById(req.params.id);

    if(!product){
        return res.status(500).json({
            success:false,
            message:"Product not found"
        })
    }

    product = await Product.findByIdAndUpdate(req.params.id,req.body,{
        new:true,
        runValidators:true,
        useFindandModify:false
    });

    res.status(200).json({
        success:true,
        product 
    })
})

// Delete Product --Admin

exports.deleteProduct = catchAsyncErrors(async (req,res,next)=>{
    const product = await Product.findById(req.params.id);
    if(!product){
        return res.status(500).json({
            success:false,
            message:"Product not found"
        })
    }

    await Product.findByIdAndDelete(req.params.id);

    res.status(200).json({
        success:true,
        message:"Product has been deleted successfully"
    })
})

//Create new or update the review
exports.createProductReview=catchAsyncErrors(async(req,res,next)=>{
    const {rating,comment,productId}=req.body
    const review={
        user:req.user._id,
        name:req.user.name,
        rating:Number(rating),
        comment,
    };
    const product=await Product.findById(productId);
    const isReviewed = product.reviews.find(
        (rev) => rev.user.toString() === req.user._id.toString()
      );
      if (isReviewed) {
        product.reviews.forEach((rev) => {
          if (rev.user.toString() === req.user._id.toString())
            (rev.rating = rating), (rev.comment = comment);
        });
      } else {
        product.reviews.push(review);
        product.numOfReviews = product.reviews.length;
      }
      let avg=0;
      product.rating=product.reviews.forEach((rev)=>{
        avg=avg+rev.rating;
      })
      product.rating=avg/product.reviews.length
      await product.save({validateBeforeSave:false});
      res.status(200).json({
        success:true
      })
})
//Get all reviews of a single product
// Get All Reviews of a product
exports.getProductReviews = catchAsyncErrors(async (req, res, next) => {
  const {productId}=req.body
    const product = await Product.findById(productId);
  
    if (!product) {
      return res.status(400).json({message:"Product not found"})
    }
  
    res.status(200).json({
      success: true,
      reviews: product.reviews,
    });
  });

// Delete Review
exports.deleteReview = catchAsyncErrors(async (req, res, next) => {
    const {productId}=req.body
    const product = await Product.findById(productId);
  
    if (!product) {
      return res.status(400).json({message:"Product to be deleted not found"})
    }
  
    const reviews = product.reviews.filter(
      (rev) => rev._id.toString() !== req.query.id.toString()
    );
  
    let avg = 0;
  
    reviews.forEach((rev) => {
      avg += rev.rating;
    });
  
    let ratings = 0;
  
    if (reviews.length === 0) {
      ratings = 0;
    } else {
      ratings = avg / reviews.length;
    }
  
    const numOfReviews = reviews.length;
  
    await Product.findByIdAndUpdate(
      req.query.productId,
      {
        reviews,
        ratings,
        numOfReviews,
      },
      {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      }
    );
  
    res.status(200).json({
      success: true,
    });
  });
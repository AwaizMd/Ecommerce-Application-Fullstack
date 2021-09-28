const { addListener } = require("process");
const Product = require("../models/productModel");

//creating product -- only Admin
exports.createProduct = async (req, res, next) => {
  const product = await Product.create(req.body);

  res.status(201).json({
    success: true,
    product,
  });
};

//Get All products
exports.getAllProducts = async (req, res) => {
  const products = await Product.find();


  res.status(200).json({
    success: true,
    products,
  });
  
};

//Get product Details 
exports.getProductDetails = async(req,res,next)=>{
    const product = await Product.findById(req.params.id);

    if(!product){
        return res.status(500).json({
            success:false,
            message:"Product not found",
            
        })
    }

    res.status(200).json({
        success:true,
        message:"Product details found",
        product
    })
}

//update product -- only Admin
exports.updateProduct = async (req, res, next) => {
  let product = await Product.findById(req.params.id); //let bcz we will be changing it.
  //if product not found
  if (!product) {
    return res.status(500).json({
      success: false,
      message: "Product not found",
    });
  }
  //if product found.
  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators:true,
    useFindAndModify:false
  });

  res.status(200).json({
      success:true,
      product
  })
};


//delete product -- only admin
exports.deleteProduct=async(req,res,next)=>{
    const product = await Product.findById(req.params.id);

    if(!product){
        return res.status(500).json({
            success:false,
            message:"Product not found"
        })
    }

    await product.remove()

    res.status(200).json({
        success:true,
        message:"Product Delete Successfully"
    })
}


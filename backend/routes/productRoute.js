const express=require('express');
const { getAllProducts, createProduct, updateProduct, deleteProduct, getProductDetails } = require('../controllers/productController');

const router=express.Router();

router.route("/products").get(getAllProducts); //getting all products
router.route("/product/new").post(createProduct); //create product -- Admin only
router.route("/product/:id").put(updateProduct).delete(deleteProduct).get(getProductDetails);  //update & delete product -- Admin only


module.exports = router;
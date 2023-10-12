const express = require('express')
const productsContoller = require('../controllers/product.controller')

const router = express.Router();

router.get('/products' , productsContoller.getAllProducts );

router.get('/products/:id' , productsContoller.getProductDetails)

module.exports = router;
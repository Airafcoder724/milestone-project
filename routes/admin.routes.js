const express = require('express')

const admincontroller = require('../controllers/admin.contoller')

const imageUpload = require('../middlewares/image-upload')

const router = express.Router();

router.get('/products' ,admincontroller.getProduts)

router.get('/products/new' , admincontroller.getNewProduts)

router.post('/products' , imageUpload ,admincontroller.createNewProducts)

router.get('/products/:id' , admincontroller.getUpadteProduct )

router.post('/products/:id' , imageUpload ,admincontroller.updateProduct )

router.delete('/products/:id' , admincontroller.deleteProduct)

router.get('/orders',admincontroller.getOrders);

router.patch('/orders/:id' , admincontroller.updateOrder)

module.exports = router;
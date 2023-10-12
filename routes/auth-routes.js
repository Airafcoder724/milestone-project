const express = require('express')

const authController = require('../controllers/auth.controller')

const router = express.Router();

router.get('/' , function(req , res){
    res.render('customer/products/all-products')
})

router.get('/signup' , authController.getSignup)

router.post('/signup' , authController.signup)

router.get('/login' , authController.getLogin)

router.post('/login' , authController.login)

router.post('/logout' , authController.logout)

module.exports = router
// const product = require('../models/product.modal')
// const product = require('../models/product.modal');
const product = require('../models/product.modal');
const Product = require('../models/product.modal');
const Order = require('../models/order.modal');


async function getProducts(req , res , next){

    try {
        const products = await product.findAll();
        res.render('admin/products/all-products' , {products : products})
    } catch (error) {
        next(error)
    }
    
    
}

function getNewProduts(req , res){
    res.render('admin/products/new-products')

}

async function createNewProducts(req , res , next){
    
    const product = new Product({
        ...req.body , 
        image : req.file.filename
    });

    try {
        await product.save()
    } catch (error) {
        next(error)
        return
    }
    

    res.redirect('/admin/products')

}

async function getUpadteProduct(req , res , next){
    try {
        const product = await Product.findById(req.params.id)
        res.render('admin/products/update-product' , {product:product})
    } catch (error) {
        next(error)
    }
}

async function updateProduct(req , res , next){
    console.log("hi")

    const product = new Product({
        ...req.body,
        _id : req.params.id
    })

    console.log(req.params.id);

    if(req.file){
        // replace the new with old one
        product.replaceImage(req.file.filename);
    }

    try {
        await product.save();
    } catch (error) {
        next(error);
        return;
    }

    res.redirect('/admin/products')
}

// async function deleteProduct(req , res , next ) {
//     console.log(req.params.id)
//     let products;
//     try {
//         // const product = await product.findById(req.params.id)
//         products = await Product.findById(req.params.id);
       
//         products.remove(); 
//     } catch (error) {
//         next(error);
//         return
//     }
//     res.json({message:'Deleted product'})
// }


async function deleteProduct(req, res, next) {
    let product;
    try {
      product = await Product.findById(req.params.id);
      await product.remove();
    } catch (error) {
      return next(error);
    }
  
    res.json({ message: 'Deleted product!' });
  }

  async function getOrders(req, res, next) {
    try {
      const orders = await Order.findAll();
      res.render('admin/Orders/admin-orders', {
        orders: orders
      });
    } catch (error) {
      next(error);
    }
  }
  
  async function updateOrder(req, res, next) {
    const orderId = req.params.id;
    const newStatus = req.body.newStatus;
  
    try {
      const order = await Order.findById(orderId);
  
      order.status = newStatus;
  
      await order.save();
  
      res.json({ message: 'Order updated', newStatus: newStatus });
    } catch (error) {
      next(error);
    }
  }

module.exports = {
    getProduts : getProducts,
    getNewProduts : getNewProduts,
    createNewProducts:createNewProducts,
    getUpadteProduct : getUpadteProduct,
    updateProduct : updateProduct,
    deleteProduct : deleteProduct,
    getOrders:getOrders,
    updateOrder:updateOrder
}
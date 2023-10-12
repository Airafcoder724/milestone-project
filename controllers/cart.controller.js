const session = require('express-session');
const Product = require('../models/product.modal')

function getCart(req , res){
    res.render('customer/cart/cart')
}

async function addcartItem(req , res) {
    let product;
    try {
        product = await Product.findById(req.body.productId)

    } catch (error) {
        next(error)
        return ;
    }
    const cart = res.locals.cart
    cart.addItem(product);
    req.session.cart =cart;

    res.status(201).json({
        message : 'Cart updated !',
        newTotalItems :cart.totalQuantity
    });

}

function updateCartItem (req , res) {
    const cart = res.locals.cart;

    const UpdatedItemData = cart.updateItem(req.body.productId , +req.body.quantity)
    req.session.cart = cart;

    res.json({ 
        message : "item updated",
        updatedCartData : {
            newTotalQuantity : cart.totalQuantity,
            newTotalPrice : cart.totalPrice,
            updatedItemPrice : UpdatedItemData.updatedItemPrice
        },
    })
}

module.exports = {
    addcartItem : addcartItem,
    getCart : getCart,
    updateCartItem:updateCartItem
} 
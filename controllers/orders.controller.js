const dotenv = require('dotenv').config()
const stripe = require('stripe')(process.env.STRIPE_ID);
const Order = require('../models/order.modal');
const User = require('../models/user.model');

async function getOrders(req, res , next) {
  try {
    const orders = await Order.findAllForUser(res.locals.uid);
    res.render('customer/orders/all-orders', {
      orders: orders,
    });
  } catch (error) {
    next(error);
  }
}

async function addOrder(req, res, next) {
  const cart = res.locals.cart ;
  let userDocument;
  try {
    userDocument = await User.findById(res.locals.uid);
  } catch (error) {
    return next(error);
  }
  const order = new Order(cart, userDocument);

  try {
    await order.save();
  } catch (error) {
    next(error);
    return;
  }

  req.session.cart = null;

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: cart.items.map(function(item){ 
      return {
        // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
        price_data:{
          currency : 'inr',
          product_data:{
            name:item.product.title,
          },
          unit_amount  : +item.product.price.toFixed(2)*100
        },
        quantity: item.qunatity,
      }
    
    
  }),
    mode: 'payment',
    success_url: `https://e-commarce-project.onrender.com/orders/success`,
    cancel_url: `https://e-commarce-project.onrender.com/orders/cancel`,
  });

  res.redirect(303, session.url);

}

function getSuccess(req , res){
  res.render('customer/orders/success')
}

function getFailuer(req , res){
  res.render('customer/orders/cancel')
}

module.exports = {
  addOrder: addOrder,
  getOrders: getOrders,
  getFailuer:getFailuer,
  getSuccess:getSuccess
};
const path = require('path')

const express = require('express')
const csrf = require('csurf')
const expressSession = require('express-session')
const createSessionConfig = require('./config/session')
const db = require('./data/database')
const addCsrfTokenMiddleware = require('./middlewares/csrf-token')
const errorHandler = require('./middlewares/error-handler')
const checkAuthStatusMiddleware = require('./middlewares/check-auth');
const authRoutes = require('./routes/auth-routes')
const productsRoutes = require('./routes/product.routes')
const baseRoutes = require('./routes/base.routes')
const adminRoutes = require('./routes/admin.routes')
const protectRoutesMiddleware = require('./middlewares/protect-routes')
const cartMiddleWare = require('./middlewares/cart')
const notFoundMiddleware = require('./middlewares/not-found')
const updateCartPricesMiddleWare=require('./middlewares/update-cart-prices')
const cartRoutes = require('./routes/cart.routes')
const ordersRoutes = require('./routes/orders.routes')
const app = express();

app.set('view engine' , 'ejs')
app.set('views' , path.join(__dirname , 'views') )
app.use(express.static('public'))
app.use('/products/assests' ,express.static('products-data'))
app.use(express.urlencoded({extended:false}));
app.use(express.json())
const sessionConfig = createSessionConfig();

app.use(expressSession(sessionConfig));

app.use(csrf());

app.use(cartMiddleWare);
app.use(updateCartPricesMiddleWare)
app.use(addCsrfTokenMiddleware);
app.use(checkAuthStatusMiddleware)

app.use(baseRoutes)
app.use(authRoutes)
app.use(productsRoutes)
app.use('/cart',cartRoutes)


app.use('/orders' , protectRoutesMiddleware ,ordersRoutes)
app.use('/admin', protectRoutesMiddleware ,adminRoutes)

app.use(notFoundMiddleware)
app.use(errorHandler);

db.connectToDatabase().then(function(){
    app.listen(3000 , ()=>{
        console.log('server connected')
    })
}).catch(function(error){
    console.log('failed to connect databse')
    console.log(error)
});




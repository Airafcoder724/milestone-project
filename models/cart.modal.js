const product = require("./product.modal");

class Cart {
    constructor(items = [], totalQuantity = 0, totalPrice = 0) {
        this.items = items;
        this.totalQuantity = totalQuantity;
        this.totalPrice = totalPrice;
    }

    async updatePrices() {
        const productIds = this.items.map(function (item) {
          return item.product.id;
        });
    
        const products = await product.findMultiple(productIds);
    
        const deletableCartItemProductIds = [];
    
        for (const cartItem of this.items) {
          const product = products.find(function (prod) {
            return prod.id === cartItem.product.id;
          });
    
          if (!product) {
            // product was deleted!
            // "schedule" for removal from cart
            deletableCartItemProductIds.push(cartItem.product.id);
            continue;
          }
    
          // product was not deleted
          // set product data and total price to latest price from database
          cartItem.product = product;
          cartItem.totalPrice = cartItem.qunatity * cartItem.product.price;
        }
    
        if (deletableCartItemProductIds.length > 0) {
          this.items = this.items.filter(function (item) {
            return deletableCartItemProductIds.indexOf(item.product.id) < 0;
          });
        }
    
        // re-calculate cart totals
        this.totalQuantity = 0;
        this.totalPrice = 0;
    
        for (const item of this.items) {
          this.totalQuantity = this.totalQuantity + item.qunatity;
          this.totalPrice = this.totalPrice + item.totalPrice;
        }
      }
    

    addItem(product) {
        const cartItem = {
            product: product,
            qunatity: 1,
            totalPrice: product.price
        }

        for (let i = 0; i < this.items.length; i++) {
            const item = this.items[i];
            if (item.product.id === product.id) {
                cartItem.qunatity = +item.qunatity + 1;
                cartItem.totalPrice = item.totalPrice + product.price;
                this.items[i] = cartItem;

                this.totalQuantity++;
                this.totalPrice = this.totalPrice + product.price;
                return;
            }
        }
        this.items.push(cartItem)
        this.totalQuantity++;
        this.totalPrice = this.totalPrice + product.price;
    }

    updateItem(productId, newQuantity) {

        for (let i = 0; i < this.items.length; i++) {
            const item = this.items[i];
            if (item.product.id === productId && newQuantity > 0) {
                const cartItem = { ...item }
                const qunatityChange = newQuantity - item.qunatity
                cartItem.qunatity = newQuantity;
                cartItem.totalPrice = newQuantity * item.product.price;
                this.items[i] = cartItem;

                this.totalQuantity = this.totalQuantity + qunatityChange;
                this.totalPrice += qunatityChange * item.product.price;
                return {updatedItemPrice :cartItem.totalPrice };
            } else if (item.product.id === product.id && newQuantity <= 0) {
                this.items.splice(i , 1)
                this.totalQuantity = this.totalQuantity - item.qunatity;
                this.totalPrice -= item.totalPrice;
                return {updatedItemPrice :0};
                
            }
        }

    }

}


module.exports = Cart;
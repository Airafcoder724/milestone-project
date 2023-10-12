const addToCartElementButton = document.querySelector('#product-details button');
const cartBagdeElemnets = document.querySelectorAll('.nav-items .badge');



async function addToCart(){
    let response ;
    try {
        const productid = addToCartElementButton.dataset.productid;

        const csrfToken = addToCartElementButton.dataset.csrf;
        response = await fetch('/cart/items' , {
            method:'post',
            body : JSON.stringify({
                productId : productid,
                _csrf : csrfToken
            }),
            headers : {
                'Content-Type' : 'application/json'
            }
        })
    } catch (error) {
        alert("something went wrong");
        return;
    }
  

    if(!response.ok){
        alert("something went wrong");
        return;
    }

    const responseData = await response.json()

    const newTotalQuantity = responseData.newTotalItems;
    for(const cartBagdeElemnet of cartBagdeElemnets){
    cartBagdeElemnet.textContent = newTotalQuantity;
    }
}

addToCartElementButton.addEventListener('click' , addToCart)



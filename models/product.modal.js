const mongodb = require('mongodb');

const db = require('../data/database')

class product {
    constructor(productData) {
        this.title = productData.title;
        this.summary = productData.summary;
        this.price = +productData.price;
        this.description = productData.description;
        this.image = productData.image;
       this.updateImageData();
        if(productData._id){
            this.id = productData._id.toString()
        }
        

    }

    static async findAll(){
        const products = await db.getDb().collection('products').find().toArray();

        return products.map(function(productDocument){
            return new product(productDocument);
        });
    }

    static async findById(productId){
        let prodId;
    try {
      prodId = new mongodb.ObjectId(productId);
    } catch (error) {
      error.code = 404;
      throw error;
    }
        const Product = await db.getDb().collection('products').findOne({_id : prodId})

        if(!Product){
            const error = new Error('Could not find product with that id ');
            throw error;
        }
        return new product(Product) ;
    }

   

    updateImageData() {
        this.imagePath = `/products-data/image/${this.image}`;
        this.imageUrl = `/products/assests/image/${this.image}`;
    }

    async save() {
        const productData = {
            title : this.title,
            summary : this.summary,
            price :this.price,
            description : this.description,
            image : this.image 
        }

        if(this.id){
            const prodId = new mongodb.ObjectId(this.id)

            if(!this.image){
                delete productData.image;
            }

            await db.getDb().collection('products').updateOne({_id:prodId} , {
                $set : productData
            })
        }else{
            await db.getDb().collection('products').insertOne(productData)
        }
        
    }

    static async findMultiple(ids) {
        const productIds = ids.map(function(id) {
          return new mongodb.ObjectId(id);
        })
        
        const products = await db
          .getDb()
          .collection('products')
          .find({ _id: { $in: productIds } })
          .toArray();
    
        return products.map(function (productDocument) {
          return new product(productDocument);
        });
      }

    async replaceImage(newImage){
        this.image = newImage;
        this.updateImageData();
    }

    remove(){
        const prodId = new mongodb.ObjectId(this.id)
        return db.getDb().collection('products').deleteOne({ _id : prodId})
    }

    
}

module.exports = product;










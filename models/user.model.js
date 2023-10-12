const bcrypt = require('bcryptjs');
const mongodb = require('mongodb');
const db = require('../data/database')

class User{
    constructor(email , password , fullname , street , postal , city ){
        this.email = email;
        this.password = password;
        this.name = fullname;
        this.street = street;
        this.address = {
            street : street,
            city : city,
            postalcode : postal
        };
    }        

    static async findById(userId) {
        const uid = new mongodb.ObjectId(userId);
        const user = await db.getDb()
        .collection('users')
        .findOne({ _id : uid } , { projection: {password : 0} });
        return user;
    }

    getUserWithSameEmail() {
        return db.getDb().collection('users').findOne({ email:this.email })
    }

    async existsAlready(){
        const existingUser = await this.getUserWithSameEmail();

        if(existingUser){
            return true;
        }
        return false;   
    }

    async signup(){
        const hashedpassword = await bcrypt.hash(this.password , 12);

        await db.getDb().collection('users').insertOne({
            email : this.email,
            password : hashedpassword,
            name : this.name,
            address : this.address
        });
    }

    hasMatchingPassword(hashedpassword){
        return bcrypt.compare(this.password , hashedpassword)
    }

}

module.exports=User;
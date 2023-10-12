const User = require('../models/user.model')
const authUtil = require('../util/authentication')
const userDetail = require('../util/validation')
const sessionFlash = require('../util/session-flash')
function getSignup(req , res){

    let sessionData = sessionFlash.getSessionData(req)

    if(!sessionData){
        sessionData = {
            email : '',
            conformEmail : '',
            password :'',
            fullname :'',
            street :'',
            postal :'',
            city :''
        }
    }

    res.render('customer/auth/signup' , {inputData : sessionData})
}

async function signup(req , res , next){

    const enteredData = {
       email : req.body.email,
       conformEmail : req.body.conformEmail,
       password : req.body.password,
       fullname :  req.body.fullname,
       street : req.body.street,
       postal : req.body.postal,
       city : req.body.city
       
    }
    

    if(!userDetail.userDetailsAreValid(req.body.email,
        req.body.password,
        req.body.fullname,
        req.body.street,
        req.body.city,
        req.body.postal)
        || !userDetail.emailConform(req.body.email , req.body.conformEmail)){
        
            sessionFlash.flashDataToSession(req , {
                errorMessage : 'please check your input  ',
                ...enteredData
            } , function(){
                res.redirect('/signup');
            })
        return;
    }

    

    const user = new User(
        req.body.email,
        req.body.password,
        req.body.fullname,
        req.body.street,
        req.body.city,
        req.body.postal
        );

       

    

    try{
        existsAlready = await user.existsAlready();

        if(existsAlready){
            sessionFlash.flashDataToSession(req , {
                errorMessage : "user exists already ",
                ...enteredData
            } , function(){
                res.redirect('/signup')
            })
           
            return;
        }
        
        await user.signup();
    }catch(error){
        next(error);
        return;
    } 

    res.redirect('/login')
}

function getLogin(req , res , next){
    let sessionData = sessionFlash.getSessionData(req)

    if(!sessionData){
        sessionData = {
            email : '',
            password :''
        }
    }
    res.render('customer/auth/login', {inputData : sessionData})
}

async function login(req , res){
    const user = new User(req.body.email , req.body.password);
    let existingUser;
    try {
         existingUser = await user.getUserWithSameEmail();

    } catch (error) {
        next(error);
        return;
    }

    if(!existingUser) {
        sessionFlash.flashDataToSession(req , {
            errorMessage : "user Not exists Try sign In first ",
            email : user.email,
            password : user.password
        } , function(){
            res.redirect('/login');
        })
        return;
    }

    const passwordIsCorrect = await user.hasMatchingPassword(existingUser.password)

    if(!passwordIsCorrect){
        sessionFlash.flashDataToSession(req , {
            errorMessage : "Password is not matching plz check your password",
            email : user.email,
            password : user.password
        } , function(){
            res.redirect('/login');
        })
        return;
    }

    authUtil.createUserSession(req , existingUser , function(){
        res.redirect('/');
    })

}

function logout(req , res) {
    authUtil.destroyUserAuthSession(req);
    res.redirect('/login')
}

module.exports = {
    getSignup : getSignup,
    getLogin : getLogin,
    signup : signup,
    login : login,
    logout:logout
}


function isEmpty(value){
    return !value || value.trim() === '';
}

function userDetailsAreValid(email, password, name, street, postal, city) {
    return email && email.includes('@') && 
    password && password.trim().length >= 6 &&
    !isEmpty(name) && 
    !isEmpty(street) && 
    !isEmpty(postal) && 
     !isEmpty(city)
}

function emailConform(email , conformEmail){
    return email === conformEmail
}

module.exports ={
    userDetailsAreValid:userDetailsAreValid,
    emailConform : emailConform
} ;


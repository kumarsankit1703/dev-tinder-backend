const validator = require("validator");

const validateUserData = (req) => {
    const { firstName, lastName, email, password } = req.body

    if(!firstName || !lastName){
        throw new Error("First Name and Last Name are required")
    }else if(firstName.length < 3 || firstName.length > 30){
        throw new Error("First Name must be between 3 and 30 characters")
    }else if(!validator.isEmail(email)){
        throw new Error("Email is invalid")
    }else if(!validator.isStrongPassword(password)){
        throw new Error("Password is not strong enough")
    }
}

module.exports = { validateUserData }
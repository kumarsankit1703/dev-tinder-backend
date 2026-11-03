const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    minLength: 3,
    maxLength: 30,
  },
  middleName:{
    type: String
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    lowercase: true,
    trim: true,
    required: true,
    unique: true,
    validate(value) {
      if(!validator.isEmail(value)){
        throw new Error("Email is invalid")
      }
    }
  },
  age: {
    type: Number,
    required: true,
  },
  gender: { 
    type: String,
    required: true,
    validate(value) {
      if(!["Male", "Female", "Other"].includes(value)){
        throw new Error("Gender must be Male, Female or Other")
      }
    }

  },
  password: {       
    type: String,
    required: true,
    validate(value) {
      if(!validator.isStrongPassword(value, {minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1})){
        throw new Error("Password is not strong enough")
      }
    }
  },
  profilePhoto :{
      type: String,
      default: "https://res.cloudinary.com/dxjv7gq3k/image/upload/v1690911680/Dev-Tinder-Backend/Default-Profile-Picture-1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_q6z8qf.png",
      validate(value) {
        if(!validator.isURL(value)){
          throw new Error("Profile Photo must be a valid URL")
        }
      }
    },
  about:{
    type: String,
    default: "Hey there! I am using Dev-Tinder",
  },
  skills:{
    type: [String],
  }
},
{
  timestamps: true,
}
);

module.exports = mongoose.model("User", userSchema);

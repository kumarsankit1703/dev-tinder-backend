const mongoose = require("mongoose");

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
    unique: true
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
  },
  profilePhoto :{
      type: String,
      default: "https://res.cloudinary.com/dxjv7gq3k/image/upload/v1690911680/Dev-Tinder-Backend/Default-Profile-Picture-1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_q6z8qf.png"
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

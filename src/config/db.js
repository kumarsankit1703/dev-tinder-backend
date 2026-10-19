const mongoose = require('mongoose')

const connectDB = async() => {
    await  mongoose.connect("mongodb+srv://qwertysankit_db_user:0UHBca915CNNFdt9@dev-tinder-project.lt7cjmq.mongodb.net/")
}

module.exports = connectDB
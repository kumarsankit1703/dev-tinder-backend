const express = require("express");
const adminAuth = require("./middlewares/auth");
const app = express();
const connectDB = require("./config/db");
const User = require("./models/user");

app.use(express.json());
// Sign-UP User
app.post('/signup', async(req, res) => {
    const newUser = new User(req.body);

    try {
        const savedUser = await newUser.save();
        res.status(200).json(savedUser).send({messge: "User Created Successfully"});
    }catch(err) {
        res.status(400).json(err);
    }
})

// Find User by ID

app.get('/user', async(req, res) => {
    const userName = req.body.firstName

    try{
        const user = await User.findOne({firstName: userName});
        return res.status(200).json(user).send({message: "User Found Successfully"});
    }catch(err) {
        res.status(400).json(err).send({message: "User Not Found"});
    }
})

// Find All Users
app.get('/users', async(req,res)=>{
    try{
        const user = await User.find()
        return res.status(200).json(user).send({message: "Users Found Successfully"});
    }catch(err){
        res.status(400).json(err).send({message: "Something went wrong"})
    }
})

// Delete User by ID
app.delete('/user', async  (req, res) => {
    const userId = req.body.userId;
    try{
        const user = await User.findByIdAndDelete(userId);
        return res.status(200).json(user).send({message: "User Deleted Successfully"});
    }catch(err){
        res.status(400).json(err).send({message: "User Not Found"});
    }
})

// Update User by ID
app.patch('/user', async (req, res) => {
    const userId = req.body.userId;
    const updateData = req.body

    try{
        const user = await User.findByIdAndUpdate(userId, updateData)
        return res.status(200).json(user).send({message : "User Updated Successfully"})
    }catch(err){
        res.status(400).json(err).send({message: "User Not Found"});
    }
})

connectDB().then(() => {
            console.log("DB Connected Successfully");
            app.listen(3000, () => {
            console.log("Server is Running on PORT", 3000);
        });
    }).catch((err) => {
            console.log("DB Connection Failed", err);
});

app.use("/admin", adminAuth);

app.get('/admin/user', (req, res) => {
    res.send("User is on admin/user path")
})

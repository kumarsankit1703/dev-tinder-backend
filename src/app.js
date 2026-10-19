const express = require("express");
const adminAuth = require("./middlewares/auth");
const app = express();
const connectDB = require("./config/db");
const User = require("./models/user");

app.use(express.json());
app.post('/signup', async(req, res) => {
    const newUser = new User(req.body);

    try {
        const savedUser = await newUser.save();
        res.status(200).json(savedUser).send({messge: "User Created Successfully"});
    }catch(err) {
        res.status(400).json(err);
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

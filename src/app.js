const express = require("express");
const adminAuth = require("./middlewares/auth");
const app = express();
const connectDB = require("./config/db");
const User = require("./models/user");
const { validateUserData } = require("./utills/validation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

app.use(express.json());
app.use(cookieParser());
// Sign-UP User
app.post("/signup", async (req, res) => {
  try {
    //  Validate the Req.body User data
    validateUserData(req);

    // Password Hash
    const { password, email, firstName, lastName, gender, age, skills } = req.body;
    const isHashPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: isHashPassword,
      gender,
      age,
      skills
    });

    const saveNewUser = await newUser.save();
    return res
      .status(200)
      .json(saveNewUser)
      .send({ messge: "User Created Successfully" });
  } catch (err) {
    res.status(400).send({ message: "User Not Created", error: err.message });
  }
});

// Login User
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("User Not Found");
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      throw new Error("Password is incorrect");
    }

    if (isPasswordMatch) {
      // Create JWT Token
      const hashJWTtoken = await jwt.sign({userId: user._id}, "#DevUser@123")

      res.cookie(
        "token",
        hashJWTtoken,
      );
      res
        .status(200)
        .json(user)
        .send({ message: "User Logged In Successfully" });
    }
  } catch (err) {
    res.status(400).send({ message: "User Not Found", error: err.message });
  }
});

// Find User by Email
app.get("/user", async (req, res) => {
  const email = req.body.email;

  try {
    const user = await User.findOne({ email });
    const {token} = req.cookies;

    if(!token) {
      throw new Error("Token Not Found");
    }

    const decodeMessage  = await jwt.verify(token, "#DevUser@123");
    console.log("Decoded Message", decodeMessage);
    return res
      .status(200)
      .json(user)
      .send({ message: "User Found Successfully" });
  } catch (err) {
    res.status(400).json(err).send({ message: "User Not Found" });
  }
});

// Find All Users
app.get("/users", async (req, res) => {
  try {
    const user = await User.find();
    return res
      .status(200)
      .json(user)
      .send({ message: "Users Found Successfully" });
  } catch (err) {
    res.status(400).json(err).send({ message: "Something went wrong" });
  }
});

// Delete User by ID
app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  try {
    const user = await User.findByIdAndDelete(userId);
    return res
      .status(200)
      .json(user)
      .send({ message: "User Deleted Successfully" });
  } catch (err) {
    res.status(400).json(err).send({ message: "User Not Found" });
  }
});

// Update User by ID
app.patch("/user/:userId", async (req, res) => {
  const userId = req.params?.userId;
  const updateData = req.body;

  try {
    const ALLOWED_UPDATE = [
      "firstName",
      "middleName",
      "lastName",
      "age",
      "about",
      "skills",
      "gender",
      "profilePhoto",
      "skills",
    ];

    const isValidUpdate = Object.keys(updateData).every((key) =>
      ALLOWED_UPDATE.includes(key),
    );

    if (!isValidUpdate) {
      throw new Error("Invalid Update");
    }
    const uniqueSkills = [...new Set(updateData?.skills)];
    if (uniqueSkills?.length > 10) {
      throw new Error("Skills should not be more than 10");
    }

    const modData = {
      ...updateData,
      skills: uniqueSkills,
    };

    const user = await User.findByIdAndUpdate(userId, modData, {
      runValidators: true,
    });
    return res
      .status(200)
      .json(user)
      .send({ message: "User Updated Successfully" });
  } catch (err) {
    res.status(400).send({ message: "User Not Found", error: err.message });
  }
});

connectDB()
  .then(() => {
    console.log("DB Connected Successfully");
    app.listen(3000, () => {
      console.log("Server is Running on PORT", 3000);
    });
  })
  .catch((err) => {
    console.log("DB Connection Failed", err);
  });

app.use("/admin", adminAuth);

app.get("/admin/user", (req, res) => {
  res.send("User is on admin/user path");
});

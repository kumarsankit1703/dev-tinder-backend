const express = require("express");
const adminAuth = require("./middlewares/auth");
const app = express();
const connectDB = require("./config/db");
const User = require("./models/user");
const { validateUserData } = require("./utills/validation");

app.use(express.json());
// Sign-UP User
app.post("/signup", async (req, res) => {
  const newUser = new User(req.body);

  try {
    //  Validate the Req.body User data
    validateUserData(req);

    // Password Hash
    const { password, email, firstName, lastName } = req.body;
    const isHashPassword = await bcrypt.hash(password, 10);

    const savedUser = await userData.save({
      firstName,
      lastName,
      email,
      password: isHashPassword,
    });
    res
      .status(200)
      .json(savedUser)
      .send({ messge: "User Created Successfully" });
  } catch (err) {
    res.status(400).send({ message: "User Not Created", error: err.message });
  }
});

// Login User
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("User Not Found");
    }
    const isPasswordMatch = await bcrype.compare(password, user.password);
    if (!isPasswordMatch) {
      throw new Error("Password is incorrect");
    }

    res.status(200).json(user).send({ message: "User Logged in Successfully" });
  } catch (err) {
    res.status(400).send({ message: "User Not Found", error: err.message });
  }
});

// Find User by ID
app.get("/user", async (req, res) => {
  const userName = req.body.firstName;

  try {
    const user = await User.findOne({ firstName: userName });
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

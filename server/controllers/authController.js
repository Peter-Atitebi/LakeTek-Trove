const { check, validationResult } = require("express-validator");
const User = require("../models/User");
const Store = require("../models/Store");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const authController = {
  validateRegister: [
    check("name").not().isEmpty().withMessage("Name is required"),
    check("email").not().isEmpty().withMessage("Email is required"),
    check("email").isEmail().withMessage("Email is invalid"),
    check("password").not().isEmpty().withMessage("Password is required"),
    check("password")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters"),
    check("role").not().isEmpty().withMessage("Role is required"),
  ],

  validateLogin: [
    check("email").not().isEmpty().withMessage("Email is required"),
    check("email").isEmail().withMessage("Email is invalid"),
    check("password").not().isEmpty().withMessage("Password is required"),
  ],

  register: async (req, res) => {
    const { name, email, role, password, storeName, description } = req.body;

    if (!name || !email || !role || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide all fields",
      });
    }

    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "User already exists",
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new User({
        name,
        email,
        role,
        password: hashedPassword,
      });

      await newUser.save();

      // ONLY create store for sellers
      if (role === "seller") {
        if (!storeName || !description) {
          return res.status(400).json({
            success: false,
            message: "Store name and description are required for sellers",
          });
        }

        const store = new Store({
          storeName: storeName,
          seller: newUser._id,
          logo: "",
          description: description,
        });

        await store.save();

        // LINK STORE TO USER
        newUser.store = store._id;
        await newUser.save();
      }

      return res.status(201).json({
        success: true,
        message: "User created successfully",
      });
    } catch (error) {
      console.error("Registration error:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  },

  login: async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide all fields",
      });
    }

    try {
      // check if the user exists
      const existingUser = await User.findOne({ email });
      if (!existingUser) {
        return res.status(400).json({
          success: false,
          message: "User does not exist",
        });
      }

      // check if the password is correct
      const isPasswordCorrect = await bcrypt.compare(
        password,
        existingUser.password
      );
      if (!isPasswordCorrect) {
        return res.status(401).json({
          success: false,
          message: "Invalid credentials",
        });
      }

      // GET USER'S STORE IF THEY'RE A SELLER
      let userStore = null;
      if (existingUser.role === "seller") {
        userStore = await Store.findOne({ seller: existingUser._id });
      }

      // create a token with store included
      const token = jwt.sign(
        {
          id: existingUser._id,
          role: existingUser.role,
          store: userStore?._id, // INCLUDE STORE IN TOKEN
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "24h",
        }
      );

      return res.status(200).json({
        user: {
          id: existingUser._id,
          name: existingUser.name,
          email: existingUser.email,
          role: existingUser.role,
          store: userStore?._id, // INCLUDE STORE IN RESPONSE
        },
        token: token,
      });
    } catch (error) {
      console.error("Login error:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  },

  updateUser: async (req, res) => {
    const { name, email, id } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: "Please provide all fields",
      });
    }

    console.log(req.body);

    try {
      // check if the user exists
      const existingUser = await User.findById(req.params.id);
      if (!existingUser) {
        return res.status(400).json({
          success: false,
          message: "User does not exist",
        });
      }

      // update the user
      existingUser.name = name;
      existingUser.email = email;

      // save the user
      await existingUser.save();

      return res.status(200).json({
        success: true,
        message: "User updated successfully",
      });
    } catch (error) {
      console.error("Update user error:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  },
};

module.exports = authController;

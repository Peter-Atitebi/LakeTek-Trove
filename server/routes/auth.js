const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const authenticate = require("../middlewares/authenticate");


router.post(
  "/register",
  authController.validateRegister,
  authController.register
);
router.post("/login", authController.validateLogin, authController.login);
router.patch("/update/:id", authController.updateUser);

module.exports = router;

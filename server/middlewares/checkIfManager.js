const jwt = require("jsonwebtoken");
const User = require("../models/User");

const checkIfManager = async (req, res, next) => {
  // Get the token from the header
  const authHeader = req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Access denied. No token provided.",
    });
  }

  // Remove the "Bearer " prefix from the token string
  const token = authHeader.split(" ")[1];

  try {
    // verification token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);

    if (req.user.role !== "manager") {
      // return error
      return res.status(401).json({
        success: false,
        message: "Access denied. Not a manager",
      });
    }
    // call next middleware
    next();
  } catch (error) {
    // handle error
    return res.status(401).json({
      success: false,
      message: "Something went wrong, from the server",
    });
  }
};

module.exports = checkIfManager;

const express = require("express");
const router = express.Router();
const OrderController = require("../controllers/OrderController");
const checkIfManager = require("../middlewares/checkIfManager");
const authenticate = require("../middlewares/authenticate");

router.use(authenticate);

router.get(
  "/manager",
  authenticate,
  checkIfManager,
  OrderController.managerGetOrders
);

router.get("/customer", authenticate, OrderController.customerGetOrders);
router.get("/seller", authenticate, OrderController.sellerGetOrders);

module.exports = router;

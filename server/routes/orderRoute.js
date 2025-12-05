const express = require("express");
const router = express.Router();
const OrderController = require("../controllers/OrderController");
const checkIfManager = require("../middlewares/checkIfManager");
const authenticate = require("../middlewares/authenticate");

router.use(authenticate);

router.get("/manager/orders", authenticate, checkIfManager, OrderController.managerGetOrders);
router.get("/seller/orders", authenticate, OrderController.sellerGetOrders);
router.get("/customer/orders", authenticate, OrderController.customerGetOrders);

router.post("/create-order", OrderController.createOrder);
router.get("/order/:orderId", OrderController.getOrder);
router.put("/order/:orderId", OrderController.updateOrder);
router.delete("/order/:orderId", OrderController.deleteOrder);

module.exports = router;

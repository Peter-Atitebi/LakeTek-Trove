const OrderController = {
  managerGetOrders: (req, res) => {
    res.status(200).json([]);
  },

  sellerGetOrders: (req, res) => {
    res.status(200).json([]);
  },

  customerGetOrders: (req, res) => {
    res.status(200).json([]);
  },
};

module.exports = OrderController;

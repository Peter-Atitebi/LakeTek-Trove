const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const sellerOrderSchema = new Schema({
  transaction: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Payment Transaction",
    required: true,
  },
  store: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Store",
    required: true,
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  salesPrice: { type: Number, required: true, min: 0 },
  commission: { type: Number, required: true, min: 0 },
  paymentStatus: {
    type: String,
    enum: ["pending", "completed", "failed", "refunded"],
    default: "pending",
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
});

const SellerOrder = mongoose.model("SellerOrder", sellerOrderSchema);

module.exports = SellerOrder;

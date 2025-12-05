const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const paymentTransactionSchema = new Schema({
  order: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Order",
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Product",
  },
  salesPrice: { type: Number, required: true, min: 0 },
  commission: { type: Number, required: true, min: 0 },
  paymentDate: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["pending", "completed", "failed", "refunded"],
    default: "pending",
  },
  notes: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
});

paymentTransactionSchema.statics.createTransaction = async function (
  order,
  seller,
  buyer,
  product,
  salesPrice,
  commission,
  status = "pending",
  notes = ""
) {
  try {
    const transaction = new this({
      order,
      seller,
      buyer,
      product,
      salesPrice,
      commission,
      status,
      notes,
    });

    return await transaction.save();
  } catch (error) {
    console.error("Error creating payment transaction:", error);
    throw new Error("Error creating payment transaction: " + error.message);
  }
};

const PaymentTransaction = mongoose.model(
  "PaymentTransaction",
  paymentTransactionSchema
);

module.exports = PaymentTransaction;

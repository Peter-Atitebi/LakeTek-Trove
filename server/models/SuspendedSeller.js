const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const suspendedSellerSchema = new Schema({
  seller: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  suspensionReason: {
    type: String,
    required: true,
  },
  suspensionDate: {
    type: Date,
    default: Date.now,
  },
  duration: {
    type: Number,
    required: false,
  },
  suspensionEndDate: {
    type: Date,
    required: false,
  },
});

const SuspendedSeller = mongoose.model(
  "SuspendedSeller",
  suspendedSellerSchema
);

module.exports = SuspendedSeller;

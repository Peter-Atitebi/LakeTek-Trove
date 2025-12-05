const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const shippingAddressSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: false,
  },
  postalCode: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  zipCode: {
    type: String,
    required: false,
  },
  pinCode: {
    type: String,
    required: false,
  },
},
{ timestamps: true }
);

const ShippingAddress = mongoose.model("ShippingAddress", shippingAddressSchema);

module.exports = ShippingAddress;
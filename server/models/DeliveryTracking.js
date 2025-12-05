const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const DeliveryTrackingSchema = new Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "shipped", "in_transit", "delivered", "cancelled"],
      default: "pending",
      required: true,
    },

    estimatedDeliveryDate: {
      type: Date,
      required: true,
      validate: {
        validator: function (date) {
          return date >= new Date().setHours(0, 0, 0, 0);
        },
        message: "Estimated delivery date must be in the future.",
      },
    },
    notes: {
      type: String,
      default: "",
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },

  { timestamps: true }
);

const DeliveryTracking = mongoose.model(
  "DeliveryTracking",
  DeliveryTrackingSchema
);

module.exports = DeliveryTracking;

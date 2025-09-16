const mongoose = require("mongoose");

const storeSchema = new mongoose.Schema({
  storeName: {
    type: String,
    required: true,
    unique: true,
    minlength: 3,
    maxlength: 50,
    match: [
      /^[a-zA-Z0-9 _-]+$/,
      "Store name can only contain letters, numbers, spaces, underscores and hyphens",
    ],
    set: function (value) {
      return value.replace(/\s+/g, " ").trim();
    },
    validate: {
      validator: function (v) {
        // Ensure no leading/trailing spaces and no multiple spaces remain
        return v === v.trim() && !/\s{2,}/.test(v);
      },
      message: "Store name cannot have multiple consecutive spaces",
    },
  },

  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  logo: {
    type: String,
    required: false,
  },
  description: {
    type: String,
    required: false,
  },
  categories: {
    type: [String],
    required: false,
  },
  performance: {
    type: Map,
    required: false,
    of: Number,
    default: {},
  },
  scores: {
    // ratings from admin out of 100
    type: Number,
    min: 0,
    max: 100,
    default: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Before saving, check for similar names
storeSchema.pre('save', async function() {
  if (this.isNew || this.isModified('storeName')) {
    const existing = await this.constructor.findOne({
      storeName: new RegExp(`^${this.storeName}$`, 'i') // Case-insensitive check
    });
    if (existing && !existing._id.equals(this._id)) {
      throw new Error('Store name already exists');
    }
  }
});



// exports
module.exports = mongoose.model("Store", storeSchema);

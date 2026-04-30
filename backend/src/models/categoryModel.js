const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    type: { type: String, required: true, enum: ["income", "expense"] },
    description: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Compound unique index: name + type should be unique together
categorySchema.index({ name: 1, type: 1 }, { unique: true });

module.exports = mongoose.model("Category", categorySchema);

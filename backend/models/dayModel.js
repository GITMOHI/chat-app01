const mongoose = require("mongoose");

const reactionSchema = mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    type: { type: String, enum: ["like", "love", "angry", "care"], required: true }
  },
  { _id: false }  // Prevent creation of an automatic _id for subdocuments
);

const daySchema = mongoose.Schema(
  {
    imageUrl: { type: String, trim: true },
    createdAt: { type: Date, default: Date.now, expires: '24h' },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    reactions: [reactionSchema]
  },
  { timestamps: true }
);

const Day = mongoose.model("Day", daySchema);

module.exports = Day;

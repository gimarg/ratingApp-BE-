const mongoose = require("mongoose");

const VoteSchema = new mongoose.Schema({
  entryId: { type: mongoose.Schema.Types.ObjectId, ref: "Entry" },
  score: { type: Number, min: 0, max: 10 },
  playerId: String,
  comment: { type: String },
});

module.exports = mongoose.model("Vote", VoteSchema);

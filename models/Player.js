const mongoose = require("mongoose");

const PlayerSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  playerId: { type: String, required: true },
});

module.exports = mongoose.model("Player", PlayerSchema);

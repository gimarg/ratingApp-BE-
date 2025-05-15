const mongoose = require("mongoose");

const BoardSchema = new mongoose.Schema({
  name: String,
  alias: { type: String, unique: true }, // add this
  entries: [{ type: mongoose.Schema.Types.ObjectId, ref: "Entry" }],
});

module.exports = mongoose.model("Board", BoardSchema);

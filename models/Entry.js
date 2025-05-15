const mongoose = require("mongoose");

const EntrySchema = new mongoose.Schema({
  boardId: { type: mongoose.Schema.Types.ObjectId, ref: "Board" },
  title: String,
});

module.exports = mongoose.model("Entry", EntrySchema);

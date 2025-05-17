const Vote = require("../models/Vote");
const Board = require("../models/Board");

exports.getVotesByPlayerAndBoard = async (req, res) => {
  const { playerId, alias } = req.params;
  console.log("API HIT: /votes/player/:playerId/board/:alias");

  const board = await Board.findOne({ alias }).populate("entries");
  if (!board) return res.status(404).json({ message: "Board not found" });

  const entryIds = board.entries.map((e) => e._id);
  const votes = await Vote.find({ playerId, entryId: { $in: entryIds } });

  const response = board.entries.map((entry) => {
    const vote = votes.find((v) => v.entryId.equals(entry._id));
    return {
      title: entry.title,
      score: vote?.score ?? null,
      comment: vote?.comment ?? "", // ← Add this
    };
  });
  res.json(response);
};

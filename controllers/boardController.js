const Entry = require("../models/Entry");
const Board = require("../models/Board");
const Vote = require("../models/Vote");

exports.getBoardWithVotes = async (req, res) => {
  const boardId = req.params.boardId;

  const entries = await Entry.find({ boardId });

  const entriesWithScores = await Promise.all(
    entries.map(async (entry) => {
      const votes = await Vote.find({ entryId: entry._id });
      const avg =
        votes.length > 0
          ? votes.reduce((acc, v) => acc + v.score, 0) / votes.length
          : 0;

      return {
        id: entry._id,
        title: entry.title,
        averageScore: avg.toFixed(2),
        totalVotes: votes.length,
      };
    })
  );

  res.json({
    boardId,
    entries: entriesWithScores,
  });
};

exports.getBoardWithEntries = async (req, res) => {
  const board = await Board.findById(req.params.boardId).populate("entries");

  const entriesWithAvg = await Promise.all(
    board.entries.map(async (entry) => {
      const votes = await Vote.find({ entryId: entry._id });
      const avg =
        votes.length > 0
          ? votes.reduce((acc, v) => acc + v.score, 0) / votes.length
          : null;

      return {
        _id: entry._id,
        title: entry.title,
        averageScore: avg !== null ? avg.toFixed(2) : "No votes yet",
      };
    })
  );

  res.json({ name: board.name, entries: entriesWithAvg });
};

exports.voteEntry = async (req, res) => {
  const { entryId, score, playerId, comment } = req.body; // ← Add comment

  let vote = await Vote.findOne({ entryId, playerId });

  if (vote) {
    vote.score = score;

    if (
      comment !== undefined ||
      (typeof comment === "string" && comment.trim() !== "")
    ) {
      vote.comment = comment;
    }

    await vote.save();
    return res.json({ message: "Vote updated", vote });
  }

  vote = new Vote({ entryId, score, playerId, comment }); // ← Include comment
  await vote.save();

  res.json({ message: "Vote submitted", vote });
};

exports.createBoard = async (req, res) => {
  const { name, alias } = req.body;

  const exists = await Board.findOne({ alias });
  if (exists) return res.status(400).json({ message: "Alias already used" });

  const board = new Board({ name, alias });
  await board.save();
  res.json(board);
};

exports.getBoardByAlias = async (req, res) => {
  const alias = req.params.alias;

  const board = await Board.findOne({ alias }).populate("entries");
  if (!board) return res.status(404).json({ message: "Board not found" });

  const entriesWithAvg = await Promise.all(
    board.entries.map(async (entry) => {
      const votes = await Vote.find({ entryId: entry._id });
      const avg =
        votes.length > 0
          ? votes.reduce((acc, v) => acc + v.score, 0) / votes.length
          : null;

      return {
        _id: entry._id,
        title: entry.title,
        averageScore: avg !== null ? avg.toFixed(2) : "No votes yet",
      };
    })
  );

  res.json({
    boardId: board._id,
    name: board.name,
    entries: entriesWithAvg,
  });
};

exports.addEntry = async (req, res) => {
  const { boardId } = req.params;
  const { title } = req.body;

  const entry = new Entry({ boardId, title });
  await entry.save();

  await Board.findByIdAndUpdate(boardId, {
    $push: { entries: entry._id },
  });

  res.json(entry);
};

exports.getVoteByEntryAndPlayer = async (req, res) => {
  const { entryId, playerId } = req.params;

  try {
    const vote = await Vote.findOne({ entryId, playerId });
    res.json(vote);
  } catch (err) {
    res.status(500).json({ message: "Error fetching vote", error: err });
  }
};

exports.deleteBoardByAlias = async (req, res) => {
  try {
    const board = await Board.findOne({ alias: req.params.alias });
    if (!board) return res.status(404).json({ message: "Board not found" });

    const entries = await Entry.find({ boardId: board._id });

    // Delete votes for each entry
    for (const entry of entries) {
      await Vote.deleteMany({ entryId: entry._id });
    }

    await Entry.deleteMany({ boardId: board._id });
    await Board.deleteOne({ _id: board._id });

    res.json({ message: "Board deleted successfully" });
  } catch (err) {
    console.log("Delete error:", err.response?.data || err.message);
    res.status(500).json({ message: "Error deleting board", error: err });
  }
};

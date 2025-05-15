const express = require("express");
const router = express.Router();
const {
  createBoard,
  addEntry,
  getBoardWithEntries,
  voteEntry,
  getBoardWithVotes,
  getBoardByAlias,
  getVoteByEntryAndPlayer,
  deleteBoardByAlias,
} = require("../controllers/boardController");

router.get("/alias/:alias", getBoardByAlias);
router.get("/votes/:entryId/:playerId", getVoteByEntryAndPlayer);

router.post("/", createBoard);
router.post("/:boardId/entries", addEntry);
router.get("/:boardId", getBoardWithEntries);
router.get("/:boardId/votes", getBoardWithVotes);
router.post("/vote", voteEntry);

router.delete("/alias/:alias", deleteBoardByAlias);

module.exports = router;

const express = require("express");
const router = express.Router();
const { getVotesByPlayerAndBoard } = require("../controllers/voteController");

router.get("/player/:playerId/board/:alias", getVotesByPlayerAndBoard);

module.exports = router;

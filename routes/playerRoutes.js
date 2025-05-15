const express = require("express");
const router = express.Router();
const { loginPlayerByName } = require("../controllers/playerController");

router.post("/login", loginPlayerByName);

module.exports = router;

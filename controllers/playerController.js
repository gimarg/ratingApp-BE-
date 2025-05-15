const Player = require("../models/Player");
const { v4: uuidv4 } = require("uuid");

exports.loginPlayerByName = async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ message: "Name is required" });

  let player = await Player.findOne({ name });

  if (!player) {
    const newId = uuidv4();
    player = new Player({ name, playerId: newId });
    await player.save();
  }

  res.json({ playerId: player.playerId, name: player.name });
};

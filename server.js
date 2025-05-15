const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const boardRoutes = require("./routes/boardRoutes");
const voteRoutes = require("./routes/voteRoutes");
const playerRoutes = require("./routes/playerRoutes");
const PORT = process.env.PORT || 5000;

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/boards", boardRoutes);
app.use("/api/votes", voteRoutes);
app.use("/api/players", playerRoutes);

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error("MongoDB connection failed:", err));

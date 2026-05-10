const mongoose = require("mongoose");

const tvShowSchema = new mongoose.Schema({
  title: String,
  description: String
});

module.exports = mongoose.model("TVShow", tvShowSchema);
const mongoose = require("mongoose");

const FareSchema = mongoose.Schema({
  destination: String,
  fare: Number,
});

module.exports = mongoose.model("Fare", FareSchema);

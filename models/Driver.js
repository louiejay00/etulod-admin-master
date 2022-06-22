const mongoose = require("mongoose");

const DriverSchema = new mongoose.Schema({
  drivername: String,
  driveraddress: String,
  platenumber: String,
  drivercpnum: String,
  ordernumber: Number,
});

module.exports = {
  default: mongoose.model("Driver", DriverSchema),
  driverSchema: DriverSchema
}
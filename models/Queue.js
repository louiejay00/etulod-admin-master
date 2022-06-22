const mongoose = require("mongoose");

const QueueSchema = new mongoose.Schema({
  drivername: String,
  driveraddress: String,
  platenumber: String,
  drivercpnum: String,
  ordernumber: Number,
});

module.exports = {
  default: mongoose.model("Queue", QueueSchema),
  queueSchema: QueueSchema,
};

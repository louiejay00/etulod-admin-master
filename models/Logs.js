const mongoose = require("mongoose");
const QueueStatus = Object.freeze({
  BOOKED: "BOOKED",
  CANCELLED: "CANCELLED",
  REJECTED: "REJECTED",
  ARRIVED: "ARRIVED",
  ENDTRIP: "ENDTRIP",
});
const { processSchema } = require("./Process");
const { queueSchema } = require("./Queue");
const { driverSchema } = require("./Driver");

const LogsSchema = mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
  process: processSchema,
  queue: queueSchema,
  drivername: driverSchema,
  status: Object.keys(QueueStatus),
});

module.exports = {
  default: mongoose.model("Logs", LogsSchema),
  QueueStatus: QueueStatus,
  logschema: LogsSchema,
};

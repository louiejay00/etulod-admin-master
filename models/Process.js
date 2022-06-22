const mongoose = require('mongoose')

const ProcessSchema = new mongoose.Schema(
  {
    passengerName: String,
    passengerEmail: String,
    driverName: String,
    destination: String,
    location: String,
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    cpnum: Number,
    NoOfPassengers: Number,
    status: {
      type: String,
      enum: ['COMPLETE', 'CANCELLED', 'REJECTED', 'ONGOING'],
      default: 'ONGOING',
    },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  }
)

module.exports = {
  default: mongoose.model('Process', ProcessSchema),
  processSchema: ProcessSchema,
}

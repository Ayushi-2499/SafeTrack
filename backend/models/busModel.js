const mongoose = require('mongoose');

const busSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    busNumber: {
      type: String,
      required: [true, 'Please add a bus number'],
      unique: true,
    },
    driverName: {
      type: String,
      required: [true, 'Please add a driver name'],
    },
    route: {
      type: String,
      required: [true, 'Please add the bus route'],
    },
    maxSpeed: {
      type: Number,
      required: true,
      default: 50,
    },
    maxCapacity: {
      type: Number,
      required: true,
      default: 45,
    },
    currentSpeed: {
      type: Number,
      required: true,
      default: 0,
    },
    currentOccupancy: {
      type: Number,
      required: true,
      default: 0,
    },
    isOverSpeeding: {
      type: Boolean,
      default: false,
    },
    isOverCapacity: {
      type: Boolean,
      default: false,
    },
    latitude: {
      type: Number,
      default: 22.7196, 
    },
    longitude: {
      type: Number,
      default: 75.8577, 
    },
    assignedTo: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model('Bus', busSchema);
const asyncHandler = require('express-async-handler');
const Bus = require('../models/busModel');
const User = require('../models/userModel');

// @desc    Get buses based on user role
// @route   GET /api/buses
// @access  Private
const getBuses = asyncHandler(async (req, res) => {
  let buses;

  if (req.user.role === 'admin') {
    buses = await Bus.find({ user: req.user.id }).populate('assignedTo', 'name email');
  } else {
    buses = await Bus.find({ assignedTo: req.user.id });
  }

  res.status(200).json(buses);
});

// @desc    Create a new bus
// @route   POST /api/buses
// @access  Private (Admin only)
const createBus = asyncHandler(async (req, res) => {
  const { busNumber, driverName, route } = req.body;

  if (!busNumber || !driverName || !route) {
    res.status(400);
    throw new Error('Please add all fields');
  }

  const bus = await Bus.create({
    busNumber,
    driverName,
    route,
    user: req.user.id,
  });
  
  // === CHANGES HAVE BEEN MADE HERE ===
  // After creating a new bus, send the response along with user details
  const populatedBus = await Bus.findById(bus._id).populate('assignedTo', 'name email');

  res.status(201).json(populatedBus);
});

// @desc    Update a bus
// @route   PUT /api/buses/:id
// @access  Private (Admin only)
const updateBus = asyncHandler(async (req, res) => {
  const bus = await Bus.findById(req.params.id);

  if (!bus) {
    res.status(404);
    throw new Error('Bus not found');
  }

  if (bus.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error('User not authorized');
  }

  const dataToUpdate = { ...req.body };
  
  // Alert logic has been added back
  const newSpeed = dataToUpdate.currentSpeed;
  if (newSpeed !== undefined) {
    dataToUpdate.isOverSpeeding = newSpeed > bus.maxSpeed;
    if (dataToUpdate.isOverSpeeding) {
        console.log(`ALERT: Bus ${bus.busNumber} is OVER-SPEEDING!`);
    }
  }

  const newOccupancy = dataToUpdate.currentOccupancy;
  if (newOccupancy !== undefined) {
    dataToUpdate.isOverCapacity = newOccupancy > bus.maxCapacity;
    if (dataToUpdate.isOverCapacity) {
        console.log(`ALERT: Bus ${bus.busNumber} is OVER-CAPACITY!`);
    }
  }
  
  // === CHANGES HAVE BEEN MADE HERE ===
  // After updating, send the response along with user details
  const updatedBus = await Bus.findByIdAndUpdate(req.params.id, dataToUpdate, {
    new: true,
  }).populate('assignedTo', 'name email');

  res.status(200).json(updatedBus);
});

// @desc    Delete a bus
// @route   DELETE /api/buses/:id
// @access  Private (Admin only)
const deleteBus = asyncHandler(async (req, res) => {
  const bus = await Bus.findById(req.params.id);

  if (!bus) {
    res.status(404);
    throw new Error('Bus not found');
  }

  if (bus.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error('User not authorized');
  }

  await bus.deleteOne();

  res.status(200).json({ id: req.params.id, message: 'Bus deleted successfully' });
});


// @desc    Assign a user to a bus
// @route   PUT /api/buses/assign/:id
// @access  Private (Admin only)
const assignBusToUser = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  
  const updatedBus = await Bus.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { assignedTo: userId } },
    { new: true }
  ).populate('assignedTo', 'name email'); 

  res.status(200).json(updatedBus);
});

// @desc    Unassign a user from a bus
// @route   PUT /api/buses/unassign/:id
// @access  Private (Admin only)
const unassignBusFromUser = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  
  const updatedBus = await Bus.findByIdAndUpdate(
    req.params.id,
    { $pull: { assignedTo: userId } },
    { new: true }
  ).populate('assignedTo', 'name email'); 

  res.status(200).json(updatedBus);
});

module.exports = {
  getBuses,
  createBus,
  updateBus,
  deleteBus,
  assignBusToUser,
  unassignBusFromUser,
};
const express = require('express');
const router = express.Router();
const {
  getBuses,
  createBus,
  updateBus,
  deleteBus,
  assignBusToUser,
  unassignBusFromUser, // 1. Import the new function
} = require('../controllers/busController');
const { protect, admin } = require('../middleware/authMiddleware');

// GET all buses (for parents) & POST a new bus (for admin)
router.route('/').get(protect, getBuses).post(protect, admin, createBus);

// PUT (update) and DELETE a specific bus (for admin)
router.route('/:id').put(protect, admin, updateBus).delete(protect, admin, deleteBus);

// PUT route to assign a user to a specific bus (for admin)
router.route('/assign/:id').put(protect, admin, assignBusToUser);

// === THIS NEW ROUTE HAS BEEN ADDED ===
// PUT route to unassign a user from a specific bus (for admin)
router.route('/unassign/:id').put(protect, admin, unassignBusFromUser); // 2. Create the new route

module.exports = router;
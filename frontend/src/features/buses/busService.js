import axios from 'axios';

const API_URL = 'https://safetrack-1.onrender.com/api/buses/';

// Create new bus
const createBus = async (busData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.post(API_URL, busData, config);
  return response.data;
};

// Get user buses
const getBuses = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.get(API_URL, config);
  return response.data;
};

// Update a bus
const updateBus = async (busId, busData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.put(API_URL + busId, busData, config);
  return response.data;
};

// Delete a bus
const deleteBus = async (busId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.delete(API_URL + busId, config);
  return response.data;
};

// Function to assign a user to a bus
const assignUserToBus = async (busId, userId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.put(
    API_URL + 'assign/' + busId,
    { userId }, // Send userId in the body
    config
  );
  return response.data;
};

// === THIS NEW FUNCTION HAS BEEN ADDED ===
// Function to unassign (remove) a user from a bus
const unassignUserFromBus = async (busId, userId, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    // Call the new backend route '/api/buses/unassign/:id'
    const response = await axios.put(
        API_URL + 'unassign/' + busId,
        { userId }, // Send userId in the body
        config
    );
    return response.data;
};


const busService = {
  createBus,
  getBuses,
  updateBus,
  deleteBus,
  assignUserToBus,
  unassignUserFromBus, // Export the new function here
};

export default busService;
import axios from 'axios';

// === CHANGES HAVE BEEN MADE HERE ===
// Add the full URL, exactly like busService.js
const API_URL = 'http://localhost:5000/api/users/';

// Function for admin to get all users
const getAllUsers = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  // API_URL is now correct
  const response = await axios.get(API_URL, config);
  return response.data;
};

// Export all functions inside an object
const userService = {
  getAllUsers,
};

export default userService;
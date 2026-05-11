import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  // Check whether the user exists in local storage or not (whether logged in or not)
  const user = JSON.parse(localStorage.getItem('user'));

  if (user) {
    // If the user is logged in, allow access to the page they want to visit
    return children;
  }

  // If the user is not logged in, forcefully redirect them to the '/login' page
  return <Navigate to="/login" />;
};

export default PrivateRoute;
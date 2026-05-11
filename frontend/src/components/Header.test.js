import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Header from './Header';

// Test suite (group of tests) for the Header component
describe('Header Component', () => {

  // Test Case 1: When the user is NOT logged in
  test('should render Login and Register links when user is not logged in', () => {
    // 1. Render the Header component
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );

    // 2. Check whether the 'Login' link is visible on the screen
    const loginLink = screen.getByText(/login/i);
    expect(loginLink).toBeInTheDocument();

    // 3. Check whether the 'Register' link is visible on the screen
    const registerLink = screen.getByText(/register/i);
    expect(registerLink).toBeInTheDocument();
  });

  // Test Case 2: When the user IS logged in
  test('should render Logout button when user is logged in', () => {
    // 1. Create mock user data and store it in localStorage
    const mockUser = { name: 'Ayushi', email: 'ayushi@test.com', token: '123' };
    localStorage.setItem('user', JSON.stringify(mockUser));

    // 2. Render the Header component
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );

    // 3. Check whether the 'Logout' button is visible on the screen
    const logoutButton = screen.getByText(/logout/i);
    expect(logoutButton).toBeInTheDocument();

    // 4. Also check that the 'Login' link is NOT visible on the screen anymore
    const loginLink = screen.queryByText(/login/i);
    expect(loginLink).not.toBeInTheDocument();

    // Cleanup: Clear localStorage after the test
    localStorage.removeItem('user');
  });

});
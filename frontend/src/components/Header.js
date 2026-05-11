import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../features/auth/authService';
import logo from '../assets/ST.png';

function Header() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const onLogout = () => {
    authService.logout();
    navigate('/');
  };

  return (
    <header className="header">
      <div className="logo">
        <Link to="/">
          <img src={logo} alt="SafeTrack Logo" />
          <span>SafeTrack</span>
        </Link>
      </div>
      <ul>
        {user ? (
          <li>
            {/* Added the 'btn-primary' class here */}
            <button className="btn btn-primary" onClick={onLogout}>
              Logout
            </button>
          </li>
        ) : (
          <>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/register">Register</Link>
            </li>
          </>
        )}
      </ul>
    </header>
  );
}

export default Header;
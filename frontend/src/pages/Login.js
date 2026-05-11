import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../features/auth/authService';
import authBgImage from '../assets/SafeTrack_Bus.jpg';

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const { email, password } = formData;

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const userData = { email, password };
    try {
      const user = await authService.login(userData);
      toast.success(`Welcome back, ${user.name}!`);
      navigate('/dashboard'); // Dashboard par redirect
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      toast.error(message);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-bg" style={{ backgroundImage: `url(${authBgImage})` }}>
        <div className="auth-bg-overlay"></div>
        <div className="auth-bg-content">
          <h2>Your Peace of Mind, <br /> Our Priority.</h2>
          <p>Real-time tracking for a safer tomorrow.</p>
          <div className="features-preview">
            <div className="feature-preview-item">
              <span>Real-time Alerts</span>
            </div>
            <div className="feature-preview-item">
              <span>Live Monitoring</span>
            </div>
            <div className="feature-preview-item">
              <span>Secure & Reliable</span>
            </div>
          </div>
        </div>
      </div>
      <div className="auth-form-container">
        <div className="form-container">
          <h1>Welcome Back!</h1>
          <p>Login to your SafeTrack account</p>
          <form onSubmit={onSubmit}>
            <div className="form-group">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={onChange}
                placeholder="Email Address"
                required
              />
            </div>
            <div className="form-group">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={onChange}
                placeholder="Password"
                required
              />
            </div>
            <div className="form-group">
              <button type="submit" className="btn btn-primary btn-block">
                Login
              </button>
            </div>
          </form>
           <p className="auth-switch">
            Don't have an account? <Link to="/register">Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;


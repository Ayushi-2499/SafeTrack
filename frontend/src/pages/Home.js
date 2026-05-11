import React from 'react';
import { Link } from 'react-router-dom';
import homeHeroImage from '../assets/hero-1bg.png'; // 1. Imported your new image

function Home() {
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <>
      {/* 2. Applied the image here using inline style */}
      <section className="hero-banner" style={{ backgroundImage: `url(${homeHeroImage})` }}>
        <div className="hero-content">
          <h1 className="hero-title">
            Smart, Safe, and Secure Tracking at Your Fingertips.
          </h1>
          <p className="hero-subtitle">
            Welcome to SafeTrack. Real-time monitoring and intelligent alerts to
            ensure the safety of your loved ones.
          </p>
          {user ? (
             <Link to="/dashboard" className="btn btn-primary">
              Go to Dashboard
            </Link>
          ) : (
            <Link to="/register" className="btn btn-primary">
              Get Started for Free
            </Link>
          )}
        </div>
      </section>

      <div className="container">
        <section className="features-section">
          <h2 className="section-title">Why Choose SafeTrack?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <h3>Real-Time Alerts</h3>
              <p>Get instant notifications for over-speeding and over-capacity situations.</p>
            </div>
            <div className="feature-card">
              <h3>Live Monitoring</h3>
              <p>Track vehicles on a live map with precise location data.</p>
            </div>
            <div className="feature-card">
              <h3>Secure & Reliable</h3>
              <p>Built with modern technology to ensure your data is always safe.</p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export default Home;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './user.css'
import GoogalLogo from './img/glogo.png'

function UserLogin() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isAnimated, setIsAnimated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsAnimated(true);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Login attempt:', formData);
    try {
      const response = await fetch('http://localhost:8080/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('userID', data.id); // Save user ID in local storage
        alert('Login successful!');
        navigate('/allPost');
      } else if (response.status === 401) {
        alert('Invalid credentials!');
      } else {
        alert('Failed to login!');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="modern-container" style={{ background: 'linear-gradient(45deg, #4CAF50 0%, #388E3C 100%)' }}>
      <div className="background-shapes">
        <div className="bg-shape shape-circle" style={{ background: 'rgba(249, 251, 231, 0.1)' }}></div>
        <div className="bg-shape shape-donut" style={{ border: '60px solid rgba(197, 225, 165, 0.1)' }}></div>
        <div className="bg-shape shape-square" style={{ background: 'rgba(249, 251, 231, 0.1)' }}></div>
      </div>
      
      <div className={`glass-card ${isAnimated ? 'fade-in' : ''}`} style={{ 
        background: 'rgba(249, 251, 231, 0.15)',
        borderColor: 'rgba(197, 225, 165, 0.3)'
      }}>
        <div className="card-left" style={{ background: 'rgba(141, 110, 99, 0.1)' }}>
          <div className="brand-section">
            <div className="logo-container" style={{ background: '#F9FBE7' }}>
              <div className="logo-icon" style={{ color: '#4CAF50' }}>S</div>
            </div>
            <h2 className="brand-name" style={{ color: '#F9FBE7' }}>SproutHUB</h2>
          </div>
          <div 
            className="welcome-image"
            style={{
              background: "url('https://images.unsplash.com/photo-1589496933738-f5c27bc146e3?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D') no-repeat center",
              backgroundSize: "cover"
            }}
          ></div>
          <div className="welcome-text">
            <h3 style={{ color: '#F9FBE7' }}>Welcome Back</h3>
            <p style={{ color: 'rgba(249, 251, 231, 0.8)' }}>Share recipes, tips, and culinary inspirations</p>
          </div>
        </div>
        
        <div className="card-right">
          <div className="login-header">
            <h2 style={{ color: '#F9FBE7' }}>Sign In</h2>
            <p style={{ color: 'rgba(249, 251, 231, 0.7)' }}>Please sign in to continue to SproutHUB</p>
          </div>
          
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <div className="input-container">
                <i className="input-icon email-icon">✉️</i>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="modern-input"
                  placeholder="your@email.com"
                />
              </div>
            </div>
            
            <div className="form-group">
              <div className="password-label-group">
                <label htmlFor="password">Password</label>
                <a href="#" className="forgot-link">Forgot?</a>
              </div>
              <div className="input-container">
                <i className="input-icon password-icon">🔒</i>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className="modern-input"
                  placeholder="••••••••"
                />
              </div>
            </div>
            
            <div className="form-actions">
              <button type="submit" className="signin-button" style={{
                backgroundColor: '#4CAF50',
                ':hover': { backgroundColor: '#388E3C' }
              }}>
                Sign In
              </button>
              
              <div className="separator">
                <span style={{ color: '#8D6E63' }}>OR</span>
              </div>
              
              <button
                type="button"
                onClick={() => window.location.href = 'http://localhost:8080/oauth2/authorization/google'}
                className="google-button"
                style={{
                  borderColor: '#8D6E63',
                  color: '#8D6E63'
                }}
              >
                <img src={GoogalLogo} alt='Google' />
                <span>Continue with Google</span>
              </button>
            </div>
          </form>
          
          <div className="signup-prompt">
            <span style={{ color: 'rgba(249, 251, 231, 0.7)' }}>New to Flavora?</span>
            <button 
              className="signup-link"
              onClick={() => (window.location.href = '/register')}
              style={{
                color: '#4CAF50',
                ':hover': { color: '#388E3C6' }
              }}
            >
              Create an account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserLogin;

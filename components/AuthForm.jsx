import React, { useState } from 'react';
import { ArrowLeft, Eye, EyeOff, Mail, Lock, User, Building, Phone } from 'lucide-react';

const AuthForm = ({ role, mode, onModeChange, onBack }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    company: '',
    phone: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', { role, mode, formData });
    alert(`${mode === 'login' ? 'Login' : 'Registration'} successful for ${role.name}!`);
  };

  const getRoleSpecificFields = () => {
    if (mode === 'login') return null;

    const commonFields = (
      <>
        <div className="form-group">
          <User className="input-icon" />
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <Building className="input-icon" />
          <input
            type="text"
            name="company"
            placeholder="Company Name"
            value={formData.company}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <Phone className="input-icon" />
          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleInputChange}
            required
          />
        </div>
      </>
    );

    return commonFields;
  };

  return (
    <div className="auth-form">
      <button className="back-btn" onClick={onBack}>
        <ArrowLeft size={20} />
        Back to Roles
      </button>

      <div className="auth-header">
        <div className="role-badge" style={{ backgroundColor: role.color }}>
          {React.createElement(role.icon, { size: 20 })}
          <span>{role.name}</span>
        </div>
        <h2>{mode === 'login' ? 'Welcome Back' : 'Create Account'}</h2>
        <p>
          {mode === 'login' 
            ? `Sign in to your ${role.name.toLowerCase()} account`
            : `Join as a ${role.name.toLowerCase()} on FlexMove`
          }
        </p>
      </div>

      <form onSubmit={handleSubmit} className="form">
        {getRoleSpecificFields()}
        
        <div className="form-group">
          <Mail className="input-icon" />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <Lock className="input-icon" />
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
          <button
            type="button"
            className="password-toggle"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {mode === 'register' && (
          <div className="form-group">
            <Lock className="input-icon" />
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        )}

        {mode === 'login' && (
          <div className="form-options">
            <label className="checkbox">
              <input type="checkbox" />
              <span>Remember me</span>
            </label>
            <a href="#" className="forgot-password">Forgot Password?</a>
          </div>
        )}

        <button type="submit" className="btn-primary submit-btn">
          {mode === 'login' ? 'Sign In' : 'Create Account'}
        </button>

        <div className="auth-switch">
          <p>
            {mode === 'login' ? "Don't have an account?" : "Already have an account?"}
            <button
              type="button"
              className="switch-btn"
              onClick={() => onModeChange(mode === 'login' ? 'register' : 'login')}
            >
              {mode === 'login' ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </div>
      </form>
    </div>
  );
};

export default AuthForm;


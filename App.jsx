import React, { useState } from 'react';
import './App.css';
import RoleSelection from './components/RoleSelection.jsx';
import AuthForm from './components/AuthForm.jsx';
import { Truck, Package, Factory, User } from 'lucide-react';

function App() {
  const [currentStep, setCurrentStep] = useState('welcome'); // 'welcome', 'role', 'auth'
  const [selectedRole, setSelectedRole] = useState(null);
  const [authMode, setAuthMode] = useState('login'); // 'login', 'register'

  const roles = [
    {
      id: 'supplier',
      name: 'Supplier',
      icon: Factory,
      description: 'Manage your inventory and supply products',
      color: '#3B82F6'
    },
    {
      id: 'consumer',
      name: 'Consumer',
      icon: User,
      description: 'Browse and purchase products',
      color: '#10B981'
    },
    {
      id: 'transporter',
      name: 'Transporter',
      icon: Truck,
      description: 'Handle logistics and delivery services',
      color: '#F59E0B'
    }
  ];

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setCurrentStep('auth');
  };

  const handleAuthModeChange = (mode) => {
    setAuthMode(mode);
  };

  const handleBackToRoles = () => {
    setCurrentStep('role');
    setSelectedRole(null);
  };

  const handleBackToWelcome = () => {
    setCurrentStep('welcome');
    setSelectedRole(null);
    setAuthMode('login');
  };

  return (
    <div className="app">
      <div className="background-animation">
        <div className="truck-animation">
          <Truck size={40} />
        </div>
        <div className="package-animation">
          <Package size={30} />
        </div>
        <div className="factory-animation">
          <Factory size={35} />
        </div>
      </div>

      <div className="container">
        {currentStep === 'welcome' && (
          <div className="welcome-section">
            <div className="logo">
              <Truck className="logo-icon" />
              <h1>FlexMove</h1>
            </div>
            <p className="subtitle">Dynamic Supply Chain Management Platform</p>
            <div className="welcome-buttons">
              <button 
                className="btn-primary"
                onClick={() => setCurrentStep('role')}
              >
                Get Started
              </button>
            </div>
          </div>
        )}

        {currentStep === 'role' && (
          <RoleSelection 
            roles={roles}
            onRoleSelect={handleRoleSelect}
            onBack={handleBackToWelcome}
          />
        )}

        {currentStep === 'auth' && selectedRole && (
          <AuthForm 
            role={selectedRole}
            mode={authMode}
            onModeChange={handleAuthModeChange}
            onBack={handleBackToRoles}
          />
        )}
      </div>
    </div>
  );
}

export default App;

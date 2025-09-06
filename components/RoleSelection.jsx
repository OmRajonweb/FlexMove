import React from 'react';
import { ArrowLeft } from 'lucide-react';

const RoleSelection = ({ roles, onRoleSelect, onBack }) => {
  return (
    <div className="role-selection">
      <button className="back-btn" onClick={onBack}>
        <ArrowLeft size={20} />
        Back
      </button>
      
      <div className="role-header">
        <h2>Choose Your Role</h2>
        <p>Select how you'll be using FlexMove</p>
      </div>

      <div className="roles-grid">
        {roles.map((role) => {
          const IconComponent = role.icon;
          return (
            <div 
              key={role.id}
              className="role-card"
              onClick={() => onRoleSelect(role)}
              style={{ '--role-color': role.color }}
            >
              <div className="role-icon">
                <IconComponent size={32} />
              </div>
              <h3>{role.name}</h3>
              <p>{role.description}</p>
              <div className="role-arrow">→</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RoleSelection;


import React from 'react';
import './SectionHeader.css';

const SectionHeader = ({ icon: Icon, title, subtitle, iconColor }) => {
  return (
    <div className="section-header mb-3 mt-4">
      <div className="d-flex align-items-center gap-2">
        <Icon size={24} style={{ color: iconColor }} />
        <div>
          <h4 className="section-title">{title}</h4>
          <p className="section-subtitle">{subtitle}</p>
        </div>
      </div>
    </div>
  );
};

export default SectionHeader;
import React from 'react';
import './LoadingSpinner.css'; // Create this CSS file next

const LoadingSpinner = () => {
  return (
    <div className="spinner-overlay">
      <div className="spinner"></div>
    </div>
  );
};

export default LoadingSpinner;

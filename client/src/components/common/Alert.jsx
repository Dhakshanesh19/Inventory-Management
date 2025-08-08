import React from 'react';

const Alert = ({ type, message }) => {
  if (!message) {
    return null;
  }

  // Determine the class name based on the alert type (e.g., 'success', 'error', 'warning')
  const alertClass = `alert alert-${type}`;

  return (
    <div className={alertClass} role="alert">
      {message}
    </div>
  );
};

export default Alert;

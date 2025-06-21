// components/Card.jsx
import React from 'react';

const Card = ({ children, className = '' }) => {
  return (
    <div className={`rounded-xl shadow bg-white ${className}`}>
      {children}
    </div>
  );
};

export const CardContent = ({ children, className = '' }) => {
  return <div className={`p-4 ${className}`}>{children}</div>;
};

export const CardTitle = ({ children, className = '' }) => {
  return <h3 className={`text-lg font-semibold ${className}`}>{children}</h3>;
};

export default Card;

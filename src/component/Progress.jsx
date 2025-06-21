// components/Progress.jsx
import React from 'react';

const Progress = ({ value, className = '' }) => {
  return (
    <div className={`w-[100px] bg-gray-200 rounded-full overflow-hidden ${className}`}>
      <div
        className="bg-pink-900 text-xs leading-none py-1 text-center text-white rounded-full"
        style={{ width: `${value}%` }}
      >
        {value}%
      </div>
    </div>
  );
};

export default Progress;

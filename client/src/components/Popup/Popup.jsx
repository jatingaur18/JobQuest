import React, { useState, useEffect } from 'react';

const Popup = ({ message = 'Incorrect guess! Try again.',bgColor = 'bg-red-600' }) => {
  return (
    <div className={`fixed top-20 left-1/2 transform -translate-x-1/2 ${bgColor} text-white px-4 py-2 rounded shadow-lg transition-all duration-300`}>
      {message}
    </div>
  );
};

export default Popup;
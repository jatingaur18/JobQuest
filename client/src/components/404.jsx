import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FolderX, Home } from 'lucide-react';

const NotFoundPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Retrieve the 'mess' from navigation state or default to 'page'
  const mess = location.state?.mess || 'page';

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center p-4">
      <h1 className="text-6xl font-bold text-violet-900 mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-2">{mess} Not Found</h2>
      <p className="text-gray-600 mb-6">
        Oops! The {mess} you're looking for seems to have wandered off. Let's get you back on track.
      </p>
      <button
        onClick={() => navigate('/')}
        className="bg-violet-900 text-white px-6 py-3 rounded-lg flex items-center justify-center hover:bg-violet-800 transition-colors duration-300"
      >
        <Home className="mr-2" />
        Return Home
      </button>
    </div>
  );
};

export default NotFoundPage;

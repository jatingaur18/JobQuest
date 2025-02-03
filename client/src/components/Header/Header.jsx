import { Link, NavLink } from "react-router-dom";
import UserContext from '../../contexts/UserContext';
import { useNavigate } from "react-router-dom";
import jobquestImage from '../../assets/jobquest.png'; 
import { User } from 'lucide-react';

import React, { useContext, useState, useEffect } from 'react';

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, setUser } = useContext(UserContext);
  const nav = useNavigate();

  // Sync context user with localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, [setUser]); // Run only on component mount or when `setUser` changes

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  const logout =() =>{
    setUser({});
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
    nav('/')
  }

  return (
    <header className="shadow sticky z-50 top-0 ">
      <nav className="bg-white border-gray-200 px-4 lg:px-6 py-2.5">
        <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
          <Link to="/" className="flex items-center">
            <img
              src={jobquestImage}
              className="mr-4 h-12"
              alt="Logo"
            />
          </Link>
          <div className="flex items-center lg:order-2">
            {user.username ? (
              <div className="flex items-center gap-2">
              <Link 
              to={`/Profile/${user.username}`}
                className="flex items-center gap-2 text-white bg-violet-900 hover:bg-violet-800 focus:ring-4 focus:ring-violet-400 font-medium rounded-lg text-sm px-4 py-2.5 focus:outline-none transition-colors"
              >
                <User size={18} />
                <span>Hi {user.username}!</span>
              </Link>
              <button
                className="text-white bg-red-700 hover:bg-violet-900 focus:ring-4 focus:ring-violet-400 font-medium rounded-lg text-sm px-4 py-2.5 focus:outline-none"
                onClick={logout}
              >
                Logout
              </button>
            </div>
              
            ) : (
              <Link
                to="/login"
                className="text-white bg-violet-900 hover:bg-violet-900 focus:ring-4 focus:ring-violet-400 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 focus:outline-none"
              >
                Log in
              </Link>
            )}
          </div>
          <button
            onClick={handleMenuToggle}
            className="text-gray-500 lg:hidden block focus:outline-none"
          >
            <svg
              className="w-6 h-6"
              fillRule="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              ></path>
            </svg>
          </button>
          <div
            className={`${
              isMenuOpen ? "block" : "hidden"
            } lg:flex lg:items-center lg:w-auto lg:order-1 w-full`}
            id="mobile-menu-2"
          >
            <ul className="flex flex-col lg:flex-row lg:space-x-8 mt-4 lg:mt-0">
              <li>
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    `block py-2 pr-4 pl-3 duration-200 ${
                      isActive ? "text-violet-900" : "text-gray-700"
                    } border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 hover:text-violet-900 lg:p-0`
                  }
                >
                  Home
                </NavLink>
              </li>
              <li>
                {user.type !== "company"?(<NavLink
                  to="/Jobs"
                  className={({ isActive }) =>
                    `block py-2 pr-4 pl-3 duration-200 ${
                      isActive ? "text-violet-900" : "text-gray-700"
                    } border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 hover:text-violet-900 lg:p-0`
                  }
                >
                  Jobs
                </NavLink>):(
                  <NavLink
                  to="/Createjob"
                  className={({ isActive }) =>
                    `block py-2 pr-4 pl-3 duration-200 ${
                      isActive ? "text-violet-900" : "text-gray-700"
                    } border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 hover:text-violet-900 lg:p-0`
                  }
                >
                  Create Jobs
                </NavLink>
                )}
              </li>
              <li>
                {user.type !== "company"?(<NavLink
                  to="/MyResume"
                  className={({ isActive }) =>
                    `block py-2 pr-4 pl-3 duration-200 ${
                      isActive ? "text-violet-900" : "text-gray-700"
                    } border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 hover:text-violet-900 lg:p-0`
                  }
                >
                  Resume
                </NavLink>):(
                  <NavLink
                  to="/Openedjobs"
                  className={({ isActive }) =>
                    `block py-2 pr-4 pl-3 duration-200 ${
                      isActive ? "text-violet-900" : "text-gray-700"
                    } border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 hover:text-violet-900 lg:p-0`
                  }
                >
                  Opened Jobs
                </NavLink>
                )}
              </li>
              <li>
              <NavLink
                  to="/Message"
                  className={({ isActive }) =>
                    `block py-2 pr-4 pl-3 duration-200 ${
                      isActive ? "text-violet-900" : "text-gray-700"
                    } border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 hover:text-violet-900 lg:p-0`
                  }
                >
                  Message
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Header;

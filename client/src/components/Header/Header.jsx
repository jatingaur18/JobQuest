import { Link, NavLink } from "react-router-dom";
import UserContext from '../../contexts/UserContext';
import { useNavigate } from "react-router-dom";
import jobquestImage from '../../assets/jobquest.png'; 
import { User, Search, X, Menu } from 'lucide-react';
export const API_URL = import.meta.env.VITE_API_URL
import React, { useContext, useState, useEffect } from 'react';

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const { user, setUser } = useContext(UserContext);
  const nav = useNavigate();

  // Sync context user with localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, [setUser]);

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
    // Close search when menu is toggled
    setIsSearchOpen(false);
    setSearchQuery('');
    setSearchResults([]);
  };

  const logout = () => {
    setUser({});
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
    nav('/')
  }

  const handleSearchChange = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.length > 0) {
      try {
        const response = await fetch(`${API_URL}/users`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ searchedText: query })
        });

        if (response.ok) {
          const results = await response.json();
          setSearchResults(results);
        }
      } catch (error) {
        console.error('Error searching users:', error);
      }
    } else {
      setSearchResults([]);
    }
  };

  const handleUserSelect = (username) => {
    nav(`/Profile/${username}`);
    setSearchQuery('');
    setSearchResults([]);
    setIsSearchOpen(false);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    // Close menu when search is opened
    setIsMenuOpen(false);
  };

  return (
    <header className="shadow sticky z-50 top-0">
      <nav className="bg-white border-gray-200 px-4 lg:px-6 py-2.5">
        <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl relative">
          {/* Logo and Mobile Controls */}
          <div className="flex items-center justify-between w-full lg:w-auto">
            <Link to="/" className="flex items-center">
              <img
                src={jobquestImage}
                className="mr-4 h-12"
                alt="Logo"
              />
            </Link>

            {/* Mobile Controls */}
            <div className="flex items-center lg:hidden">
              {/* Search Toggle for Mobile */}
              <button 
                onClick={toggleSearch}
                className="mr-2 text-gray-500 focus:outline-none"
              >
                <Search size={24} />
              </button>

              {/* Menu Toggle */}
              <button
                onClick={handleMenuToggle}
                className="text-gray-500 focus:outline-none"
              >
                <Menu size={24} />
              </button>
            </div>
          </div>

          {/* Desktop/Mobile Search */}
          <div className={`
            w-full lg:w-auto lg:flex-grow lg:max-w-md lg:mx-4 
            ${isSearchOpen ? 'block' : 'hidden lg:block'}
            absolute lg:relative top-full left-0 lg:top-auto lg:left-auto 
            z-50 bg-white lg:bg-transparent 
            shadow-lg lg:shadow-none 
            p-4 lg:p-0 mt-2 lg:mt-0
          `}>
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search users..." 
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-400"
              />
              <Search 
                size={20} 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
              />
              {searchQuery && (
                <X 
                  size={20} 
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer hover:text-gray-600" 
                />
              )}
            </div>
            {searchResults.length > 0 && (
              <ul className="absolute z-50 w-full bg-white border rounded-lg shadow-lg mt-1 max-h-60 overflow-y-auto">
                {searchResults.map((result, index) => (
                  <li 
                    key={index}
                    onClick={() => handleUserSelect(result.username)}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                  >
                    <User size={20} className="mr-2 text-gray-500" />
                    {result.username}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* User Actions */}
          <div className="hidden lg:flex items-center lg:order-2">
            {user.username ? (
              <div className="flex items-center gap-2">
                <Link 
                  to={`/Profile/${user.username}`}
                  className="flex items-center gap-2 text-white bg-violet-900 hover:bg-violet-800 focus:ring-4 focus:ring-violet-400 font-medium rounded-lg text-sm px-4 py-2.5 focus:outline-none transition-colors"
                >
                  <User size={18} />
                  <span>My Profile</span>
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

          {/* Mobile Menu */}
          <div
            className={`
              ${isMenuOpen ? 'block' : 'hidden'}
              w-full lg:block lg:w-auto lg:order-1 
              absolute lg:relative left-0 top-full 
              bg-white lg:bg-transparent 
              shadow-lg lg:shadow-none 
              z-50
            `}
            id="mobile-menu-2"
          >
            <ul className="flex flex-col lg:flex-row lg:space-x-8 p-4 lg:p-0 pt-2 lg:pt-0">
              <li className="lg:hidden">
                {user.username ? (
                  <div className="flex flex-col gap-2 mb-4">
                    <Link 
                      to={`/Profile/${user.username}`}
                      className="flex items-center gap-2 text-white bg-violet-900 hover:bg-violet-800 focus:ring-4 focus:ring-violet-400 font-medium rounded-lg text-sm px-4 py-2.5 focus:outline-none transition-colors"
                    >
                      <User size={18} />
                      <span>My Profile</span>
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
                    className="block text-center text-white bg-violet-900 hover:bg-violet-900 focus:ring-4 focus:ring-violet-400 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 focus:outline-none"
                  >
                    Log in
                  </Link>
                )}
              </li>
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
                {user.type !== "company" ? (
                  <NavLink
                    to="/Jobs"
                    className={({ isActive }) =>
                      `block py-2 pr-4 pl-3 duration-200 ${
                        isActive ? "text-violet-900" : "text-gray-700"
                      } border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 hover:text-violet-900 lg:p-0`
                    }
                  >
                    Jobs
                  </NavLink>
                ) : (
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
                {user.type !== "company" ? (
                  <NavLink
                    to="/MyResume"
                    className={({ isActive }) =>
                      `block py-2 pr-4 pl-3 duration-200 ${
                        isActive ? "text-violet-900" : "text-gray-700"
                      } border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 hover:text-violet-900 lg:p-0`
                    }
                  >
                    Resume
                  </NavLink>
                ) : (
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
import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { 
  Briefcase, 
  Building2, 
  Clock,
  ChevronRight,
  Search,
  BarChart3,
  Loader2
} from 'lucide-react';
import UserContext from '../../contexts/UserContext';

export const API_URL = import.meta.env.VITE_API_URL;

const OpenedJobs = () => {
  const { user, setUser } = useContext(UserContext);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const nav = useNavigate();

  const getJobs = async (username) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/company/:${username}`, {
        method: "GET",
      });

      const json = await response.json();
      if (response.status === 200) {
        setData(json);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleView = (item) => {
    nav(`/jobstatus/${item._id}`);
  };

  const filteredJobs = data.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.Company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    var storedUser = localStorage.getItem('user');
    storedUser = JSON.parse(storedUser);
    if (storedUser) {
      setUser(storedUser);
      getJobs(storedUser.username);
    }
  }, [setUser]);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-3xl font-bold text-violet-900 flex items-center gap-2">
              <Briefcase className="w-8 h-8" />
              Posted Jobs
            </h1>
            <p className="text-gray-600 mt-2 flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              {data.length} {data.length === 1 ? 'job' : 'jobs'} posted
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search jobs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Jobs List */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-8 h-8 text-violet-600 animate-spin" />
          </div>
        ) : filteredJobs.length > 0 ? (
          <div className="grid gap-4">
            {filteredJobs.slice().reverse().map(item => (
              <div
                key={item._id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 hover:border-violet-200 transition-all p-6"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <Briefcase className="w-5 h-5 text-violet-600" />
                      {item.title}
                    </h2>
                    <div className="space-y-1">
                      <p className="text-gray-600 flex items-center gap-2">
                        <Building2 className="w-4 h-4" />
                        {item.Company}
                      </p>
                      <p className="text-gray-500 flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Posted recently
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleView(item)}
                    className="flex items-center gap-2 px-6 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2"
                  >
                    View Details
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600">No jobs found matching your search criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OpenedJobs;
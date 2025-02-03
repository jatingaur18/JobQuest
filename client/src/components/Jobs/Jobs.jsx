import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { Briefcase, Building2, MapPin, Clock, DollarSign } from 'lucide-react';
import UserContext from '../../contexts/UserContext';
export const API_URL = import.meta.env.VITE_API_URL;

const Jobs = () => {
  const nav = useNavigate();
  const [data, setData] = useState([]);
  const [jobdata, setJobData] = useState({});
  const { user, setUser } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(true);

  const getJobs = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/jobs`, {
        method: "GET",
      });

      const json = await response.json();
      if (response.status === 200) {
        setData(json);
        console.log(json)
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setIsLoading(false);
    }
  }

  const apply = async (item) => {
    setJobData(item);
    console.log(item)
    applysend(item);
  }

  const applysend = async(item) => {
    nav(`/skilltest/${item._id}`);
  }

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      nav('/Login');
    }
    getJobs();
  }, [nav, setUser]);

  return (
    <div className="bg-gradient-to-b from-violet-50 to-white min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Available Positions</h1>
          <p className="text-lg text-gray-600">Find your next opportunity and take our skills assessment</p>
        </div>

        {isLoading ? (
          // Loading State
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-900"></div>
          </div>
        ) : (
          // Jobs List
          <div className="grid gap-6 md:gap-8">
            {data.map(item => (
              <div 
                key={item.id} 
                className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-shadow duration-300 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h2 className="text-xl font-semibold text-gray-900">{item.title}</h2>
                        <span className="px-3 py-1 text-sm font-medium text-violet-900 bg-violet-100 rounded-full">
                          Full-time
                        </span>
                      </div>
                      
                      <div className="flex flex-wrap gap-4 text-gray-600 mb-4">
                        <div className="flex items-center gap-1">
                          <Building2 size={18} />
                          <span>{item.company}</span>
                        </div>
                        {item.location && (
                          <div className="flex items-center gap-1">
                            <MapPin size={18} />
                            <span>{item.location}</span>
                          </div>
                        )}
                        {item.salary && (
                          <div className="flex items-center gap-1">
                            <DollarSign size={18} />
                            <span>{item.salary}</span>
                          </div>
                        )}
                      </div>

                      <p className="text-gray-600 mb-4">
                        {(item.description ? item.description.split(' ').slice(0, 20).join(' ') + '...' : "Join our team and work on exciting projects in a dynamic environment.")}
                      </p>

                      
                      <div className="flex flex-wrap gap-2">
                        {(item.skills || ["React", "JavaScript", "TypeScript"]).map((skill, index) => (
                          <span 
                            key={index}
                            className="px-3 py-1 text-sm bg-gray-100 text-gray-600 rounded-full"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 md:flex-col">
                      <button
                        onClick={() => apply(item)}
                        className="flex-1 md:w-full px-6 py-3 bg-violet-900 text-white font-medium rounded-lg hover:bg-violet-800 transition-colors duration-200 flex items-center justify-center gap-2"
                      >
                        <Briefcase size={18} />
                        Take Skills Test
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!isLoading && data.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">No jobs available at the moment. Please check back later.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Jobs;
import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { Briefcase, Building2 } from 'lucide-react';
import UserContext from '../../contexts/UserContext';
import Popup from '../Popup/Popup';
export const API_URL = import.meta.env.VITE_API_URL;

const Createjob = () => {
    const nav = useNavigate();
    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");
    const [jobID, setID] = useState("");
    const { user, setUser } = useContext(UserContext);
    const [showPopup, setShowPopup] = useState(false);
    const [mess, setMess] = useState("");
    const [color, setColor] = useState("bg-red-600");
    const [token, setToken] = useState(localStorage.getItem('authToken'));

    // New state variables for additional fields
    const [location, setLocation] = useState("");
    const [salary, setSalary] = useState("");
    const [skills, setSkills] = useState("");
    const [jobType, setJobType] = useState("Full-time");
    const [experience, setExperience] = useState("");
    
    useEffect(() => {
      const storedUser = localStorage.getItem('user');  
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      else {
        nav('/Login');
      }
    }, [nav, setUser]);

    const Popmess = async (mess, color) => {
      setMess(mess);
      setColor(color);
      setShowPopup(true);
      setTimeout(() => {
        setShowPopup(false);
      }, 2000);
    }

    const submit = async (e) => {
      e.preventDefault();
      const response = await fetch(`${API_URL}/createjob`, {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ID: jobID,
          Company: user.username,
          title: title,
          description: desc,
          // Adding new fields to the request
          location: location,
          salary: salary,
          skills: skills.split(',').map(skill => skill.trim()),
          jobType: jobType,
          experience: experience
        })
      });

      const status = response.status;
      if (status === 200) {
        Popmess("Job Created", "bg-green-500");
      } else {
        Popmess("Failed to Create Job", "bg-red-500");
      }
    }

    return (
      <div className="min-h-screen bg-gradient-to-b from-violet-50 to-white py-12">
        {showPopup && <Popup message={mess} bgColor={color} />}
        
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-gray-900 flex items-center justify-center gap-3 mb-2">
              <Briefcase className="w-8 h-8 text-violet-900" />
              Create a Job
            </h1>
            <p className="text-gray-600">Post a new position and find the perfect candidate</p>
          </div>

          <form onSubmit={submit} className="bg-white rounded-xl shadow-sm p-8 space-y-6">
            {/* Existing Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <label className="block">
                <span className="block text-gray-700 font-medium mb-2">Job Title</span>
                <input
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-200 focus:border-violet-900 transition-colors"
                  type="text"
                  placeholder="e.g. Senior Software Engineer"
                  onChange={(e) => setTitle(e.target.value)}
                />
              </label>

              <label className="block">
                <span className="block text-gray-700 font-medium mb-2">Job ID</span>
                <input
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-200 focus:border-violet-900 transition-colors"
                  type="text"
                  placeholder="e.g. JD-2024-001"
                  onChange={(e) => setID(e.target.value)}
                />
              </label>

              {/* New Fields */}
              <label className="block">
                <span className="block text-gray-700 font-medium mb-2">Location</span>
                <input
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-200 focus:border-violet-900 transition-colors"
                  type="text"
                  placeholder="e.g. New York, NY (Remote)"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </label>

              <label className="block">
                <span className="block text-gray-700 font-medium mb-2">Salary Range</span>
                <input
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-200 focus:border-violet-900 transition-colors"
                  type="text"
                  placeholder="e.g. $80,000 - $120,000"
                  value={salary}
                  onChange={(e) => setSalary(e.target.value)}
                />
              </label>

              <label className="block">
                <span className="block text-gray-700 font-medium mb-2">Required Skills</span>
                <input
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-200 focus:border-violet-900 transition-colors"
                  type="text"
                  placeholder="e.g. React, Node.js, TypeScript"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                />
              </label>

              <label className="block">
                <span className="block text-gray-700 font-medium mb-2">Experience Level</span>
                <input
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-200 focus:border-violet-900 transition-colors"
                  type="text"
                  placeholder="e.g. 3-5 years"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                />
              </label>

              <label className="block">
                <span className="block text-gray-700 font-medium mb-2">Job Type</span>
                <select
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-200 focus:border-violet-900 transition-colors"
                  value={jobType}
                  onChange={(e) => setJobType(e.target.value)}
                >
                  <option>Full-time</option>
                  <option>Part-time</option>
                  <option>Contract</option>
                  <option>Internship</option>
                </select>
              </label>
            </div>

            {/* Existing Description Field */}
            <label className="block">
              <span className="block text-gray-700 font-medium mb-2">Job Description</span>
              <textarea
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-200 focus:border-violet-900 transition-colors"
                rows="16"
                placeholder="Describe the role, responsibilities, and requirements..."
                onChange={(e) => setDesc(e.target.value)}
              ></textarea>
            </label>

            <div className="flex justify-end">
              <button
                className="px-6 py-3 bg-violet-900 text-white rounded-lg hover:bg-violet-800 transition-colors flex items-center gap-2"
                type="submit"
              >
                <Building2 className="w-5 h-5" />
                Post Job
              </button>
            </div>
          </form>
        </div>
      </div>
    );
}

export default Createjob;
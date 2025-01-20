import React, { useContext, useState, useEffect } from 'react';
import UserContext from '../../contexts/UserContext';
import { useNavigate } from "react-router-dom";
export const API_URL = import.meta.env.VITE_API_URL
const Jobs = () => {
  const nav = useNavigate();
  const [data, setData] = useState([]);
  const [jobdata, setJobData] = useState({});
  const { user,setUser } = useContext(UserContext);

  const getJobs = async () => {
    const response = await fetch(`${API_URL}/jobs`, {
      method: "GET",
    });

    const json = await response.json();
    if (response.status === 200) {
      setData(json);
      console.log(json)
    }
  }

  const apply = async (item) => {
    setJobData(item);
    applysend(item);
  }
  const applysend = async(item)=>{
    nav(`/skilltest/${item.id}`)
  }
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    console.log(user)
    if (!user.username) {
      nav('/Login');
    }
    getJobs();
  }, [nav, setUser]);

  return (
    <div className="container mx-auto px-4 min-h-screen">
      <h1 className="text-2xl font-bold my-4">Jobs</h1>
      <ul className="space-y-4 p-2">
        {data.map(item => (
          <li key={item.id} className="flex justify-between items-center p-4 bg-gray-100 m-2 border-2 shadow-md rounded-lg">
            <div className="text-lg font-semibold">
              {item.title} at {item.company}
            </div>
            <button
              className="bg-violet-900 text-white px-4 py-2 rounded-md hover:bg-violet-700"
              onClick={() => apply(item)}
            >
              Apply
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Jobs;

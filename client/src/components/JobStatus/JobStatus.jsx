import React, { useContext, useState, useEffect } from 'react';
import UserContext from '../../contexts/UserContext';
import { useNavigate , useLocation } from 'react-router-dom';
import { useParams } from 'react-router-dom';
export const API_URL = import.meta.env.VITE_API_URL
const Jobs = () => {
  const nav = useNavigate();
  const [data, setData] = useState([]);
  const [jobdata, setJobData] = useState({});
  const { user } = useContext(UserContext);
  const { id } = useParams();

  const getJobstatus = async () => {
    const response = await fetch(`${API_URL}/jobstatus/:${id}`, {
      method: "GET",
    });
    console.log(response.body.json);

    const json = await response.json();
    if (response.status === 200) {
      setData(json);
      console.log(json)
    }
  }

  useEffect(() => {
    if (!user.username) {
      nav('/Login');
    }
    getJobstatus();
  }, [user, nav]);

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold my-4">Jobs</h1>
      <ul className="space-y-4 p-2">
        {data.map(item => (
          <li className="flex justify-between items-center p-4 bg-gray-100 m-2 border-2 shadow-md rounded-lg">
            <div className="text-lg font-semibold">
              {item.name} | score: {item.score}
            </div>
            <button
              className="bg-violet-900 text-white px-4 py-2 rounded-md hover:bg-violet-700"
              onClick={() => window.open(item.link.pdf, '_blank')}
            >
              resume
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Jobs;

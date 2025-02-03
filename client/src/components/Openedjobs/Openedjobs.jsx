import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import UserContext from '../../contexts/UserContext';
export const API_URL = import.meta.env.VITE_API_URL


const Openedjobs = () => {
  
    const { user,setUser } = useContext(UserContext);
    const [data, setData] = useState([]);
    const nav = useNavigate();
    const name = user.username;
    const getJobs = async (username) => {
      const response = await fetch(`${API_URL}/company/:${username}`, {
        method: "GET",
      });
  
      const json = await response.json();
      if(response.status === 200){
        setData(json);
      }
    }
  
    const handle = (item) => {
      nav(`/jobstatus/${item._id}`, );
    }
  
    useEffect(()=>{
    var storedUser = localStorage.getItem('user');
    storedUser=JSON.parse(storedUser)
    if (storedUser) {
      setUser(storedUser);
    }
    getJobs(storedUser.username);
    },[setUser]);
  
    return(
      <>
      <div className="container mx-auto px-4 h-screen">
      <h1 className="text-2xl font-bold my-4">Jobs</h1>
      <ul className="space-y-4 p-2">
        {data.map(item => (
          <li key={item.Company} className="flex justify-between items-center p-4 bg-gray-100 m-2 border-2 shadow-md rounded-lg">
            <div className="text-lg font-semibold">
              {item.title} at {item.Company}
            </div>
            <button
              className="bg-violet-900 text-white px-4 py-2 rounded-md hover:bg-violet-700"
              onClick={() => handle(item)}
            >
              view
            </button>
          </li>
        ))}
      </ul>
    </div>
      </>
    )
  }
  export default Openedjobs; 
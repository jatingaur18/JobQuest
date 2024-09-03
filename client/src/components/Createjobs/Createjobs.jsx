import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import UserContext from '../../contexts/UserContext';

const Createjob = () => {
    const nav = useNavigate();
    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");
    const [jobID, setID] = useState("");
    const company = JSON.parse(localStorage.getItem('CompanyName'));
    const { user } = useContext(UserContext);
    
    useEffect(() => {
        if (!user.username || !user.type == 'company') {
          nav('/Login');
        }
      }, [user, nav]);


  const submit = async (e) => {
    e.preventDefault();
    const response = await fetch('http://localhost:3000/createjob', {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ID: jobID,
        Company: company,
        title: title,
        description: desc
      })
    });


    const status = response.status;
    if (status === 200) {
      console.log("success");
    } else {
      console.log("failure");
    }
  }

  return (
    <>
      
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="bg-white p-8 border-4 border-violet-900 rounded-lg w-96 space-y-6">
          <h1 className="text-center text-2xl font-bold">Create a Job</h1>
          <form onSubmit={submit}>
            <label className="block">
              <span className="block text-gray-700">Enter a Title</span>
              <input
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-violet-900"
                type="text"
                onChange={(e) => setTitle(e.target.value)}
              />
            </label>
            <label className="block">
              <span className="block text-gray-700">Enter ID</span>
              <input
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-violet-900"
                type="text"
                onChange={(e) => setID(e.target.value)}
              />
            </label>
            <label className="block">
              <span className="block text-gray-700">Job Description</span>
              <input
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-violet-900"
                type="text"
                onChange={(e) => setDesc(e.target.value)}
              />
            </label>
            <div className="text-center">
              <button
                className="mt-4 px-4 py-2 bg-violet-900 text-white rounded-md hover:bg-violet-700"
                type="submit"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Createjob;

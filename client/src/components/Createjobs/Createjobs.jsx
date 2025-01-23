import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import UserContext from '../../contexts/UserContext';
import Popup from '../Popup/Popup';
export const API_URL = import.meta.env.VITE_API_URL

const Createjob = () => {
    const nav = useNavigate();
    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");
    const [jobID, setID] = useState("");
    const { user,setUser } = useContext(UserContext);
    const [showPopup, setShowPopup] = useState(false);
    const [mess, setMess] = useState("");
    const [color, setColor] = useState("bg-red-600");
  
    const [token,setToken] = useState(localStorage.getItem('authToken'));
    
    useEffect(() => {
      const storedUser = localStorage.getItem('user');  
      console.log(storedUser)
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      else {
        nav('/Login');
      }
    }, [ nav,setUser]);
    const Popmess = async (mess,color)=>{
      setMess(mess);
      setColor(color)
      setShowPopup(true);
        setTimeout(() => {
          setShowPopup(false);
        }, 2000);
    }


  const submit = async (e) => {
    e.preventDefault();
    console.log(title,desc)
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
        description: desc
      })
    });


    const status = response.status;
    if (status === 200) {
      Popmess("Job Created","bg-green-500")
      console.log("success");
    } else {
      Popmess("Failed to Create Job","bg-red-500")
      console.log("failure");
    }
  }

  return (
    <div className="p-8 bg-gray-100">
      {showPopup && <Popup message= {mess} bgColor={color} />}
      <h1 className="text-center text-6xl font-bold mb-4">Create a Job</h1>

      <form onSubmit={submit}>
        <label className="block mb-4">
          <span className="block text-gray-700">Enter a Title</span>
          <input
            className="mt-1 block w-1/2 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-violet-900"
            type="text"
            onChange={(e) => setTitle(e.target.value)}
          />
        </label>
        <label className="block mb-4">
          <span className="block text-gray-700">Enter ID</span>
          <input
            className="mt-1 block w-1/2 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-violet-900"
            type="text"
            onChange={(e) => setID(e.target.value)}
          />
        </label>
        <label className="block mb-8">
          <span className="block text-gray-700">Job Description</span>
          <textarea
            className="mt-1 block w-4/5 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-violet-900"
            rows="16" // Increased the rows to make the textarea larger
            onChange={(e) => setDesc(e.target.value)}
          ></textarea>
        </label>
        <button
          className="px-4 py-2 bg-violet-900 text-white rounded-md hover:bg-violet-700"
          type="submit"
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export default Createjob;

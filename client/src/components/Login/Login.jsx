import React, { useEffect } from 'react'
import {useState, useContext} from "react";
import { useNavigate } from "react-router-dom";
import UserContext from '../../contexts/UserContext';
import Popup from '../Popup/Popup';
export const API_URL = import.meta.env.VITE_API_URL
function Login(){

  const {user ,setUser}=useContext(UserContext) 
  const [showPopup, setShowPopup] = useState(false);
  const [Uemail, setEmail] = useState("");
  const [Upassword, setPassword] = useState("");
  const [mess, setMess] = useState("");
  
  const nav = useNavigate();

  const register = async () => {
    nav('/Register')
  }
  const Popmess = async (mess)=>{
    setMess(mess);
    setShowPopup(true);
      setTimeout(() => {
        setShowPopup(false);
      }, 2000);
  }

  const submit = async () => {
    
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: Uemail,
        password: Upassword
      })
    })

    const status = response.status;
    var json = await response.json();
    const token =json.token;
    json = json.user;
    localStorage.setItem('authToken', token); 
    if(status === 200){
      const authuser = {
        email: json.email,
        username: json.username,
        type: json.type
        }
      console.log("login success");
      localStorage.setItem('user', JSON.stringify(authuser));
      setUser(authuser)
      if(json.type == 'company'){
        nav('/')
      }else{
        nav('/jobs');
      }
      console.log(json);

    }
    else{
      Popmess("incorrect login credentials")
      console.log("incorrect login credentials");
    }

  }

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser); // Sync context with local storage
      nav(-1); // Redirect to home page
    }
  }, [nav, setUser]);



  return(
    <div className="flex pt-24 justify-center h-screen">
      {showPopup && <Popup message= {mess} />}
      <div className="bg-white p-8 border-4 border-violet-900 rounded-lg w-100 h-96 flex flex-col justify-between">
        <h1 className="text-center text-3xl font-bold">Login</h1>
        <div className="space-y-4">
          <label className="block">
            <span className="block text-gray-700">Email</span>
            <input
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-violet-900"
              type="text"
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <label className="block">
            <span className="block text-gray-700">Password</span>
            <input
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-violet-900"
              type="password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          <div className="text-center">
            <button
              className="m-2 px-4 py-2 border-2 border-violet-900 bg-violet-900 text-white rounded-md hover:bg-violet-700"
              type="submit"
              onClick={submit}
            >
              Login
            </button>
            <button
              className="m-2 px-4 py-2 border-2 border-violet-900 bg-gray-300 text-black rounded-md hover:bg-gray-600 hover:text-white"
              type="submit"
              onClick={register}
            >
              Register
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login
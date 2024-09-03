import React from 'react'
import {useState, useContext} from "react";
import { useNavigate } from "react-router-dom";
import UserContext from '../../contexts/UserContext';
function Login(){

  const {user ,setUser}=useContext(UserContext) 
     
  const [Uemail, setEmail] = useState("");
  const [Upassword, setPassword] = useState("");
  const nav = useNavigate();

  const register = async () => {
    nav('/Register')
  }

  const submit = async () => {
    const response = await fetch('http://localhost:3000/login', {
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
    const json = await response.json();
    if(status === 200){
      console.log("login success");
      if(json.type == 'company'){
        localStorage.setItem('Company', JSON.stringify(json.email));
        localStorage.setItem('CompanyName', JSON.stringify(json.username));
        nav('/')
      }else{
        localStorage.setItem('applicant', JSON.stringify(json.email));
        nav('/jobs');
      }
      console.log(json);
      const em=json.email;
      const pas=json.password;
      const un=json.username;
      const ty=json.type;

      setUser(json)
      console.log(user)
    }
    else{
      console.log("incorrect login credentials");
    }

  }

  return(
    <div className="flex pt-24 justify-center h-screen">
      <div className="bg-white p-8 border-4 border-violet-900 rounded-lg w-80 h-96 flex flex-col justify-between">
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
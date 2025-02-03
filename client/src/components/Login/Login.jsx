import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import { Mail, Lock, LogIn, UserPlus, AlertCircle } from 'lucide-react';
import UserContext from '../../contexts/UserContext';
import Popup from '../Popup/Popup';

export const API_URL = import.meta.env.VITE_API_URL;

function Login() {
  const { user, setUser } = useContext(UserContext);
  const [showPopup, setShowPopup] = useState(false);
  const [Uemail, setEmail] = useState("");
  const [Upassword, setPassword] = useState("");
  const [mess, setMess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const nav = useNavigate();
  const [showTestPrompt, setShowTestPrompt] = useState(true); 

  const register = () => nav('/Register');

  const Popmess = (mess) => {
    setMess(mess);
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 2000);
  };

  useEffect(() => {
    setTimeout(() => setShowTestPrompt(false), 150000);
  }, []);

  const submit = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: Uemail, password: Upassword })
      });

      const status = response.status;
      const json = await response.json();
      const token = json.token;
      const userData = json.user;

      if (status === 200) {
        localStorage.setItem('authToken', token);
        const authuser = {
          email: userData.email,
          username: userData.username,
          type: userData.type
        };
        localStorage.setItem('user', JSON.stringify(authuser));
        setUser(authuser);
        nav(userData.type === 'company' ? '/' : '/jobs');
      } else {
        Popmess("Incorrect login credentials");
      }
    } catch (error) {
      Popmess("An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
      nav(-1);
    }
  }, [nav, setUser]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      {showPopup && (
        <div className="fixed top-4 right-4">
          <Popup message={mess} />
        </div>
      )}

        {showTestPrompt && (
          <div className="fixed mt-20 top-5 left-1/2 transform -translate-x-1/2 bg-white shadow-lg p-4 rounded-lg flex items-center gap-4">
            <span>Login as:</span>
            <button
              className="px-3 py-1 bg-cyan-800 text-white rounded-md"
              onClick={() => {
                setEmail("jatin22101@iiitnr.edu.in")
                setPassword("jatingaur18")
                setShowTestPrompt(false);
              }}
            >
              Test Applicant
            </button>
            <button
              className="px-3 py-1 bg-emerald-600 text-white rounded-md"
              onClick={() => {
                setEmail("google@hotmail.com")
                setPassword("microsoft")
                setShowTestPrompt(false);
              }}
            >
              Test Company
            </button>
          </div>
        )}
      
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg border-2 border-violet-200">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Welcome Back
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Please sign in to your account
          </p>
        </div>
        
        <div className="mt-8 space-y-6">
          <div className="space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-600 focus:border-transparent"
                placeholder="Email address"
                value={Uemail}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="password"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-600 focus:border-transparent"
                placeholder="Password"
                value={Upassword}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-col space-y-3">
            <button
              onClick={submit}
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-violet-900 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <LogIn className="h-5 w-5 text-violet-200 group-hover:text-violet-100" />
              </span>
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
            
            <button
              onClick={register}
              className="group relative w-full flex justify-center py-2 px-4 border-2 border-violet-900 text-sm font-medium rounded-md text-violet-900 bg-transparent hover:bg-violet-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <UserPlus className="h-5 w-5 text-violet-900 group-hover:text-violet-700" />
              </span>
              Register
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
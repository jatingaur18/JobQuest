import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, User, Building2, UserPlus, CheckCircle2 } from 'lucide-react';
import UserContext from '../../contexts/UserContext';
import Popup from "../Popup/Popup";

export const API_URL = import.meta.env.VITE_API_URL;

const Register = () => {
  const [Semail, setEmail] = useState("");
  const [Spassword, setPassword] = useState("");
  const [SpasswordCheck, setPasswordCheck] = useState("");
  const [SUsername, setUsername] = useState("");
  const [SType, setType] = useState("company");
  const [mess, setMess] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const nav = useNavigate();
  const { user, setUser } = useContext(UserContext);

  const Popmess = (mess) => {
    setMess(mess);
    setShowPopup(true);
    setTimeout(() => {
      setShowPopup(false);
    }, 2000);
  };

  const submit = async () => {
    if (Spassword !== SpasswordCheck) {
      Popmess("Password Does Not Match");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/signup`, {
        method: "POST",
        headers: {
          'Content-Type': "application/json",
        },
        body: JSON.stringify({
          email: Semail,
          password: Spassword,
          username: SUsername,
          type: SType
        }),
      });

      const json = await response.json();
      if (response.status === 200) {
        const user = {
          email: Semail,
          username: SUsername,
          type: SType
        };
        localStorage.setItem('authToken', json.token);
        setUser(user);
        localStorage.setItem('user', JSON.stringify(user));
        nav('/userProfile');
        Popmess(json.mess);
      } else {
        Popmess(json.message);
      }
    } catch (error) {
      Popmess("An error occurred during registration");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      {showPopup && (
        <div className="fixed top-4 right-4">
          <Popup message={mess} />
        </div>
      )}

      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg border-2 border-violet-200">
        <div>
          <h2 className="mt-2 text-center text-3xl font-extrabold text-gray-900">
            Create Account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Join us today and start your journey
          </p>
        </div>

        <div className="mt-8 space-y-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Username"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-600 focus:border-transparent"
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="password"
              placeholder="Password"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-600 focus:border-transparent"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <CheckCircle2 className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="password"
              placeholder="Confirm Password"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-600 focus:border-transparent"
              onChange={(e) => setPasswordCheck(e.target.value)}
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="email"
              placeholder="Email address"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-600 focus:border-transparent"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Building2 className="h-5 w-5 text-gray-400" />
            </div>
            <select
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-2 focus:ring-violet-600 focus:border-transparent"
              onChange={(e) => setType(e.target.value)}
              defaultValue="company"
            >
              <option value="company">Company</option>
              <option value="applicant">Applicant</option>
            </select>
          </div>

          <div>
            <button
              onClick={submit}
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-violet-900 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <UserPlus className="h-5 w-5 text-violet-200 group-hover:text-violet-100" />
              </span>
              {isLoading ? 'Creating account...' : 'Create Account'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
import { useState ,useContext} from "react";
import { useNavigate } from "react-router-dom";
import UserContext from '../../contexts/UserContext';
import Popup from "../Popup/Popup";

export const API_URL = import.meta.env.VITE_API_URL

const Register = () => {
  
  const [Semail, setEmail] = useState("");
  const [Spassword, setPassword] = useState("");
  const [SUsername, setUsername] = useState("");
  const [SType, setType] = useState("company");
  const [mess, setMess] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const nav = useNavigate();
  const {user ,setUser}=useContext(UserContext)
  const submit = async () => {
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
    })
    
    if(response.status == 200){
      const user = {
        email: Semail,
        username: Semail,
        type: SType
      } 
      setUser(user);
      localStorage.setItem('user',JSON.stringify(user));
      nav('/userProfile')
      Popmess("Registration Successfull")
    }
    else{
      Popmess("Registration Failed")
    }
  }

  const Popmess = async (mess)=>{
    setMess(mess);
    setShowPopup(true);
      setTimeout(() => {
        setShowPopup(false);
      }, 2000);
  }

  return(
    <div className="flex items-center justify-center h-screen bg-gray-100">
    {showPopup && <Popup message= {mess} />}
    <div className="bg-white p-8 border-4 border-violet-900 rounded-lg w-96 space-y-6">
      <h1 className="text-center text-2xl font-bold">Register</h1>
      <label className="block">
        <span className="block text-gray-700">Username</span>
        <input
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-violet-900"
          type="text"
          onChange={(e) => setUsername(e.target.value)}
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
      <label className="block">
        <span className="block text-gray-700">Email</span>
        <input
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-violet-900"
          type="email"
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>
      <label className="block">
        <span className="block text-gray-700">Register as a:</span>
        <select
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-violet-900"
          name="mode"
          id="mode"
          onChange={(e) => setType(e.target.value)}
        >
          <option value="company">Company</option>
          <option value="applicant">Applicant</option>
        </select>
      </label>
      <div className="text-center">
        <button
          className="mt-4 px-4 py-2 bg-violet-900 text-white rounded-md hover:bg-violet-700"
          type="submit"
          onClick={submit}
        >
          Submit
        </button>
      </div>
    </div>
  </div>
);
}

export default Register;

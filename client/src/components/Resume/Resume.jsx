import React, { useState, useContext, useEffect } from "react";
import UserContext from '../../contexts/UserContext';
import { useNavigate , useLocation } from 'react-router-dom';
export const API_URL = import.meta.env.VITE_API_URL
function Contact() {
  const nav = useNavigate();
  const [file, setFile] = useState(null);
  const { user } = useContext(UserContext);
  const [resumes, setResumes] = useState([]);

  const fetchResumes = async () => {
    const response = await fetch(`${API_URL}/uploadedResumes/:${user.email}`);
    const data = await response.json();
    console.log(data);
    setResumes(data);
  };
  const handleAnalysis = async (resume)=>{
    nav(`/resumeAnalysis`,{ state: resume })
  }
  useEffect(() => {
    // Fetch resumes when the component mounts

    fetchResumes();
  }, [user.email]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const fileUpload = async () => {
    if (!file) {
      console.error('No file selected for upload');
      return;
    }
  
    const storeEmail = user.email;
    const formData = new FormData();
    formData.append("file", file); // Ensure the key matches backend expectations
  
    try {
      const response = await fetch(`${API_URL}/uploadresume`, {
        method: "POST",
        headers: {
          email: storeEmail, // Add the email in headers
          // Do not set 'Content-Type' manually here
        },
        body: formData,
      });
  
      if (response.ok) {
        console.log('File uploaded successfully');
        // Fetch updated resumes
        const updatedResumes = await response.json();
        setResumes(updatedResumes);
        fetchResumes();
      } else {
        const errorData = await response.json();
        console.error('Error uploading file:', errorData.message || response.statusText);
      }
    } catch (error) {
      console.error('Error during file upload:', error);
    }
  };
  

  return (
    <div className="min-h-screen bg-white px-6 py-4">
      <h1 className="text-2xl font-bold text-violet-700 mb-4">Resumes</h1>
      <div className="grid md:grid-cols-4 gap-2 sm:grid-cols-1">
        {resumes.map((resume, index) => (
          <div
            key={index}
            className="w-64 h-32 border-2 border-violet-500 flex flex-col items-center justify-center p-4 rounded-lg shadow-md"
          >
            <label className="text-violet-700 cursor-pointer mb-2">

            {resume.filename}
            </label>
            <div>

          <button 
            className="mt-2 px-4 py-1 bg-violet-500 text-white font-semibold rounded-lg hover:bg-violet-600 focus:outline-none focus:ring-2 focus:ring-violet-500"
            onClick={()=>{handleAnalysis(resume)}}
          >
            Analyise
          </button>
            </div>
          </div>
        ))}
        <div
          className="w-64 h-32 bg-violet-200 border-2 border-violet-500 flex flex-col items-center justify-center p-4 rounded-lg shadow-md"
        >
          <label className="text-violet-700 cursor-pointer mb-2">
            Upload New Resume
            <input
              type="file"
              name="resume"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
          <button
            className="mt-2 px-4 py-1 bg-violet-500 text-white font-semibold rounded-lg hover:bg-violet-600 focus:outline-none focus:ring-2 focus:ring-violet-500"
            onClick={fileUpload}
          >
            Upload
          </button>
        </div>
      </div>
    </div>
  );
}

export default Contact;

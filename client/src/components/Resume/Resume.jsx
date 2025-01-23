import React, { useState, useContext, useEffect } from "react";
import UserContext from "../../contexts/UserContext";
import { useNavigate } from "react-router-dom";

export const API_URL = import.meta.env.VITE_API_URL;

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

  const handleAnalysis = (resume) => {
    nav(`/resumeAnalysis`, { state: resume });
  };

  useEffect(() => {
    fetchResumes();
  }, [user.email]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const fileUpload = async () => {
    if (!file) {
      console.error("No file selected for upload");
      return;
    }

    const storeEmail = user.email;
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(`${API_URL}/uploadresume`, {
        method: "POST",
        headers: {
          email: storeEmail,
        },
        body: formData,
      });

      if (response.ok) {
        console.log("File uploaded successfully");
        const updatedResumes = await response.json();
        setResumes(updatedResumes);
        fetchResumes();
        setFile(null); // Reset file after upload
      } else {
        const errorData = await response.json();
        console.error("Error uploading file:", errorData.message || response.statusText);
      }
    } catch (error) {
      console.error("Error during file upload:", error);
    }
  };


  return (
    <div className="min-h-screen bg-white px-6 py-4">
      <h1 className="text-2xl font-bold text-violet-700 mb-4">Resumes</h1>
      <div className="flex flex-wrap gap-4 justify-start">
        {resumes.map((resume, index) => (
          <div
            key={index}
            className="flex flex-col items-center justify-center border-2 border-violet-500 p-4 m-2 rounded-lg shadow-md bg-white"
            style={{ flex: "1 1 calc(200px + 1rem)", maxWidth: "calc(200px + 1rem)" }}
          >
            <label className="text-violet-700 cursor-pointer mb-2">
              {resume.filename}
            </label>
            <button
              className="mt-2 px-4 py-1 bg-violet-500 text-white font-semibold rounded-lg hover:bg-violet-600 focus:outline-none focus:ring-2 focus:ring-violet-500"
              onClick={() => handleAnalysis(resume)}
            >
              Analyze
            </button>
          </div>
        ))}
        <div
          className="flex flex-col items-center justify-center bg-violet-200 border-2 border-violet-500 p-4 m-2 rounded-lg shadow-md"
          style={{ flex: "1 1 calc(200px + 1rem)", maxWidth: "calc(200px + 1rem)" }}
        >
          <label className="text-violet-700 cursor-pointer mb-2">
            {file ? file.name : "Select New Resume"}
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

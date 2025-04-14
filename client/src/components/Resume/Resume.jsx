import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FileText, 
  Upload, 
  Plus,
  AlertCircle,
  CheckCircle2,
  Search,
  Trash2,
  FileUp
} from 'lucide-react';
import UserContext from "../../contexts/UserContext";

export const API_URL = import.meta.env.VITE_API_URL;

function Contact() {
  const nav = useNavigate();
  const [file, setFile] = useState(null);
  const { user } = useContext(UserContext);
  const [resumes, setResumes] = useState([]);
  const [mess, setMess] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [color, setColor] = useState('bg-red-600');
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchResumes = async () => {
    const response = await fetch(`${API_URL}/uploadedResumes/:${user.email}`);
    const data = await response.json();
    setResumes(data);
  };

  const handleAnalysis = (resume) => {
    nav(`/resumeAnalysis`, { state: resume });
  };

  useEffect(() => {
    fetchResumes();
  }, [user.email]);

  const showNotification = (message, isSuccess) => {
    setMess(message);
    setColor(isSuccess ? 'bg-green-600' : 'bg-red-600');
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 2000);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
    } else {
      showNotification('Please upload a PDF file', false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === 'application/pdf') {
      setFile(droppedFile);
    } else {
      showNotification('Please upload a PDF file', false);
    }
  };

  const fileUpload = async () => {
    if (!file) {
      showNotification('No file selected for upload', false);
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(`${API_URL}/uploadresume`, {
        method: "POST",
        headers: {
          email: user.email,
        },
        body: formData,
      });

      if (response.ok) {
        showNotification('Resume uploaded successfully', true);
        const updatedResumes = await response.json();
        setResumes(updatedResumes);
        fetchResumes();
        setFile(null);
      } else {
        const errorData = await response.json();
        showNotification(errorData.message || 'Error uploading file', false);
      }
    } catch (error) {
      showNotification('Error uploading file', false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      {showPopup && (
        <div className={`fixed top-4 right-4 z-50 ${color} text-white p-4 rounded-lg shadow-lg flex items-center space-x-2`}>
          {color.includes("green") ? (
            <CheckCircle2 className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
          <p>{mess}</p>
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-violet-900 flex items-center gap-2">
            <FileText className="w-8 h-8" />
            My Resumes
          </h1>
          <p className="text-gray-600">
            {resumes.length} {resumes.length === 1 ? 'Resume' : 'Resumes'} uploaded
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Upload Card */}
          <div
  onDragOver={handleDragOver}
  onDragLeave={handleDragLeave}
  onDrop={handleDrop}
  className={`relative p-6 rounded-lg border-2 border-dashed transition-colors ${
    isDragging
      ? 'border-violet-500 bg-violet-50'
      : 'border-violet-200 bg-white hover:border-violet-500'
  }`}
>
  <div className="flex flex-col items-center justify-center h-full space-y-4">
    <label className="flex flex-col items-center justify-center cursor-pointer w-full">
      <div className="p-4 bg-violet-100 rounded-full">
        <FileUp className="w-8 h-8 text-violet-600" />
      </div>
      <div className="text-center">
        <p className="text-sm font-medium text-violet-900">
          {file ? file.name : 'Drop your resume here'}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          or click to browse (PDF only)
        </p>
      </div>
      <input
        type="file"
        onChange={handleFileChange}
        className="hidden"
        accept=".pdf"
        id="file-upload"
      />
    </label>
    {file && (
      <button
        onClick={fileUpload}
        disabled={loading}
        className={`mt-4 px-6 py-2 rounded-lg font-semibold flex items-center gap-2 ${
          loading
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-violet-600 hover:bg-violet-700'
        } text-white`}
      >
        {loading ? (
          <>
            <Upload className="w-4 h-4 animate-spin" />
            Uploading...
          </>
        ) : (
          <>
            <Upload className="w-4 h-4" />
            Upload Resume
          </>
        )}
      </button>
    )}
  </div>
</div>

          {/* Resume Cards */}
          {resumes.map((resume, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:border-violet-200 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-violet-100 rounded-lg">
                  <FileText className="w-6 h-6 text-violet-600" />
                </div>
              </div>
              <h3 className="font-medium text-gray-900 mb-2 truncate">
                {resume.filename}
              </h3>
              <button
                onClick={() => handleAnalysis(resume)}
                className="w-full mt-4 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors flex items-center justify-center gap-2"
              >
                <Search className="w-4 h-4" />
                Analyze Resume
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Contact;
import React from "react";
import { useState } from "react"; 
function Contact(){
    const [score, setScore] = useState(0);
    const [file, setFile] = useState(null);
  
    const handleFileChange = async (e) => {
      setFile(e.target.files[0]);
    }
  
    const fileUpload = async () => {
      
      const storeEmail = "vanshjangir0001@gmail.com";
      const formData = new FormData();
      formData.append("resume", file);
  
      const response = await fetch('http://localhost:3000/uploadresume', {
        method: "POST",
        headers: {
          email: storeEmail,
        },
        body: formData,
      });
  
      if (response.status == 200) {
        console.log('File uploaded successfully');
      } else {
        console.error('Error uploading file:', response.statusText);
      }
    };
  
    return(
        <div className="flex flex-col items-center justify-center min-h-screen bg-violet-500">
        <h1 className="text-4xl font-bold text-white mb-6">Upload Resume</h1>
        <input
          className="appinp mb-4 p-2 border-2 border-white rounded-lg bg-white text-violet-700"
          type="file"
          name="resume"
          onChange={handleFileChange}
        />
        <button
          className="appbut px-6 py-2 bg-white text-violet-500 font-semibold rounded-lg hover:bg-violet-100 focus:outline-none focus:ring-2 focus:ring-violet-500"
          type="submit"
          onClick={fileUpload}
        >
          Upload
        </button>
      </div>
    );
  };
  

export default Contact  
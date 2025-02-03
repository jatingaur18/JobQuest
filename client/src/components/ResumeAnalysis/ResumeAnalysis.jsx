import React, { useContext, useState, useEffect } from 'react';
import UserContext from '../../contexts/UserContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { useParams } from 'react-router-dom';
export const API_URL = import.meta.env.VITE_API_URL
const Jobs = () => {
  const nav = useNavigate();
  const location = useLocation();
  const [data, setData] = useState(null); // Initialize as null
  const jsonData = location.state;
  const { user } = useContext(UserContext);
  const { id } = useParams();
  const [token,setToken] = useState(localStorage.getItem('authToken'));

  const ResumeAnalysis = async () => {
    try {
      const response = await fetch(`${API_URL}/resumeAnalysis`, {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user:user,resume: jsonData.path }),
      });

      const json = await response.json();
      if (response.ok) {
        setData(json);
      } else {
        console.error("Failed to fetch resume analysis:", response.statusText);
      }
    } catch (error) {
      console.error("Error during fetch:", error);
    }
  };

  useEffect(() => {
    if (!user?.username) {
      nav('/Login');
    } else {
      ResumeAnalysis();
    }
  }, [user, nav]);

  if (!data) {
    return <div className='min-h-screen flex justify-center items-center'>
      <img className='w-[400px] ' src="https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/4cec2c69321565.5b7d0cbe75933.gif" alt="" />
    </div>; // Show a loading state while fetching data
  }

  return (
    <div className="flex flex-wrap">
  <div className="w-full sm:w-1/2 p-4 text-white">
    {/* Left */}
    <div className="h-[calc(100vh-16px)] overflow-y-auto">
      <img src={jsonData.pdf.slice(0, -3) + 'jpg'} alt="Resume Preview" />
    </div>
  </div>
  <div className="w-full sm:w-1/2 p-4">
    {/* Right */}
    <div className="h-[calc(100vh-16px)] overflow-y-auto">
      <div className="p-6 bg-gray-100 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-4 text-violet-900">
          Resume Score: {data.resume_score}
        </h1>
        <div className="mb-4">
          <div className="space-y-4">
            {data.sections &&
              Object.entries(data.sections).map(([sectionName, sectionData]) => (
                <div
                  key={sectionName}
                  className="p-4 bg-white rounded-md shadow-md"
                >
                  <div className="flex flex-wrap">
                    <div className="w-full sm:w-1/2 p-4">
                      <h3 className="text-lg font-bold capitalize">
                        {sectionName.replace(/_/g, " ")}
                      </h3>
                    </div>
                    <div className="w-full sm:w-1/2 p-4">
                      <p className="text-lg font-bold ">
                        {sectionData.rating}/10
                      </p>
                    </div>
                  </div>
                  <div className="mt-2">
                    <h4 className="font-semibold">Strengths:</h4>
                    <ul className="list-disc ml-5">
                      {sectionData.strengths.map((strength, index) => (
                        <li key={index}>{strength}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-2">
                    <h4 className="font-semibold">Weaknesses:</h4>
                    <ul className="list-disc ml-5">
                      {sectionData.weaknesses.length > 0 ? (
                        sectionData.weaknesses.map((weakness, index) => (
                          <li key={index}>{weakness}</li>
                        ))
                      ) : (
                        <li>None</li>
                      )}
                    </ul>
                  </div>
                  <div className="mt-2">
                    <h4 className="font-semibold">Improvements:</h4>
                    <ul className="list-disc ml-5">
                      {sectionData.improvements.map((improvement, index) => (
                        <li key={index}>{improvement}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
          </div>
        </div>
        <div>
          <h2 className="text-xl font-semibold">Missing Sections</h2>
          <ul className="list-disc ml-5 mt-2">
            {data.missing_sections.map((section, index) => (
              <li key={index}>{section}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  </div>
</div>

  );
};

export default Jobs;

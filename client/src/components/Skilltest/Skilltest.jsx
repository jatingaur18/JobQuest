import { useParams } from 'react-router-dom';
import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UserContext from '../../contexts/UserContext';

function User() {
  const { id } = useParams();
  const [ques, setQues] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [score, setScore] = useState(0);
  const { user } = useContext(UserContext);
  const [resumes, setResumes] = useState([]);
  const [selectedResume, setSelectedResume] = useState(null); 
  const nav = useNavigate();

  const fetchResumes = async () => {
    const response = await fetch(`http://localhost:3000/uploadedResumes/:${user.email}`);
    const data = await response.json();
    console.log(data);
    setResumes(data);
  };

  const gettest = async () => {
    const response = await fetch(`http://localhost:3000/gettest/${id}`, {
      method: 'GET',
    });

    const json = await response.json();
    if (response.status === 200) {
      setQues(json);
    }
  };

  useEffect(() => {
    gettest();
    fetchResumes();
  }, []);

  const handleAnswerChange = (questionNo, answer) => {
    setSelectedAnswers({ ...selectedAnswers, [questionNo]: answer });
  };

  const handleResumeSelect = (resume) => {
    setSelectedResume(resume.path);
  };

  const handleSubmit = async () => {
    let tempScore = 0;
    console.log("here");
    ques.forEach((question) => {
      if (selectedAnswers[question.question_no] === question.correct) {
        tempScore += 1;
      }
    });
  
    setScore(tempScore);
    alert(`Your score is: ${tempScore}/${ques.length}`);
  
    const resultData = {
      score: tempScore,
      resume: selectedResume,
      test_id: id,
      user: user,
    };
  
    console.log(resultData); // Check the data being sent
  
    try {
      const response = await fetch('http://localhost:3000/applyjob', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(resultData),
      });
      const resData = await response.json();
      console.log('Data submitted successfully:', resData);
    } catch (error) {
      console.error('Error submitting data:', error);
    }
  };
  

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <h1 className="text-2xl font-bold text-violet-900 mb-6">Skill Test</h1>


      <div className="mb-6 w-full max-w-4xl p-4 border-2 border-violet-900 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-violet-900 mb-4">Select a Resume</h2>
        <div className="space-y-2">
          {resumes.map((resume, index) => (
            <label key={index} className="block">
              <input
                type="radio"
                name="resume"
                value={resume.path}
                onChange={() => handleResumeSelect(resume)}
                className="mr-2"
              />
              {resume.filename}
            </label>
          ))}
        </div>
      </div>


      <div className="w-full max-w-4xl space-y-4">
        {ques.map((question, index) => (
          <div
            key={index}
            className="p-4 border-2 border-violet-900 bg-white rounded-lg shadow-md"
          >
            <p className="font-semibold text-violet-900">{`${question.question_no}. ${question.question}`}</p>
            <div className="space-y-2 mt-2">
              {Object.entries(question.options).map(([key, option]) => (
                <label key={key} className="block">
                  <input
                    type="radio"
                    name={`question-${question.question_no}`}
                    value={key}
                    onChange={() =>
                      handleAnswerChange(question.question_no, key)
                    }
                    className="mr-2"
                  />
                  {option}
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      <button
        className="mt-6 px-6 py-2 bg-violet-900 text-white font-semibold rounded-lg hover:bg-violet-600 focus:outline-none focus:ring-2 focus:ring-violet-900"
        onClick={handleSubmit}
        disabled={!selectedResume} // Disable if no resume is selected
      >
        Submit
      </button>
    </div>
  );
}

export default User;

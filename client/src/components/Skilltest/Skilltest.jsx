import React, { useContext, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  FileText, 
  ClipboardCheck, 
  AlertCircle, 
  CheckCircle2,
  ChevronRight,
  Timer
} from 'lucide-react';
import UserContext from '../../contexts/UserContext';

export const API_URL = import.meta.env.VITE_API_URL;

function User() {
  const { id } = useParams();
  const [ques, setQues] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [score, setScore] = useState(0);
  const { user } = useContext(UserContext);
  const [resumes, setResumes] = useState([]);
  const [selectedResume, setSelectedResume] = useState({});
  const [showPopup, setShowPopup] = useState(false);
  const [mess, setMess] = useState("");
  const [color, setColor] = useState("bg-red-600");
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();
  const [token, setToken] = useState(localStorage.getItem('authToken'));

  const fetchResumes = async () => {
    const response = await fetch(`${API_URL}/uploadedResumes/:${user.email}`);
    const data = await response.json();
    setResumes(data);
  };

  const showNotification = (message, isSuccess = false) => {
    setMess(message);
    setColor(isSuccess ? "bg-green-500" : "bg-red-500");
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 2000);
  };

  const gettest = async () => {
    try {
      const response = await fetch(`${API_URL}/gettest/${id}`);
      const json = await response.json();
      if (response.status === 200) {
        setQues(json);
      }
    } catch (error) {
      showNotification("Failed to load test questions", false);
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
    setSelectedResume(resume);
  };

  const handleSubmit = async () => {
    setLoading(true);
    let tempScore = 0;
    ques.forEach((question) => {
      if (selectedAnswers[question.question_no] === question.correct) {
        tempScore += 1;
      }
    });

    setScore(tempScore);

    const resultData = {
      score: tempScore,
      resume: selectedResume,
      test_id: id,
      user: user,
    };

    try {
      const response = await fetch(`${API_URL}/applyjob`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(resultData),
      });
      const resData = await response.json();
      
      if (resData.status === 200) {
        showNotification("Test submitted successfully!", true);
      } else {
        showNotification("Failed to submit test", false);
      }
    } catch (error) {
      showNotification("Error submitting test", false);
    } finally {
      setLoading(false);
    }
  };

  const getQuestionProgress = () => {
    const answered = Object.keys(selectedAnswers).length;
    const total = ques.length;
    return `${answered}/${total} questions answered`;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      {showPopup && (
        <div className={`fixed top-4 right-4 z-50 ${color} text-white p-4 rounded-lg shadow-lg flex items-center space-x-2`}>
          {color.includes("green") ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <p>{mess}</p>
        </div>
      )}

      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-violet-900 flex items-center justify-center gap-2">
            <ClipboardCheck className="w-8 h-8" />
            Skill Assessment Test
          </h1>
          <p className="mt-2 text-gray-600 flex items-center justify-center gap-2">
            <Timer className="w-4 h-4" />
            {getQuestionProgress()}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-5 h-5 text-violet-900" />
            <h2 className="text-xl font-semibold text-violet-900">Select Resume</h2>
          </div>
          <div className="space-y-3">
            {resumes.map((resume, index) => (
              <label
                key={index}
                className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                  selectedResume === resume
                    ? 'border-violet-900 bg-violet-50'
                    : 'border-gray-200 hover:border-violet-200'
                }`}
              >
                <input
                  type="radio"
                  name="resume"
                  value={resume.path}
                  onChange={() => handleResumeSelect(resume)}
                  className="mr-3"
                />
                <span className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-violet-700" />
                  {resume.filename}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {ques.map((question, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6">
              <p className="font-semibold text-violet-900 flex items-start gap-2">
                <ChevronRight className="w-5 h-5 mt-1 flex-shrink-0" />
                <span>{`${question.question_no}. ${question.question}`}</span>
              </p>
              <div className="mt-4 space-y-3 pl-7">
                {Object.entries(question.options).map(([key, option]) => (
                  <label
                    key={key}
                    className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                      selectedAnswers[question.question_no] === key
                        ? 'border-violet-900 bg-violet-50'
                        : 'border-gray-200 hover:border-violet-200'
                    }`}
                  >
                    <input
                      type="radio"
                      name={`question-${question.question_no}`}
                      value={key}
                      onChange={() => handleAnswerChange(question.question_no, key)}
                      className="mr-3"
                    />
                    {option}
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center">
          <button
            className={`px-8 py-3 rounded-lg font-semibold flex items-center gap-2 transition-colors ${
              !selectedResume || loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-violet-900 hover:bg-violet-800'
            } text-white`}
            onClick={handleSubmit}
            disabled={!selectedResume || loading}
          >
            <CheckCircle2 className="w-5 h-5" />
            {loading ? 'Submitting...' : 'Submit Test'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default User;
import React, { useContext, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Users, 
  FileText,
  Medal,
  Loader2,
  ExternalLink,
  ChevronRight,
  AlertCircle,
  BarChart4
} from 'lucide-react';
import UserContext from '../../contexts/UserContext';

export const API_URL = import.meta.env.VITE_API_URL;

const Jobs = () => {
  const nav = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(UserContext);
  const { id } = useParams();

  const getJobStatus = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/jobstatus/:${id}`, {
        method: "GET",
      });

      const json = await response.json();
      if (response.status === 200) {
        setData(json);
      } else {
        nav('/not-found', { state: { mess: 'JOB' } });
      }
    } catch (error) {
      setError('Failed to load applicant data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user.username) {
      nav('/Login');
      return;
    }
    getJobStatus();
  }, [user, nav]);

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 text-violet-600 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-600">
        <AlertCircle className="w-6 h-6 mr-2" />
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-violet-900 flex items-center gap-2">
              <Users className="w-8 h-8" />
              Job Applicants
            </h1>
            <p className="text-gray-600 mt-2 flex items-center gap-2">
              <BarChart4 className="w-4 h-4" />
              {data.length} {data.length === 1 ? 'applicant' : 'applicants'}
            </p>
          </div>
        </div>

        <div className="grid gap-4">
          {data.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-sm border border-gray-200 hover:border-violet-200 transition-all p-6"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3">
                  <h2 
                    className="text-xl font-semibold text-gray-900 cursor-pointer" 
                    onClick={() => nav(`/Profile/${item.name}`)}
                  >
                    {item.name}
                  </h2>
                    <div className="flex items-center gap-1">
                      <Medal className={`w-5 h-5 ${getScoreColor(item.score)}`} />
                      <span className={`font-medium ${getScoreColor(item.score)}`}>
                        {item.score}%
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-gray-500">
                    <FileText className="w-4 h-4" />
                    Resume uploaded
                  </div>
                </div>
                
                <button
                  onClick={() => window.open(item.link.pdf.slice(0, -3) + 'jpg', '_blank')}
                  className="flex items-center gap-2 px-6 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2"
                >
                  <FileText className="w-4 h-4" />
                  View Resume
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          {data.length === 0 && (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No applicants yet for this position.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Jobs;
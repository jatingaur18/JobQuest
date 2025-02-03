import React from "react";
import { Link } from "react-router-dom";
import { FileText, MessageSquare, Trophy, BarChart, Brain } from "lucide-react";

const Home = () => {
  const features = [
    {
      icon: <Brain className="w-6 h-6" />,
      title: "AI-Powered Job Match Quiz",
      description: "Take our intelligent quiz to match your skills with job requirements and get personalized recommendations"
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: "Resume Analysis",
      description: "Get detailed insights about your resume with our AI-powered analysis tool"
    },
    {
      icon: <Trophy className="w-6 h-6" />,
      title: "Applicant Ranking",
      description: "Automated ranking system that matches candidates with job descriptions"
    },
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: "Instant Messaging",
      description: "Connect directly with recruiters and other job seekers"
    }
  ];

  return (
    <div className="w-full">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-violet-50 to-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between py-12 lg:py-24">
            <div className="lg:w-1/2 text-center lg:text-left mb-8 lg:mb-0">
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
                Land Your Dream Job with
                <span className="text-violet-900 block">JobQuest AI</span>
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                Transform your job search with AI-powered quiz assessments, resume analysis, and intelligent candidate ranking.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  to="/jobs"
                  className="inline-flex items-center justify-center px-6 py-3 bg-violet-900 text-white font-medium rounded-lg hover:bg-violet-800 transition-colors"
                >
                  Take Quiz
                </Link>
                <Link
                  to="/MyResume"
                  className="inline-flex items-center justify-center px-6 py-3 border-2 border-violet-900 text-violet-900 font-medium rounded-lg hover:bg-violet-50 transition-colors"
                >
                  Analyze Resume
                </Link>
              </div>
            </div>
            <div className="lg:w-1/2">
              <img 
                src="https://img.freepik.com/free-vector/flat-employment-agency-search-new-employees-hire_88138-802.jpg?t=st=1738572727~exp=1738576327~hmac=96e0d5d767ee0ae28d8b80713b6a14b471680837208329f572c3b5d1fdaafe5d&w=1380"
                alt="Job Search Illustration"
                className="w-full max-w-lg mx-auto rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How JobQuest Works</h2>
            <p className="text-lg text-gray-600">Our AI-powered platform helps you stand out in the job market</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="p-6 bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-violet-100 rounded-lg flex items-center justify-center mb-4 text-violet-900">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="bg-violet-900 text-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">95%</div>
              <div className="text-violet-200">Accuracy Rate</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">10k+</div>
              <div className="text-violet-200">Resumes Analyzed</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">89%</div>
              <div className="text-violet-200">Success Rate</div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Transform Your Job Search?</h2>
          <p className="text-lg text-gray-600 mb-8">Join thousands of job seekers who have found their perfect match with JobQuest</p>
          <Link
            to="/register"
            className="inline-flex items-center justify-center px-8 py-3 bg-violet-900 text-white font-medium rounded-lg hover:bg-violet-800 transition-colors"
          >
            Get Started Free
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
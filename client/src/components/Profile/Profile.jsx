import {Building2, UserX, AlertCircle, Users, Mail, Link as LinkIcon, MapPin, MessageCircle, Edit, Award} from 'lucide-react';
import { useParams } from 'react-router-dom';
import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UserContext from '../../contexts/UserContext';
export const API_URL = import.meta.env.VITE_API_URL
import Popup from '../Popup/Popup';

const UserProfileView = () => {
    const [token, setToken] = useState(localStorage.getItem('authToken'));
    const { id } = useParams();
    const [Profile, setProfile] = useState(null);
    const {user, setUser} = useContext(UserContext)
    const [mess, setMess] = useState("");
    const [showPopup, setShowPopup] = useState(false);
    const [ProEmail, setProEmail] = useState("");
    const [notFound, setnotFound] = useState(false);
    const [Prof, setProf] = useState(null);
    const nav = useNavigate();

    useEffect(() => {
      fetchProfile(id);
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
        }
        console.log("Fetched ID:", id);
    }, [id, nav, setUser]);

    const fetchProfile = async (username) => {
      try {
        console.log("API URL:", API_URL);
        console.log("Request payload:", { username });

        const response = await fetch(`${API_URL}/fetchProfile`, {
          method: "POST",
          headers: { 'Content-Type': "application/json" },
          body: JSON.stringify({ username }),
          cache: 'no-store',
        });

        if (response.status === 200) {
          const prof = await response.json();
          console.log("Profile data:", prof);
          setProf(prof.profile)
          setProfile(prof.profile.profile_section);
          setProEmail(prof.profile.email)
        } else {
          nav('/not-found', { state: { mess: 'USER' } });
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        Popmess('UNABLE TO FETCH DATA');
      }
    };

    const Popmess = async (mess) => {
      setMess(mess);
      setShowPopup(true);
      setTimeout(() => {
        setShowPopup(false);
      }, 2000);
    }

    const Chat = async () => {
      try {
        const response = await fetch(`${API_URL}/Message`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ 
            user: user,
            chatData: {
              chatID: null,
              to: id,
              message: ""
            }
          })
        });
      } catch (error) {
        console.error('Error sending message:', error);
      }
      nav('/Message')
    };

    const updateProfile = () => {
      if(user.type == "applicant"){
        nav(`/userProfile`)
      } else {
        nav(`/Companyprofile`)
      }
    }

    if(Profile === null){
      return (
        <div className='min-h-screen flex justify-center items-center'>
          <img className='w-[400px] max-w-full' src="./src/assets/loading2.gif" alt="Loading..." />
        </div>
      );
    }

    if (!Profile || !Profile.about || Object.keys(Profile.about).length === 0) {
      return (
        <div className="min-h-screen bg-violet-200 overflow-auto p-4">
          <div className="max-w-6xl mx-auto rounded-xl bg-white shadow-md">
            <div className="bg-blue-900 text-white p-4 md:p-6 rounded-t-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Users size={40} className="mr-4" />
                  <h1 className="text-xl md:text-3xl font-bold">Profile</h1>
                </div>
                {user.username===id && (
                  <Edit 
                    size={24} 
                    onClick={() => updateProfile()} 
                    className="text-white cursor-pointer hover:text-gray-300" 
                  />
                )}
              </div>
            </div>
    
            <div className="p-4 md:p-6">
              <div className="flex flex-col items-center justify-center py-12">
                <AlertCircle size={48} className="text-violet-900 mb-4" />
                {user.username===id ? (
                  <h2 className="text-xl md:text-2xl font-semibold text-violet-900 mb-2 text-center">
                    Please Update your Profile
                  </h2>
                ) : (
                  <h2 className="text-xl md:text-2xl font-semibold text-violet-900 mb-2 text-center">
                    Profile Not Updated
                  </h2>
                )}
                <p className="text-gray-600 text-center max-w-md">
                  This user hasn't updated their profile information yet. Check back later for updates.
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    const renderSection = (title, children, className = "") => (
      <section className={`mb-6 ${className}`}>
        <h2 className="text-xl md:text-2xl font-semibold text-violet-900 mb-4">{title}</h2>
        {children}
      </section>
    );

    return (
      <div>{showPopup && <Popup message={mess} />}
        <div className="min-h-screen bg-violet-200 overflow-auto p-4">
          <div className="max-w-6xl mx-auto rounded-xl bg-white shadow-md">
            {/* Profile Header */}
            <div className="bg-blue-900 text-white p-4 md:p-6 rounded-t-xl flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center mb-4 md:mb-0">
                {Prof.type === "applicant" ? <Users size={40} className="mr-4" /> : <Building2 size={40} className="mr-4" />}
                <div className="flex items-center">
                  <h1 className="text-xl md:text-3xl font-bold mr-3">
                    {Prof.type === "applicant" ? Profile.about.name : Profile.about.companyName}
                  </h1>
                  {user.username === id && (
                    <Edit 
                      size={24} 
                      onClick={() => updateProfile()} 
                      className="text-white cursor-pointer hover:text-gray-300" 
                    />
                  )}
                </div>
              </div>
              {user.username !== id && (
                <button 
                  className="bg-white text-violet-900 p-2 rounded-full flex items-center hover:bg-gray-100"
                  onClick={() => Chat()}
                >
                  <MessageCircle /> 
                </button>
              )}
            </div>

            {/* Profile Content */}
            <div className="p-4 md:p-6">
              {Prof.type === "applicant" ? (
                <>
                  {renderSection("About", (
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-gray-700"><strong>Age:</strong> {Profile.about.age}</p>
                        <p className="text-gray-700 mt-2">{Profile.about.description}</p>
                      </div>
                      <div>
                        <h3 className="font-semibold text-violet-800 mb-2">Links</h3>
                        {Profile.about.links.map((link, index) => (
                          <a 
                            key={index} 
                            href={`https://${link}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center text-blue-600 hover:text-blue-800 mb-2"
                          >
                            <LinkIcon size={16} className="mr-2" /> {link}
                          </a>
                        ))}
                      </div>
                    </div>
                  ))}

                  {renderSection("Education", 
                    Profile.education.map((edu, index) => (
                      <div key={index} className="bg-white border border-violet-200 p-4 mb-4 rounded-lg">
                        <h3 className="text-lg font-semibold text-violet-800">{edu.college}</h3>
                        <p className="text-gray-700">{edu.degree} | GPA: {edu.gpa}</p>
                        <p className="text-gray-600">{edu.duration} {edu.ongoing && '(Currently Studying)'}</p>
                      </div>
                    ))
                  )}

                  {renderSection("Experience", 
                    Profile.experience.map((exp, index) => (
                      <div key={index} className="bg-white border border-violet-200 p-4 mb-4 rounded-lg">
                        <h3 className="text-lg font-semibold text-violet-800">{exp.company}</h3>
                        <p className="text-gray-700">{exp.role}</p>
                        <p className="text-gray-600">{exp.duration} {exp.ongoing && '(Currently Working)'}</p>
                      </div>
                    ))
                  )}

                  {renderSection("Skills", 
                    <div className="flex flex-wrap gap-2">
                      {Profile.skills.skillList.map((skill, index) => (
                        <span 
                          key={index} 
                          className="bg-violet-200 text-violet-900 px-3 py-1 text-sm rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <>
                  {renderSection("About", (
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-gray-700"><strong>Founded:</strong> {Profile.about.yearFounded}</p>
                        <p className="text-gray-700 mt-2">{Profile.about.description}</p>
                      </div>
                      <div>
                        <h3 className="font-semibold text-violet-800 mb-2">Links</h3>
                        {Profile.about.links.map((link, index) => (
                          <a 
                            key={index} 
                            href={`https://${link}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center text-blue-600 hover:text-blue-800 mb-2"
                          >
                            <LinkIcon size={16} className="mr-2" /> {link}
                          </a>
                        ))}
                      </div>
                    </div>
                  ))}

                  {renderSection("Locations", 
                    Profile.locations.map((location, index) => (
                      <div key={index} className="bg-white border border-violet-200 p-4 mb-4 rounded-lg">
                        <div className="flex items-center">
                          <MapPin className="text-violet-800 mr-2" />
                          <h3 className="text-lg font-semibold text-violet-800">
                            {location.city}, {location.country}
                          </h3>
                        </div>
                        {location.isHeadquarters && (
                          <p className="text-gray-600 mt-1">Headquarters</p>
                        )}
                      </div>
                    ))
                  )}

                  {renderSection("Technologies", 
                    <div className="flex flex-wrap gap-2">
                      {Profile.technologies.techList.map((tech, index) => (
                        <span 
                          key={index} 
                          className="bg-violet-200 text-violet-900 px-3 py-1 text-sm rounded-full"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}

                  {renderSection("Achievements & Awards", 
                    Profile.achievements && Profile.achievements.length > 0 ? (
                      Profile.achievements.map((achievement, index) => (
                        <div key={index} className="bg-white border border-violet-200 p-4 mb-4 rounded-lg">
                          <div className="flex items-center">
                            <Award className="text-violet-800 mr-2" />
                            <h3 className="text-lg font-semibold text-violet-800">{achievement.title}</h3>
                          </div>
                          <p className="text-gray-700">{achievement.year}</p>
                          <p className="text-gray-600 mt-1">{achievement.description}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-600">No achievements listed yet.</p>
                    )
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    );
};

export default UserProfileView;
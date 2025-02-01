import { useState ,useContext, useEffect} from "react";
import { Users, Link, SquarePlus, Trash2 } from 'lucide-react';
import { json, useNavigate } from "react-router-dom";
import UserContext from '../../contexts/UserContext';
import Popup from "../Popup/Popup";
export const API_URL = import.meta.env.VITE_API_URL

const ProfileCreationForm = () => {

  const [showPopup, setShowPopup] = useState(false);
  const nav = useNavigate();
  const {user ,setUser}=useContext(UserContext)
  const [mess, setMess] = useState("");
  const [token,setToken] = useState(localStorage.getItem('authToken'));

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
  
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      fetchProfile(parsedUser.username)
    } else {
      nav('/Login'); 
    }
  }, [nav, setUser]);   


  const fetchProfile = async (username) => {
    try {
      const response = await fetch(`${API_URL}/fetchProfile`, {
        method: "POST", 
        headers: {
          'Content-Type': "application/json",
        },
        body: JSON.stringify({ username }),
      });
  
      if (response.status === 200) {
        const prof = await response.json();
        console.log(prof)
        const profileData = prof.profile;
        setAbout(profileData.profile_section.about);
        setEducation(profileData.profile_section.education);
        setExperience(profileData.profile_section.experience);
        setSkills(profileData.profile_section.skills);
      } else {
        Popmess('UNABLE TO FETCH DATA');
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      Popmess('UNABLE TO FETCH DATA');
    }
  };
  



  const submit = async () => {
    const data= {
      about:about,
      education:education,
      experience:experience,
      skills:skills

    }
    const response = await fetch(`${API_URL}/updateProfile`, {
      method: "POST",
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': "application/json",
      },
      body: JSON.stringify({
        user:user,
        data : data
      }),
    })
    
    if(response.status == 200){
      Popmess("Successfully Updated")
    }
    else{
      Popmess("Update Failed")
    }
  }

  const Popmess = async (mess)=>{
    setMess(mess);
    setShowPopup(true);
      setTimeout(() => {
        setShowPopup(false);
      }, 2000);
  }

  const [about, setAbout] = useState({
    name: '',
    age: '',
    description: '',
    links: ['']
  });

  const [education, setEducation] = useState([]);

  const [experience, setExperience] = useState([]);

  const [skills, setSkills] = useState({currentSkill:'',skillList:[]});

  const updateAbout = (field, value) => {
    setAbout(prev => ({ ...prev, [field]: value }));
  };

  const addAboutLink = () => {
    setAbout(prev => ({ ...prev, links: [...prev.links, ''] }));
  };

  const updateAboutLink = (index, value) => {
    const newLinks = [...about.links];
    newLinks[index] = value;
    setAbout(prev => ({ ...prev, links: newLinks }));
  };

  const removeAboutLink = (index) => {
    const newLinks = about.links.filter((_, i) => i !== index);
    setAbout(prev => ({ ...prev, links: newLinks }));
  };

  const addEducation = () => {
    setEducation(prev => [...prev, {
      college: '',
      degree: '',
      gpa: '',
      duration: '',
      ongoing: false
    }]);
  };

  const updateEducation = (index, field, value) => {
    const newEducation = [...education];
    newEducation[index][field] = value;
    setEducation(newEducation);
  };

  const addExperience = () => {
    setExperience(prev => [...prev, {
      company: '',
      role: '',
      duration: '',
      ongoing: false
    }]);
  };

  const updateExperience = (index, field, value) => {
    const newExperience = [...experience];
    newExperience[index][field] = value;
    setExperience(newExperience);
  };

  const addSkill = () => {
    if (skills.currentSkill.trim()) {
      setSkills(prev => ({
        currentSkill: '',
        skillList: [...prev.skillList, prev.currentSkill.trim()]
      }));
    }
  };

  const removeSkill = (skill) => {
    setSkills(prev => ({
      ...prev,
      skillList: prev.skillList.filter(s => s !== skill)
    }));
  };

  return (
    <div className=" min-h-screen p-8 text-black">
      {showPopup && <Popup message= {mess} />}
      <div className="max-w-5xl mx-auto border border-violet-900 rounded-lg p-6 shadow-2xl">
        <h1 className="text-3xl font-bold mb-6 text-black flex items-center">
          <Users className="mr-3" /> Profile Update
        </h1>

        {/* About Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-black">About</h2>
          <div className="grid grid-cols-2 gap-4">
            <input
              placeholder="Name"
              value={about.name}
              onChange={(e) => updateAbout('name', e.target.value)}
              className="border border-violet-900 text-black p-2 rounded"
            />
            <input
              placeholder="Age"
              type="number"
              value={about.age}
              onChange={(e) => updateAbout('age', e.target.value)}
              className="border border-violet-900 text-black p-2 rounded"
            />
          </div>
          <textarea
            placeholder="Short Description"
            value={about.description}
            onChange={(e) => updateAbout('description', e.target.value)}
            className="w-full border border-violet-900 text-black p-2 rounded mt-4 h-24"
          />
          
          {about.links.map((link, index) => (
            <div key={index} className="flex items-center mt-2">
              <input
                placeholder="Link"
                value={link}
                onChange={(e) => updateAboutLink(index, e.target.value)}
                className="flex-grow border border-violet-900 text-black p-2 rounded mr-2"
              />
              {about.links.length > 1 && (
                <button 
                  onClick={() => removeAboutLink(index)} 
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 size={20} />
                </button>
              )}
            </div>
          ))}
          
          <button 
            onClick={addAboutLink} 
            className="mt-2 flex items-center text-black hover:text-violet-900-300"
          >
            <SquarePlus className="mr-2" /> Add Link
          </button>
        </section>

        {/* Education Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-black">Education</h2>
          {education.map((edu, index) => (
            <div key={index} className="border border-violet-900 p-4 rounded mb-4">
              <div className="grid grid-cols-2 gap-4">
                <input
                  placeholder="College Name"
                  value={edu.college}
                  onChange={(e) => updateEducation(index, 'college', e.target.value)}
                  className="border border-violet-900-700 text-black p-2 rounded"
                />
                <input
                  placeholder="Degree"
                  value={edu.degree}
                  onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                  className="border border-violet-900-700 text-black p-2 rounded"
                />
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <input
                  placeholder="GPA"
                  value={edu.gpa}
                  onChange={(e) => updateEducation(index, 'gpa', e.target.value)}
                  className="border border-violet-900-700 text-black p-2 rounded"
                />
                <input
                  placeholder="Duration"
                  value={edu.duration}
                  onChange={(e) => updateEducation(index, 'duration', e.target.value)}
                  className="border border-violet-900-700 text-black p-2 rounded"
                />
              </div>
              <div className="mt-4 flex items-center">
                <input
                  type="checkbox"
                  checked={edu.ongoing}
                  onChange={(e) => updateEducation(index, 'ongoing', e.target.checked)}
                  className="mr-2"
                />
                <span>Currently Studying</span>
              </div>
            </div>
          ))}
          <button 
            onClick={addEducation} 
            className="mt-2 flex items-center text-black hover:text-violet-900-300"
          >
            <SquarePlus className="mr-2" /> Add Education
          </button>
        </section>

        {/* Experience Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-black">Experience</h2>
          {experience.map((exp, index) => (
            <div key={index} className="border border-violet-900 p-4 rounded mb-4">
              <div className="grid grid-cols-2 gap-4">
                <input
                  placeholder="Company Name"
                  value={exp.company}
                  onChange={(e) => updateExperience(index, 'company', e.target.value)}
                  className="border border-violet-900-700 text-black p-2 rounded"
                />
                <input
                  placeholder="Role"
                  value={exp.role}
                  onChange={(e) => updateExperience(index, 'role', e.target.value)}
                  className="border border-violet-900-700 text-black p-2 rounded"
                />
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <input
                  placeholder="Duration"
                  value={exp.duration}
                  onChange={(e) => updateExperience(index, 'duration', e.target.value)}
                  className="border border-violet-900-700 text-black p-2 rounded"
                />
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={exp.ongoing}
                    onChange={(e) => updateExperience(index, 'ongoing', e.target.checked)}
                    className="mr-2"
                  />
                  <span>Currently Working</span>
                </div>
              </div>
            </div>
          ))}
          <button 
            onClick={addExperience} 
            className="mt-2 flex items-center text-black hover:text-violet-900-300"
          >
            <SquarePlus className="mr-2" /> Add Experience
          </button>
        </section>

        {/* Skills Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-black">Skills</h2>
          <div className="flex">
            <input
              placeholder="Enter Skill"
              value={skills.currentSkill}
              onChange={(e) => setSkills(prev => ({ ...prev, currentSkill: e.target.value }))}
              className="flex-grow border border-violet-900 text-black p-2 rounded mr-2"
            />
            <button 
              onClick={addSkill} 
              className="bg-violet-900 text-white px-4 py-2 rounded hover:border border-violet-900-200"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            {skills.skillList.map(skill => (
              <div 
                key={skill} 
                className="border border-violet-900 px-3 py-1 rounded-full flex items-center"
              >
                {skill}
                <button 
                  onClick={() => removeSkill(skill)} 
                  className="ml-2 text-red-500 hover:text-red-700"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </section>
        <button 
          onClick={submit} 
          className="bg-violet-900 text-white m-2 p-2 rounded hover:border border-violet-900-200"
        >
          UPDATE
        </button>
      </div>
    </div>
  );
};

export default ProfileCreationForm;
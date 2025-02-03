import { useState ,useContext, useEffect} from "react";
import { Building2, Link as LinkIcon, SquarePlus, Trash2, MapPin, Award } from 'lucide-react';
import { json, useNavigate } from "react-router-dom";
import UserContext from '../../contexts/UserContext';
import Popup from "../Popup/Popup";
export const API_URL = import.meta.env.VITE_API_URL


const CompanyProfileForm = () => {

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
          setLocations(profileData.profile_section.locations);
          setTechnologies(profileData.profile_section.technologies);
          setAchievements(profileData.profile_section.achievements);
        } else {
          Popmess('UNABLE TO FETCH DATA');
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        Popmess('UNABLE TO FETCH DATA');
      }
    };

    const Popmess = async (mess)=>{
        setMess(mess);
        setShowPopup(true);
          setTimeout(() => {
            setShowPopup(false);
          }, 2000);
      }
    

  const submit = async () => {
    const data= {
      about:about,
      locations:locations,
      technologies:technologies,
      achievements:achievements

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

  const [about, setAbout] = useState({
    companyName: '',
    yearFounded: '',
    description: '',
    links: [''] // Website, LinkedIn, GitHub by default
  });

  const [locations, setLocations] = useState([{
    city: '',
    country: '',
    isHeadquarters: false
  }]);

  const [technologies, setTechnologies] = useState({
    currentTech: '',
    techList: []
  });

  const [achievements, setAchievements] = useState([]);

  // About section handlers
  const updateAbout = (field, value) => {
    setAbout(prev => ({ ...prev, [field]: value }));
  };

  const updateLink = (index, value) => {
    const newLinks = [...about.links];
    newLinks[index] = value;
    setAbout(prev => ({ ...prev, links: newLinks }));
  };

  const addLink = () => {
    setAbout(prev => ({ ...prev, links: [...prev.links, ''] }));
  };

  const removeLink = (index) => {
    const newLinks = about.links.filter((_, i) => i !== index);
    setAbout(prev => ({ ...prev, links: newLinks }));
  };

  // Locations handlers
  const addLocation = () => {
    setLocations(prev => [...prev, { city: '', country: '', isHeadquarters: false }]);
  };

  const updateLocation = (index, field, value) => {
    const newLocations = [...locations];
    newLocations[index][field] = value;
    setLocations(newLocations);
  };

  const removeLocation = (index) => {
    setLocations(prev => prev.filter((_, i) => i !== index));
  };

  // Technologies handlers
  const addTechnology = () => {
    if (technologies.currentTech.trim()) {
      setTechnologies(prev => ({
        currentTech: '',
        techList: [...prev.techList, prev.currentTech.trim()]
      }));
    }
  };

  const removeTechnology = (tech) => {
    setTechnologies(prev => ({
      ...prev,
      techList: prev.techList.filter(t => t !== tech)
    }));
  };

  // Achievements handlers
  const addAchievement = () => {
    setAchievements(prev => [...prev, { title: '', year: '', description: '' }]);
  };

  const updateAchievement = (index, field, value) => {
    const newAchievements = [...achievements];
    newAchievements[index][field] = value;
    setAchievements(newAchievements);
  };

  const removeAchievement = (index) => {
    setAchievements(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="bg-violet-900 min-h-screen p-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg p-6 shadow-2xl">
        <h1 className="text-3xl font-bold mb-6 text-violet-900 flex items-center">
          <Building2 className="mr-3" /> Company Profile Creation
        </h1>

        {/* About Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-violet-900">About</h2>
          <div className="space-y-4">
            <input
              placeholder="Company Name"
              value={about.companyName}
              onChange={(e) => updateAbout('companyName', e.target.value)}
              className="w-full border border-violet-900 p-2 rounded"
            />
            <input
              placeholder="Year Founded"
              type="number"
              value={about.yearFounded}
              onChange={(e) => updateAbout('yearFounded', e.target.value)}
              className="w-full border border-violet-900 p-2 rounded"
            />
            <textarea
              placeholder="Company Description"
              value={about.description}
              onChange={(e) => updateAbout('description', e.target.value)}
              className="w-full border border-violet-900 p-2 rounded h-24"
            />
            
            {about.links.map((link, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  placeholder={`Link ${index + 1}`}
                  value={link}
                  onChange={(e) => updateLink(index, e.target.value)}
                  className="flex-grow border border-violet-900 p-2 rounded"
                />
                {index >= 1 && (
                  <button 
                    onClick={() => removeLink(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={20} />
                  </button>
                )}
              </div>
            ))}
            
            <button 
              onClick={addLink}
              className="flex items-center text-violet-900 hover:text-violet-700"
            >
              <SquarePlus className="mr-2" /> Add Link
            </button>
          </div>
        </section>

        {/* Locations Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-violet-900">Locations</h2>
          {locations.map((location, index) => (
            <div key={index} className="border border-violet-900 p-4 rounded mb-4">
              <div className="grid grid-cols-2 gap-4 mb-2">
                <input
                  placeholder="City"
                  value={location.city}
                  onChange={(e) => updateLocation(index, 'city', e.target.value)}
                  className="border border-violet-900 p-2 rounded"
                />
                <input
                  placeholder="Country"
                  value={location.country}
                  onChange={(e) => updateLocation(index, 'country', e.target.value)}
                  className="border border-violet-900 p-2 rounded"
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={location.isHeadquarters}
                    onChange={(e) => updateLocation(index, 'isHeadquarters', e.target.checked)}
                    className="mr-2"
                  />
                  Headquarters
                </label>
                {locations.length > 1 && (
                  <button 
                    onClick={() => removeLocation(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={20} />
                  </button>
                )}
              </div>
            </div>
          ))}
          <button 
            onClick={addLocation}
            className="flex items-center text-violet-900 hover:text-violet-700"
          >
            <SquarePlus className="mr-2" /> Add Location
          </button>
        </section>

        {/* Technologies Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-violet-900">Technologies</h2>
          <div className="flex mb-4">
            <input
              placeholder="Add Technology"
              value={technologies.currentTech}
              onChange={(e) => setTechnologies(prev => ({ ...prev, currentTech: e.target.value }))}
              className="flex-grow border border-violet-900 p-2 rounded-l"
            />
            <button 
              onClick={addTechnology}
              className="bg-violet-900 text-white px-4 py-2 rounded-r hover:bg-violet-800"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {technologies.techList.map((tech, index) => (
              <div 
                key={index}
                className="bg-violet-100 text-violet-900 px-3 py-1 rounded-full flex items-center"
              >
                {tech}
                <button
                  onClick={() => removeTechnology(tech)}
                  className="ml-2 text-violet-700 hover:text-violet-900"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Achievements Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-violet-900">Achievements & Awards</h2>
          {achievements.map((achievement, index) => (
            <div key={index} className="border border-violet-900 p-4 rounded mb-4">
              <div className="grid grid-cols-2 gap-4 mb-2">
                <input
                  placeholder="Achievement Title"
                  value={achievement.title}
                  onChange={(e) => updateAchievement(index, 'title', e.target.value)}
                  className="border border-violet-900 p-2 rounded"
                />
                <input
                  placeholder="Year"
                  type="number"
                  value={achievement.year}
                  onChange={(e) => updateAchievement(index, 'year', e.target.value)}
                  className="border border-violet-900 p-2 rounded"
                />
              </div>
              <textarea
                placeholder="Achievement Description"
                value={achievement.description}
                onChange={(e) => updateAchievement(index, 'description', e.target.value)}
                className="w-full border border-violet-900 p-2 rounded mt-2"
                rows="2"
              />
              {achievements.length > 1 && (
                <button 
                  onClick={() => removeAchievement(index)}
                  className="mt-2 text-red-500 hover:text-red-700"
                >
                  <Trash2 size={20} />
                </button>
              )}
            </div>
          ))}
          <button 
            onClick={addAchievement}
            className="flex items-center text-violet-900 hover:text-violet-700"
          >
            <SquarePlus className="mr-2" /> Add Achievement
          </button>
        </section>
        <button 
          onClick={submit} 
          className="bg-violet-900 text-white m-2 mt-6 p-2 rounded hover:border border-violet-900-200"
        >
          UPDATE
        </button>
      </div>
    </div>
  );
};

export default CompanyProfileForm;
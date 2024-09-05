import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import UserContext from '../../contexts/UserContext';



const Openedjobs = () => {
  
    const { user } = useContext(UserContext);
    const [data, setData] = useState([]);
    const nav = useNavigate();
    const name = user.username;
    const getJobs = async () => {
      const response = await fetch(`http://localhost:3000/company/:${name}`, {
        method: "GET",
      });
  
      const json = await response.json();
      if(response.status === 200){
        setData(json);
      }
    }
  
    const handle = (item) => {
      nav('/jobstatus', {id: item.ID});
    }
  
    useEffect(()=>{
      getJobs();
    },[]);
  
    return(
      <>
      {/* <ComNavbar/>
      <div>
        <h1>Company</h1>
        <ul>
          {data.map(item => (
            <li key={item.company} onClick={()=>handle(item)}>
               {item.title}{item.company}{item.desc}
            </li>
          ))}
        </ul>
      </div> */}


      <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold my-4">Jobs</h1>
      <ul className="space-y-4 p-2">
        {data.map(item => (
          <li key={item.Company} className="flex justify-between items-center p-4 bg-gray-100 m-2 border-2 shadow-md rounded-lg">
            <div className="text-lg font-semibold">
              {item.title} at {item.Company}
            </div>
            <button
              className="bg-violet-900 text-white px-4 py-2 rounded-md hover:bg-violet-700"
              onClick={() => handle(item)}
            >
              view
            </button>
          </li>
        ))}
      </ul>
    </div>
      </>
    )
  }
  export default Openedjobs; 
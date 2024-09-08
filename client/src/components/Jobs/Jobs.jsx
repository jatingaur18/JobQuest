import React, { useContext, useState, useEffect } from 'react';
import UserContext from '../../contexts/UserContext';
import { useNavigate } from "react-router-dom";

const Jobs = () => {
  const nav = useNavigate();
  const [data, setData] = useState([]);
  const [jobdata, setJobData] = useState({});
  const { user } = useContext(UserContext);

  const getJobs = async () => {
    const response = await fetch("http://localhost:3000/jobs", {
      method: "GET",
    });

    const json = await response.json();
    if (response.status === 200) {
      setData(json);
      console.log(json)
    }
  }

  const apply = async (item) => {
    setJobData(item);
    applysend(item);
  }

  // const applysend = async (item) => {
  //   const response = await fetch('http://localhost:3000/applyjob', {
  //     method: "POST",
  //     headers: {
  //       'Content-Type': "application/json",
  //     },
  //     body: JSON.stringify(
  //       {
  //         job: item,
  //         email: JSON.parse(localStorage.getItem('applicant')),
  //       }
  //     ),
  //   });

  //   if (response.status === 200) {
  //     console.log("done");
  //   } else {
  //     console.log("undone");
  //   }
  // }
  const applysend = async(item)=>{
    nav(`/skilltest/:${item.id}`)
  }
  useEffect(() => {
    if (!user.username) {
      nav('/Login');
    }
    getJobs();
  }, [user, nav]);

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold my-4">Jobs</h1>
      <ul className="space-y-4 p-2">
        {data.map(item => (
          <li key={item.id} className="flex justify-between items-center p-4 bg-gray-100 m-2 border-2 shadow-md rounded-lg">
            <div className="text-lg font-semibold">
              {item.title} at {item.company}
            </div>
            <button
              className="bg-violet-900 text-white px-4 py-2 rounded-md hover:bg-violet-700"
              onClick={() => apply(item)}
            >
              Apply
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Jobs;

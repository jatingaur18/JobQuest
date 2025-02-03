import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider,BrowserRouter } from 'react-router-dom'
import Layout from './Layout.jsx'
import Home from './components/Home/Home.jsx'
import Jobs from './components/Jobs/Jobs.jsx'
import Resume from './components/Resume/Resume.jsx'
import User from './components/User/User.jsx'
import Login from './components/Login/Login.jsx'
import Register from './components/Register/Register.jsx'
import Createjob from './components/Createjobs/Createjobs.jsx'
import Openedjobs from './components/Openedjobs/Openedjobs.jsx'
import Skilltest from './components/Skilltest/Skilltest.jsx'
import Jobstatus from './components/JobStatus/JobStatus.jsx'
import ResumeAnalysis from './components/ResumeAnalysis/ResumeAnalysis.jsx'
import ProfileCreationForm from './components/Details/Details.jsx'
import Companyprofileform from './components/Details/CompanyDetails.jsx'
import Profile from './components/Profile/Profile.jsx'
import Message from './components/Message/Message.jsx'
// import MeetingRoom from './components/Meeting/MeetingRoom.jsx'
import CreateMeeting from './components/Meeting/CreateMeeting.jsx'
import P404 from './components/404.jsx'
// const router=createBrowserRouter([
//   {
//     path:'/',
//     element:<Layout/>,
//     children:[
//       {path:'',
//         element:<Home/>
//       },
//       {
//         path:'About',
//         element:<About/>
//       },
//       {
//         path:'Contacts',
//         element:<Contact/>
//       }

//     ]
//   }
// ])

const router=createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<Layout/>}>
    <Route path='' element={<Home/>}/>
    <Route path='Jobs' element={<Jobs/>}/>
    <Route path='Login' element={<Login/>}/>
    <Route path='Register' element={<Register/>}/>
    <Route path='MyResume' element={<Resume/>}/>
    <Route path='createjob' element={<Createjob/>}/>
    <Route path='Openedjobs' element={<Openedjobs/>}/>
    <Route path='user/:id' element={<User/>}/>
    <Route path='skilltest/:id' element={<Skilltest/>}/>
    <Route path='jobstatus/:id' element={<Jobstatus/>}/>
    <Route path='resumeAnalysis' element={<ResumeAnalysis/>}/>
    <Route path='userProfile' element={<ProfileCreationForm/>}/>
    <Route path='CompanyProfile' element={<Companyprofileform/>}/>
    <Route path='Profile/:id' element={<Profile/>}/>
    <Route path='Message' element={<Message/>}/>
    {/* <Route path='meet/:id' element={<MeetingRoom/>}/> */}
    <Route path='Create-Meet' element={<CreateMeeting/>}/>
    <Route path='*' element={<P404 />} />
    </Route>
  )
)

ReactDOM.createRoot(document.getElementById('root')).render(
    <RouterProvider router={router}/>
)

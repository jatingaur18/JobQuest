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
    
    </Route>
  )
)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    
    <RouterProvider router={router}/>
  </React.StrictMode>,
)

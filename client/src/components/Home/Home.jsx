import React from "react";
import {Link,NavLink} from 'react-router-dom'
// instead of <a> tag we use Link tag cause <a> reloads the whole page
//
function Home(){
    return (
        <div className="mx-auto w-full max-w-7xl">
            <aside className="relative overflow-hidden text-black rounded-lg sm:mx-16  mx-2 sm:py-24">
                <div className="relative z-10 max-w-screen-xl px-4  pb-20 pt-10 sm:py-24 sm:pt-50 mx-auto sm:px-6 lg:px-8">
                    <div className="max-w-xl sm:mt-1 mt-96 space-y-8 text-center sm:pt-50 sm:text-right sm:ml-auto">
                        <h2 className="text-4xl font-bold sm:text-5xl">
                            Land your
                            <span className="block text-4xl">DREAM JOB</span>
                        </h2>

                        <Link
                            className="inline-flex text-white items-center px-6 py-3 font-medium bg-violet-900 rounded-lg hover:opacity-75"
                            to="/"
                        >
                            Get started 
                        </Link>
                    </div>
                </div>

                <div className="absolute inset-0 w-full sm:my-20 sm:pt-1 pt-12 h-full ">
                    <img className="w-96" src="https://img.freepik.com/free-vector/woman-programmer-doing-her-job-laptop_52683-24370.jpg?t=st=1720537047~exp=1720540647~hmac=19139e222b28764a276d8c0bec0faf3b71750e256db25bb8b6f5e5598ae9cb74&w=740" alt="image1" />
                </div>
            </aside>

            <div className="grid  place-items-center sm:mt-20">
                <img className="sm:w-96 w-48" src="https://img.freepik.com/free-vector/modern-office-people-composition-with-flat-design_23-2147904206.jpg?t=st=1720537297~exp=1720540897~hmac=31c269a9507bfce2a9b2a93d7d6d332f206cc68f0bf3866521a48c3202c8c45a&w=740" alt="image2" />
            </div>

            <h1 className="text-center text-2xl sm:text-5xl py-10 font-medium">Start your Career</h1>
        </div>
        );
}

export default Home
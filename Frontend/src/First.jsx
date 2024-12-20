import React, { useState, useEffect } from 'react';
import axios from 'axios';
// Axios is a popular library for making HTTP requests
import { Link } from 'react-router-dom';
import Typewriter from "typewriter-effect";




const First = () => {

    return (
            <div className='w-screen h-screen bg-white text-black font-inter overflow-hidden'>
                <div className='px-[160px] py-[24px] w-full h-full'>
                    

                    {/* Main */}
                    <div className='  flex justify-between items-center'>
                        <h3 className='font-bold'>MyJob</h3>
                        <div className='flex items-center gap-x-2 '>
                            <button><Link to="/login">Log-in</Link></button>
                            <div className='w-[8px] h-full '></div>
                            <button className='w-[100px] h-[36px] border-2 border-black rounded-[16px] '><Link to="/signup">Sign up</Link></button>
                             </div>

                    </div>
                    {/* Main */}

                                                 {/* Other */}
                                                 <div className='w-full h-full flex items-center justify-center text-9xl font-bold'>
            <Typewriter
                onInit={(typewriter) => {
                    typewriter
                        .typeString("Find a job..")
                        .pauseFor(1000)
                        .deleteAll()
                        .typeString("Hire someone..")
                        .start();
                }}
            />  
        </div>
                             {/* Other */}

                </div>
            </div>
    );
};

export default First;
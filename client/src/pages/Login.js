import React from 'react'
import { useState } from 'react';
import {Link} from 'react-router-dom'

import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const Login = () => {

  const initialData={
    username:"",
    password:"",
    role:"operator",
  }

  const[showPassword,setShowPassword]=useState(false);
  const [loginData,setLoginData]=useState(initialData);
  const [Role,setRole]=useState('operator');

  function changeHandler(event){
    setLoginData((prev)=>({
      ...prev,[event.target.name]:event.target.value
    }))
  }
 
  //post that login data to server
  async function submitHandler (e){
    e.preventDefault();
    console.log(loginData);
  }

  const isValid= loginData.username!=="" && loginData.password!=="";

  return (
    <div className=' flex justify-center items-center h-screen bg-opacity-60 bg-gray-300 '>
        <form className='flex flex-col w-[450px] h-[450px] bg-white rounded-md shadow-lg px-6 py-4 justify-center gap-y-3 text-lg' onSubmit={submitHandler}>
          
          <div className='flex flex-row justify-center gap-x-4 text-xl font-bold'>
            <button className={`${Role==='operator'? "bg-red-500 py-1 px-3 rounded-md text-white" : ""}`} 
            onClick={(e)=> {
              e.preventDefault();
              setRole('operator');
              setLoginData((prev) =>({ 
                ...prev,
                role:"operator"
            }))
              }}>Postal Assistant</button>
              
            <button className={`${Role==='officer'? "bg-red-500 py-1 px-3 rounded-md text-white" : ""}`} 
            onClick={(e)=> {
              e.preventDefault();
              setRole('officer')
              setLoginData((prev) =>({ 
                ...prev,
                role:"officer"
               }))
              }}>Officer</button>
          </div>

          <div className="w-full flex flex-col justify-start items-start">
            <label htmlFor="username">Username<sup className='text-red-500'>*</sup></label>
            <input 
            type="text" 
            id="username" 
            name="username" 
            value={loginData.username}
            required
            placeholder='Enter Username'
            onChange={changeHandler}
            onClick={(e)=> e.preventDefault()}
            className='bg-[#e7eef1] py-3 px-2 w-full text-sm rounded-md text-black'
            />
          </div>

        
          <div className="relative w-full flex flex-col justify-start items-start">
            <label htmlFor="password">Password<sup className='text-red-500'>*</sup></label>
            <input 
            type= {showPassword ? ("text") : ("password")}
            id="password" 
            name="password" 
            value={loginData.password}
            required 
            placeholder='Enter Password'
            onChange={changeHandler}
            onClick={(e)=> e.preventDefault()}
            className='bg-[#e7eef1] py-3 px-2 w-full text-sm rounded-md text-black'
            />

            <span onClick={()=>setShowPassword((prev)=>!prev)}
            className='absolute right-3 top-[38px] text-gray-600 cursor-pointer'
            >
              {showPassword ? 
               (<AiOutlineEyeInvisible fontSize={24} fill='#AFB2BF'/>):
               (<AiOutlineEye fontSize={24} fill='#AFB2BF'/>)}
            </span>  
          </div>
        
          <div className='-mt-4 mx-1 flex flex-col justify-start items-start'>
          <Link to="">
            <p className='text-blue-700 text-[14px]'>
             Forgot Password
            </p>
          </Link>
          </div>
          

          <button type="submit"
           disabled={!isValid} 
           className={`${isValid ? "bg-red-500" : "bg-slate-400"} text-white font-bold w-full py-1 my-5 rounded-md`}>
            Login
          </button>

        </form>
      
    </div>
  )
}

export default Login

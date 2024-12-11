import React, { useContext } from 'react'
import img from '../assets/logo.png'
import {Link} from 'react-router-dom'
import { AppContext } from './ContextAPI'

const Navbar = () => {

    const{isLogin}=useContext(AppContext);

  return (
    <div className='sticky top-0 z-50 w-full'>
        <div className='flex px-4 items-center py-3 bg-white shadow-lg justify-between relative h-[60px] w-full'>
          <div className=' absolute left-[55px] -bottom-[60px] w-[200px] h-[90px] animate-scale-pulse'>
            <img src={img} alt="India Post" />
          </div>

          <div className='flex flex-row gap-x-1 justify-center items-center absolute right-6'>
            <Link to="/track-consignment">
              <p className='cursor-pointer text-xl font-semibold'>Track Consignment</p>
            </Link>

            {!isLogin && 
            <Link to="/login">
             <button className=" text-black font-bold py-1 px-4 text-xl  hover:bg-white transition-all duration-400
            hover:text-blue-700">
                Log In
             </button>
            </Link>
            }
          </div>
        </div>
      
    </div>
  )
}

export default Navbar

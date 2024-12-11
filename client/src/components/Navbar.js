import React, { useContext } from 'react'
import img from '../assets/logo.png'
import {Link} from 'react-router-dom'

const Navbar = () => {

  return (
    <div className='sticky top-0 z-50 w-full'>
        <div className='flex px-4 items-center py-2 bg-white shadow-lg justify-between w-full'>
          <Link to="/">
               <img src={img} alt="India Post" width="70px" height="70px" className='mx-6'/>
          </Link>

          <div className='flex flex-row gap-x-1 justify-center items-center absolute right-6'>
            <Link to="/track-consignment">
              <p className='cursor-pointer text-xl font-semibold hover:underline mx-4'>Track Consignment</p>
            </Link>
          </div>
        </div>
      
    </div>
  )
}

export default Navbar

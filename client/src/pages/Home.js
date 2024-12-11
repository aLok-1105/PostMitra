import React from 'react'
import { Link } from 'react-router-dom'
import train from '../assets/train.png'
import mix from '../assets/img.png'


const Home = () => {

  return (
    <div className='w-[100%] h-[100%] flex flex-col justify-center'>
      <div className='flex flex-row justify-center items-center gap-2 '>
        <div className='w-1/2 flex flex-col justify-center items-start px-16'>
            <h2 className="text-5xl text-red-600 font-extrabold flex gap-1 my-4">
              Post Mitra
            </h2>
            <p className='text-gray-600 mt-2 text-xl'>
                Welcome to Post Mitra, your trusted partner for seamless and reliable parcel deliveries with India Speed Post. 
                Whether it's documents, packages, or special consignments, we ensure timely delivery across the nation. 
            </p>

            <Link to="/login">
              <button className=' my-5 py-2 px-3 text-2xl text-white bg-red-600 rounded-md shadow-xl font-semibold hover:scale-110 transition-all duration-500'>Get Started</button>
            </Link>
        </div>
        
        <div className='w-1/2 flex flex-col justify-center items-center '>
            <div>
                <img src={mix} alt="" width="400px" height="400px" loading='lazy' className='' />
            </div>
        </div>

      </div>

      <div>
        <img src={train} alt="" width="550px" height="400px" loading='lazy' className=" animate-move-horizontal"/>
      </div>
    </div>
  )
}

export default Home

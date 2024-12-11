import React from 'react'
import { Link } from 'react-router-dom'
import train from '../assets/train.png'
import mix from '../assets/img.png'


const Home = () => {
    const headingText = "Post  Mitra";
  return (
    <div className='flex w-[100%] h-[100%] justify-center items-center text-2xl'>
      <div className='flex flex-row justify-center items-center gap-2'>
        <div className='w-1/2 flex flex-col justify-center items-start p-16'>
            <h2 className="text-5xl text-red-600 font-extrabold flex gap-1 my-6">
              {headingText.split("").map((char, index) => (
                <span
                 key={index}
                 className="inline-block animate-fade-bounce"
                 style={{ animationDelay: `${index * 0.2}s` }}
                >
                 {char}
                </span>
              ))}
            </h2>
            <p className='text-gray-600 mt-2'>
                Welcome to Post Mitra, your trusted partner for seamless and reliable parcel deliveries with India Speed Post. 
                Whether it's documents, packages, or special consignments, we ensure timely delivery across the nation. 
            </p>

            <Link to="/login">
              <button className=' my-5 py-2 px-3 text-2xl text-white bg-red-600 rounded-md shadow-xl font-semibold hover:scale-110 transition-all duration-500'>Get Started</button>
            </Link>
        </div>
        <div className='w-1/2 flex flex-col justify-center items-center gap-y-12 '>
            <div>
            <img src={train} alt="" width="550px" height="400px" loading='lazy' className=" absolute left-[100px] top-[80px] animate-move-horizontal"/>
            </div>
            <div>
                <img src={mix} alt="" width="400px" height="400px" loading='lazy' className='' />
            </div>
        </div>
            
      </div>
    </div>
  )
}

export default Home

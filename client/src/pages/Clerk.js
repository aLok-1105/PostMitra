import React from 'react'

const Clerk = () => {
  return (
    <>
    <div className='fixed inset-0 z-50 flex justify-center items-center bg-gray-300'>
    <form action="" className='bg-white p-6 rounded-lg shadow-lg w-4/5 relative'>
       <h2 className='text-center font-bold text-xl'>Parcel Details</h2>
       <div>
        <div></div>
        
        <div className='flex flex-row'>

          {/*Sender Details*/}
          <div></div>

          {/*Receiver Details*/}
          <div></div>
        </div>

       </div>

       <button>Submit</button>
    </form>
      
    </div>
    </>
  )
}

export default Clerk

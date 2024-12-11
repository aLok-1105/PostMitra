import axios from 'axios';
import React, { useEffect, useState } from 'react'

export default function Post() {

  const [parcels, setParcels] = useState([])

    useEffect(()=>{
        const getParcels = async() =>{
            try {
                const response = await axios.get('http://localhost:8000/parcel/showParcels', {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true,
                    // timeout: 5000, // Set a timeout (in milliseconds)
                  });
                
                  setParcels(response.data.parcels);

                
                if (response.status === 200) {
                  console.log(response.data);
                } else {
                  console.log("Invalid Credentials");
                //   setError('Invalid Credentials');
                }
              } catch (error) {
                // setError('An error occurred. Please try again later.');
                console.log('Error during login:', error);
              }
        }
        getParcels();
    },[])

  return (
    <>
      {parcels.map((parcel, index) => (
      <div key={index}>
        {/* Render the properties of each parcel here */}
        <h3>Parcel {index + 1}</h3>
        <p>{parcel.name}</p> 
        <p>{parcel.weight} kg</p> 
        <p>{parcel.count}</p>
      </div>
    ))}

    </>
  )
}

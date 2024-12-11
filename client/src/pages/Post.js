import axios from 'axios';
import React, { useEffect } from 'react'


export default function Post() {
    useEffect(()=>{
        const getParcels = async() =>{
            try {
                const response = await axios.get('http://localhost:8000/parcel/showParcels', {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true,
                    // timeout: 5000, // Set a timeout (in milliseconds)
                  });
                
                console.log(response);
                
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
    <div>Post</div>
  )
}

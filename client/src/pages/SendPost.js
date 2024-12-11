
//Interface for the parcel collector entering parcel details
import React,{useEffect,useState} from 'react'

const SendPost = () => {

  //Updating date
  const now = new Date();
  const offsetDate = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
  const formattedDate = offsetDate.toISOString().slice(0, 10); // Corrected for local time
  const [parcelId, setparcelId] = useState('');

  //initializing parcel details
  const initializer={
    parcelId: parcelId,
    date:formattedDate,
    weight:"",
    cost:"",
    postType:"",
    senderDetails:{
      name:"",
      address:"",
      pincode:"",
      contactNo:"",
      email:"",
    },
    receiverDetails:{
      name:"",
      address:"",
      pincode:"",
      contactNo:"",
      email:"",
    }
  }

  const[parcelData,setParcelData]=useState(initializer); //Contains all details of Parcel

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setParcelData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSenderChange = (e) => {
    const { name, value } = e.target;
    setParcelData((prev) => ({
      ...prev,
      senderDetails: { ...prev.senderDetails, [name]: value },
    }));
  };

  const handleReceiverChange = (e) => {
    const { name, value } = e.target;
    setParcelData((prev) => ({
      ...prev,
      receiverDetails: { ...prev.receiverDetails, [name]: value },
    }));
  };


  // Validation
  const isValid =
  parcelData.senderDetails.name &&
  parcelData.receiverDetails.name &&
  parcelData.date &&
  parcelData.weight &&
  parcelData.cost &&
  parcelData.postType
    ? true
    : false;

  

  //submitting the final parcel details Data

  const calculatePostCost = (e) =>{
    e.preventDefault();
    
    const weight = parcelData.weight;
    var parcelId = parcelData.senderDetails.pincode.slice(0, 3) + Math.random().toString(36).slice(2, 8) + parcelData.receiverDetails.pincode.slice(0, 3);
    
    setparcelId(parcelId)
    setParcelData((prevData) => ({
      ...prevData,
      cost: weight.toString()
    }));
    
    // console.log(weight);
    // console.log(parcelData);
    // console.log(parcelId);
    
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validation
    if(!isValid)
     {
     alert("Please fill in all required fields.");
     return;
    }
     console.log(parcelData);
     setParcelData(initializer)
     alert(`Your Tracking Id is: ${parcelId}`)
  }

  return (
    <>
    <div className='fixed inset-0 z-50 flex justify-center items-center bg-gray-300'>
    <form onSubmit={handleSubmit} className='bg-white p-6 rounded-lg shadow-lg w-3/4 relative'>
       <h2 className='text-center font-bold text-3xl mb-3'>Parcel Details</h2>

       <div className='flex flex-col justify-center items-start gap-y-4'>

        <div className='flex flex-col justify-center items-start gap-4 w-full'>
          <div className='flex flex-row justify-evenly items-center gap-4 w-full'>
            <div>
            <label className='text-xl'>Date : </label>
            <input
            type="date"
            name="date"
            value={parcelData.date}
            onChange={handleInputChange}
            className="border p-1 rounded cursor-pointer border-gray-300"
            />
            </div>
           
            <div>
            <label className='text-xl'>Post Type : </label>
            <select 
            id="post-type"
            name="postType"
            value={parcelData.postType}
            onChange={handleInputChange}
            className='border p-1 rounded border-gray-300 cursor-pointer focus:outline-none transition-all duration-300'
            >
              <option value="normal">Normal</option>
              <option value="speed">Speed Post</option>
            </select>
            </div>

          </div>

          <div className='flex flex-row justify-evenly items-center w-full gap-x-4'>
            <div>
             <label htmlFor="">Weight (gm) : </label>
             <input 
             type="text"
             name="weight"
             value={parcelData.weight}
             onChange={handleInputChange}
             className="border p-1 rounded border-gray-300"
              />
            </div>
            
          </div>     
        </div>

        <div className=' w-full h-[1px] bg-slate-500'></div>
        
        <div className='flex flex-row justify-center items-start gap-x-4 w-full'>

          {/*Sender Details*/}
          <div className='flex flex-col justify-center items-center w-full'>
            <h2 className='text-xl font-semibold text-center mb-4'>Sender Details</h2>
            <div className='flex flex-col justify-center items-start gap-y-4'>

              <div className='w-full flex flex-row justify-between'>
              <label htmlFor="">Sender Name: </label>
              <input 
              type="text"
              name="name"
              value={parcelData.senderDetails.name}
              onChange={handleSenderChange}
              className="border p-1 rounded w-[400px] mx-1 border-gray-300"
              />
              </div>

              <div className='w-full flex flex-row justify-between'>
              <label htmlFor="">Address: </label>
              <input 
              type="text"
              name="address"
              value={parcelData.senderDetails.address}
              onChange={handleSenderChange}
              className="border p-1 rounded w-[400px] mx-1 border-gray-300"
              />
              </div>

              <div className='w-full flex flex-row justify-between'>
              <label htmlFor="">Pincode: </label>
              <input 
              type="text"
              name="pincode"
              value={parcelData.senderDetails.pincode}
              onChange={handleSenderChange}
              className="border p-1 rounded w-[400px] mx-1 border-gray-300"
              />
              </div>

              <div className='w-full flex flex-row justify-between'>
              <label htmlFor="">Contact No.: </label>
              <input 
              type="text"
              name="contactNo"
              value={parcelData.senderDetails.contactNo}
              onChange={handleSenderChange}
              className="border p-1 rounded w-[400px] mx-1 border-gray-300"
              />
              </div>
              
              <div className='w-full flex flex-row justify-between'>
              <label htmlFor="">Email: </label>
              <input 
              type="text"
              name="email"
              value={parcelData.senderDetails.email}
              onChange={handleSenderChange}
              className="border p-1 rounded w-[400px] mx-1 border-gray-300"
              />
              </div>

            </div>
          </div>

          {/*Receiver Details*/}
          <div className='flex flex-col justify-center items-center w-full'>
            <h2 className='text-xl font-semibold text-center mb-4'>Receiver Details</h2>

            <div className='flex flex-col justify-center items-start gap-y-4'>

              <div className='w-full flex flex-row justify-between'>
              <label htmlFor="">Receiver Name: </label>
              <input 
              type="text"
              name="name"
              value={parcelData.receiverDetails.name}
              onChange={handleReceiverChange}
              className="border p-1 rounded w-[400px] mx-1 border-gray-300"
              />
              </div>

              <div className='w-full flex flex-row justify-between'>
              <label htmlFor="">Address: </label>
              <input 
              type="text"
              name="address"
              value={parcelData.receiverDetails.address}
              onChange={handleReceiverChange}
              className="border p-1 rounded w-[400px] mx-1 border-gray-300"
              />
              </div>
              
              <div className='w-full flex flex-row justify-between'>
              <label htmlFor="">Pincode: </label>
              <input 
              type="text"
              name="pincode"
              value={parcelData.receiverDetails.pincode}
              onChange={handleReceiverChange}
              className="border p-1 rounded w-[400px] mx-1 border-gray-300"
              />
              </div>

              <div className='w-full flex flex-row justify-between'>
              <label htmlFor="">Contact No.: </label>
              <input 
              type="text"
              name="contactNo"
              value={parcelData.receiverDetails.contactNo}
              onChange={handleReceiverChange}
              className="border p-1 rounded w-[400px] mx-1 border-gray-300"
              />
              </div>

              <div className='w-full flex flex-row justify-between'>
              <label htmlFor="">Email: </label>
              <input 
              type="text"
              name="email"
              value={parcelData.receiverDetails.email}
              onChange={handleReceiverChange}
              className="border p-1 rounded w-[400px] mx-1 border-gray-300"
              />
              </div>
            </div>
          </div>
        </div>

       </div>
       <div className='my-5'>
        <label htmlFor="">Cost (Rs.) : </label>
        <input 
        type="text"
        name="cost"
        value={parcelData.cost}
        onChange={handleInputChange}
        className="border p-1 rounded border-gray-300"
        />
      <button className='bg-blue-200 mx-5 p-2'  onClick={calculatePostCost}>Calculate Cost</button>
      </div>
       <button className={`${isValid ? "bg-blue-500 text-white hover:bg-blue-600 hover:text-white transition-all duration-300": ""} my-6 text-2xl text-gray-800 font-semibold border stroke-slate-400 shadow-lg py-1 px-3 rounded-md 
      `} type='submit' disabled={!isValid} >Submit</button>
    </form>
      
    </div>
    </>
  )
}

export default SendPost

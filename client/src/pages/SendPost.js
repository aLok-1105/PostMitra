
//Interface for the parcel collector entering parcel details
import axios from 'axios';
import React,{useEffect,useState} from 'react'

const Clerk = () => {

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
    let val;
    if(parcelData.postType === '"normal"'){
      val = '0';
    }
    else{
      val = '1';
    }

    var parcelId = parcelData.senderDetails.pincode.slice(0, 3) + Math.random().toString(36).slice(2, 8) + parcelData.receiverDetails.pincode.slice(0, 3) + val;
    
    setparcelId(parcelId)
    console.log(parcelId);
    
    setParcelData((prevData) => ({
      ...prevData,
      cost: weight.toString(),
      parcelId: parcelId
    }));
    
    // console.log(weight);
    // console.log(parcelData);
    // console.log(parcelId);
    
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validation
    if(!isValid)
     {
     alert("Please fill in all required fields.");
     return;
    }
    try {
      // Send POST request to backend
      const response = await axios.post('http://localhost:8000/parcel/registerParcel', parcelData, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true, 
    });
      // console.log(response.data);
      // console.log(parcelId);
      
      alert(`Your Tracking Id is: ${parcelId}`);
      setParcelData(initializer); // Reset form
    } catch (error) {
      // Handle error during request
      console.error("Error submitting parcel data:", error);
      alert("Failed to submit parcel data. Please try again.");
    }
  }

  return (
<>
<div className="inset-0 z-50 flex justify-center items-center bg-gray-300">
  <form 
    onSubmit={handleSubmit} 
    className="bg-white p-8 rounded-lg shadow-lg w-4/5 max-w-4xl relative"
  >
    <h2 className="text-center font-bold text-3xl mb-6">Parcel Details</h2>

    <div className="space-y-8">

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col">
            <label className="text-lg font-medium mb-2">Date:</label>
            <input
              type="date"
              name="date"
              value={parcelData.date}
              onChange={handleInputChange}
              className="border p-2 rounded w-full border-gray-300 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-lg font-medium mb-2">Post Type:</label>
            <select 
              id="post-type"
              name="postType"
              value={parcelData.postType}
              onChange={handleInputChange}
              className="border p-2 rounded w-full border-gray-300 cursor-pointer focus:ring-2 focus:ring-blue-500"
            >
              <option value="normal">Normal</option>
              <option value="speed">Speed Post</option>
              <option value="medicines">Medicines</option>
              <option value="food">Edibles - Food</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col">
          <label className="text-lg font-medium mb-2">Weight (gm):</label>
          <input
            type="text"
            name="weight"
            value={parcelData.weight}
            onChange={handleInputChange}
            className="border p-2 rounded w-full border-gray-300 focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="w-full h-[1px] bg-gray-400"></div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Sender Details */}
        <div>
          <h2 className="text-xl font-semibold mb-4 text-center">Sender Details</h2>
          <div className="space-y-4">
            {['name', 'address', 'pincode', 'contactNo', 'email'].map((field) => (
              <div key={field} className="flex flex-col">
                <label className="text-lg font-medium mb-2">
                  {field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')}:
                </label>
                <input
                  type="text"
                  name={field}
                  value={parcelData.senderDetails[field]}
                  onChange={handleSenderChange}
                  className="border p-2 rounded w-full border-gray-300 focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Receiver Details */}
        <div>
          <h2 className="text-xl font-semibold mb-4 text-center">Receiver Details</h2>
          <div className="space-y-4">
            {['name', 'address', 'pincode', 'contactNo', 'email'].map((field) => (
              <div key={field} className="flex flex-col">
                <label className="text-lg font-medium mb-2">
                  {field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')}:
                </label>
                <input
                  type="text"
                  name={field}
                  value={parcelData.receiverDetails[field]}
                  onChange={handleReceiverChange}
                  className="border p-2 rounded w-full border-gray-300 focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="w-full flex flex-col items-start space-y-4">
        <label className="text-lg font-medium">Cost (Rs.):</label>
        <div className="flex gap-4">
          <input
            type="text"
            name="cost"
            value={parcelData.cost}
            onChange={handleInputChange}
            className="border p-2 rounded w-full max-w-xs border-gray-300 focus:ring-2 focus:ring-blue-500"
          />
          <button 
            className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600 transition-all duration-300"
            onClick={calculatePostCost}
          >
            Calculate Cost
          </button>
        </div>
      </div>

      <div className="flex justify-center">
        <button
          className={`${
            isValid
              ? "bg-blue-500 text-white hover:bg-blue-600"
              : "bg-gray-400 cursor-not-allowed"
          } px-6 py-3 rounded-md shadow-lg text-2xl font-semibold transition-all duration-300`}
          type="submit"
          disabled={!isValid}
        >
          Submit
        </button>
      </div>
    </div>
  </form>
</div>
</>

  )
}

export default Clerk

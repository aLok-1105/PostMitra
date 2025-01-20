import React, { useState } from "react";
import logoPost from "./assets/logoPost.png";
import Logo from "./assets/logo.png";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate from react-router-dom
import "./login.css";


export function Login({ onSubmit }) {
    const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(""); // Added error state
  const [username, setUsername] = useState('')

  const handleSubmit = ((e)=>{
    e.preventDefault()
    // const username = username.split("@")[0];
    if(username.split("@")[0] === password){
        return onSubmit((username.charAt(0).toUpperCase() + username.slice(1)).split("@")[0])
    }
    else{
        alert('Invalid Credentials!!')
    }
  });


  const navigate = useNavigate(); // Initialize navigate function
    return (
        <div className="login-main">
      <div className="login-left">
        <img src={logoPost} alt="Logo" />
      </div>
      <div className="login-right">
        <div className="login-right-container">
          <div className="login-logo">
            <img src={Logo} alt="Logo" />
          </div>
          <div className="login-center">
            <h2 style={{color: '#800000' }}>Welcome SHO</h2>
            <p>Please enter your details</p>
            <form onSubmit={handleSubmit}>
              <input
                type="email"
                placeholder="Email" 
                value={username}
                // onChange={(e) => setEmail(e.target.value)}
                onChange={e => setUsername(e.target.value)}
                required
              />
              <div className="pass-input-div">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {showPassword ? (
                  <FaEyeSlash
                    onClick={() => setShowPassword(!showPassword)}
                  />
                ) : (
                  <FaEye onClick={() => setShowPassword(!showPassword)} />
                )}
              </div>
              
              {error && <p className="error">{error}</p>} {/* Display error */}

              <div className="login-center-buttons">
                <button type="submit">Log In</button> {/* Changed to submit */}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
        // <>
        //     <h1>Welcome</h1>
        //     <p>What should people call you?</p>
        //     <form onSubmit={e => {
        //         e.preventDefault()
        //         onSubmit(username)
        //     }}>
        //         <input 
        //             type="text" 
        //             value={username} 
        //             placeholder="username"
        //             onChange={e => setUsername(e.target.value)} />
        //         <input type="submit" />
        //     </form>
        // </>
    )
}


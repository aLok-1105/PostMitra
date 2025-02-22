import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate from react-router-dom

const Register = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("Operator");
    const [error, setError] = useState(""); // Added error state

    const navigate = useNavigate(); // Initialize navigate function

    const handleSubmit = async (ev) => {
        ev.preventDefault();
        if(!email || !password || !role) {
            console.log("all fields are required");
            return;
        }
        try {
            const response = await axios.post(
                "http://localhost:8000/auth/register",
                {
                    email,
                    password,
                    role,
                },
                {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true, // This option cookies with cross-site requests
                }
            );
            console.log(response.data)
        }
        catch (error) {
            console.error("Error during login:", error);
        }
    };

    return (
        <div>
            <h1>Register</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password" placeholder="Password"
                    value={password}    
                    onChange={(e) => setPassword(e.target.value)}
                />                
                <select value={role} onChange={(e) => setRole(e.target.value)}> 
                    <option value="Officer">Officer</option>    
                    <option value="Operator">Operator</option>
                </select>                

                <button type="submit">Register</button>
            </form>
        </div>        
    );
};

export default Register;
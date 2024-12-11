import React, { useState } from "react";
import logoPost from "../assets/logoPost.png";
import Logo from "../assets/logo.png";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate from react-router-dom
import "../login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(""); // Added error state

  const navigate = useNavigate(); // Initialize navigate function

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8000/auth/login",
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

      if (response.status === 200 && response.data.role === "Officer") {
        setError("");
        alert("Login successful!");
        navigate("/officer"); // Navigate to officer page
      } else if (
        response.status === 200 &&
        response.data.role === "Operator"
      ) {
        setError("");
        alert("Login successful!");
        navigate("/sendpost"); // Navigate to sendpost page
      } else {
        setError("Invalid Credentials");
      }
    } catch (error) {
      setError("Invalid Credentials");
      console.error("Error during login:", error);
    }
  };

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
            <h2 style={{color: '#800000' }}>Welcome back!</h2>
            <p>Please enter your details</p>
            <form onSubmit={handleSubmit}> {/* Added onSubmit handler */}
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
              <div className="pass-input-div">
                <select
                  name="role"
                  id="dropdown"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="Operator">Operator</option>
                  <option value="Officer">Officer</option>
                </select>
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
  );
};

export default Login;

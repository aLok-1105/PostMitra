import React from "react";
import logoPost from "../assets/logoPost.png";
import Logo from "../assets/logo.png";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("Operator");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async(e) => {
    e.preventDefault();

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
    <div className="flex h-screen">
      <div className="flex-1 flex justify-center items-center bg-gray-200">
        <img src={logoPost} alt="Logo" className="w-96" />
      </div>
      <div className="flex-1 flex justify-center items-center">
        <div className="w-4/5 flex flex-col justify-center">
          <div className="flex justify-center pb-8">
            <img src={Logo} alt="Logo" className="w-12" />
          </div>
          <div className="text-center">
            <h2 className="text-4xl font-bold text-maroon">Welcome back!</h2>
            <p className="text-lg text-gray-700">Please enter your details</p>
          </div>
          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="hub@indiapost.com"
              className="w-full p-4 border-b border-black focus:border-blue-500 outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <div className="relative w-full">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border-b border-gray-400 focus:outline-none focus:border-blue-500"
              />
              {showPassword ? (
                <FaEyeSlash
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
                />
              ) : (
                <FaEye
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
                />
              )}
            </div>

            <select
              className="w-full p-4 border-b border-black focus:border-blue-500 outline-none bg-transparent text-lg"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="Operator">Operator</option>
              <option value="Officer">Officer</option>
            </select>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              className="w-full p-4 bg-black text-white font-semibold rounded-lg hover:bg-gray-900 transition"
            >
              Log In
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
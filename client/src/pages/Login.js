import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [role, setRole] = useState("Operator");
  const navigate = useNavigate(); 

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/auth/login', {
        email,
        password,
        role
      }, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true, // This option cookies with cross-site requests
      });


      if (response.status === 200 && response.data.role === "Officer") {
        setError("");
        alert("Login successful!");
        navigate('/officer');
      } 
      else if(response.status === 200 && response.data.role === "Operator"){
        setError("");
        alert("Login successful!");
        navigate('/sendpost');
      }else {
        setError("Invalid Credentials");
      }
    } catch (error) {
      setError("Invalid Credentials");
      console.error("Error during login:", error);
    }
  };

  const styles = {
    container: {
      background: "white",
      borderRadius: "8px",
      padding: "32px",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
      width: "100%",
      maxWidth: "400px",
      margin: "0 auto",
      marginTop: "50px", // Center vertically
    },
    title: {
      textAlign: "center",
      fontSize: "24px",
      color: "#333",
      marginBottom: "24px",
    },
    form: {
      display: "flex",
      flexDirection: "column",
      gap: "16px",
    },
    input: {
      padding: "12px",
      fontSize: "14px",
      border: "1px solid #ddd",
      borderRadius: "4px",
      width: "100%",
    },
    error: {
      color: "red",
      fontSize: "12px",
      textAlign: "center",
    },
    button: {
      backgroundColor: "#4a90e2",
      color: "white",
      padding: "12px",
      fontSize: "16px",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      transition: "background-color 0.3s",
      width: "100%",
    },
    buttonHover: {
      backgroundColor: "#357ab7",
    },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Login</h1>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
          required
        />
        <select
          name="role"
          id="dropdown"
          value={role} // Controlled by useState
          onChange={(e) => setRole(e.target.value)} // Update state on change
          style={styles.input}
        >
          <option value="Operator">Operator</option>
          <option value="Officer">Officer</option>
        </select>

        {error && <p style={styles.error}>{error}</p>} {/* Display error if exists */}

        <button
          type="submit"
          style={styles.button}
          onMouseOver={(e) =>
            (e.target.style.backgroundColor = styles.buttonHover.backgroundColor)
          }
          onMouseOut={(e) =>
            (e.target.style.backgroundColor = styles.button.backgroundColor)
          }
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
// client/src/components/Register.js
import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function Register() {
  const apiUrl = process.env.REACT_APP_API_URL;
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("player"); // default to player role
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${apiUrl}/api/auth/register`, {
        username,
        password,
        role,
      });
      alert(res.data); // Display success message
      navigate("/login"); // Redirect to login page
    } catch (err) {
      setError(err.response?.data || "Registration failed");
      setUsername("");
      setPassword("");
      setTimeout(() => setError(""), 3000);
    }
  };

  return (
    <div className="bg-black flex justify-center items-center w-screen h-screen">
      <div className="translate-x-2/r   flex flex-col justify-center items-center px-16 py-16 rounded-lg bg-white">
        <h2 className="text-2xl text-black">Register</h2>
        <form onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-64 h-12 rounded-md pl-4 placeholder:pl-2 block mt-4 border border-black outline-none"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-64 h-12 rounded-md pl-4 placeholder:pl-2 block mt-4 border border-black outline-none"
            required
          />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-64 px-16 py-2 rounded-lg mt-4 border border-black"
          >
            <option value="player">Player</option>
            <option value="admin">Admin</option>
          </select>
          <div className="text-center">
            <button
              type="submit"
              className="px-16 py-1 mt-4 text-white bg-blue-800 text-center rounded-lg "
            >
              Register
            </button>
          </div>
          {error && (
            <p className="text-center text-base font-medium text-red-600 mt-2 ">
              {error}
            </p>
          )}

          <p className="mt-4 text-center">
            Already have account ?{" "}
            <Link to="/login">
              <span className="text-red-800 text-lg">Login</span>
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Register;

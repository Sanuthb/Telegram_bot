import React, { useState } from "react";
import axios from "axios";
import {useNavigate} from 'react-router-dom'
 
const Sigin = () => {
  const [username, setusername] = useState("");
  const [password, setpassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("https://telegram-bot-node-server.onrender.com/loginuser/auth", {
        username,
        password,
      });

      localStorage.setItem("token", response.data.token);
      navigate('/dashboard');
    } catch (err) {
      console.error("Error:", err);
      return;
    }
    setpassword("");
    setusername("");
  };

  return (
    <div className="bg-primary w-full h-screen flex items-center justify-center text-white">
      <div className="bg-secondary rounded-lg flex gap-5 flex-col w-[30rem] p-4">
        <h1 className="text-3xl font-bold text-center">Login</h1>
        <form action="" className="flex gap-5 flex-col">
          <input
            type="text"
            name=""
            id="username"
            className="p-2 bg-transparent border-b-[.1rem] border-accent outline-none"
            placeholder="username"
            value={username}
            onChange={(e) => {
              setusername(e.target.value);
            }}
          />
          <input
            type="password"
            name=""
            id="password"
            className="p-2 bg-transparent border-b-[.1rem] border-accent outline-none"
            placeholder="password"
            value={password}
            onChange={(e) => {
              setpassword(e.target.value);
            }}
          />
          <button
            type="submit"
            className="bg-accent rounded-lg p-2"
            onClick={handleSubmit}
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Sigin;

import React, { useState } from "react";
import axios from "axios";
import UserComp from "../Components/UserComp";

const AddUsers = () => {
  const [username, setusername] = useState("");
  const [password, setpassword] = useState("");
  const [role, setrole] = useState("");
  const [message, setmessage] = useState("");
  const [refresh,setrefresh] = useState(false);

  const handleSubmit = async(e) => {
    e.preventDefault();
    try{
      const response = await axios.post("http://localhost:8000/adduser",{
        username,
        password,
        role
      })
      setmessage(response.data.message)
      setrefresh((prev)=>!prev)
    }catch(e){
      console.error("Error:", e);
      setmessage("Cannot add user")
    }
    setusername("");
    setpassword("");
    setrole("");
  }

  return (
    <div className="p-3">
      <div className="bg-secondary rounded-lg w-full p-3 flex flex-col items-center justify-center gap-10">
        <h1 className="text-2xl ">Add users</h1>
        <form
          action=""
          className="w-full flex gap-5 items-center justify-center"
        >
          <input
            type="text"
            name=""
            id="username"
            placeholder="username"
            className="bg-transparent outline-none border-b-[.1rem] border-accent p-2"
            value={username}
            onChange={(e) => setusername(e.target.value)}
          />
          <input
            type="password"
            name=""
            id="password"
            placeholder="password"
            className="bg-transparent outline-none border-b-[.1rem] border-accent p-2"
            value={password}
            onChange={(e) => setpassword(e.target.value)}
          />
          <input
            type="text"
            name=""
            id="role"
            placeholder="role"
            className="bg-transparent outline-none border-b-[.1rem] border-accent p-2"
            value={role}
            onChange={(e) => setrole(e.target.value)}
          />
          <button className="bg-accent rounded-lg p-2 " onClick={handleSubmit}>Add Users</button>
        </form>
        <h1>{message}</h1>
      </div>
      <UserComp refresh={refresh}/>
    </div>
  );
};

export default AddUsers;

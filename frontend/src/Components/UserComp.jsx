import React, { useEffect, useState } from "react";
import axios from "axios"; 

const UserComp = ({ refresh }) => {
  const [data, setData] = useState([]);


  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:8000/users/getusers");
      setData( response.data);
    } catch (err) {
      console.error("Error fetching user data:", err);
    }
  };
  

  useEffect(() => {
    fetchUsers()
  }, [refresh]);

  const handleDeleteUser = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/users/deleteusers/${id}`);
      fetchUsers()
    } catch (err) {
      console.error("Error deleting user data:", err);
    }
  };

  return (
    <div className="bg-secondary rounded-lg mt-3 p-5 flex flex-wrap w-full gap-2">
      {data.map((user) => (
        <div
          key={user.id}
          className="flex flex-col gap-5 p-2 border-[.1rem] border-accent rounded-lg"
        >
          <span className="font-medium">Username: {user.username}</span>
          <span className="font-medium">Role: {user.role}</span>
          <button
            onClick={() => handleDeleteUser(user.id)}
            className="bg-red-600 rounded-lg p-2"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
};

export default UserComp;

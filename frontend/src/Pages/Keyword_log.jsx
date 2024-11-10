import React, { useEffect } from "react";
import { useRecoilState } from "recoil";
import { messagesState } from "../Atoms/Atoms";
import axios from "axios";

const Keyword_log = () => {
  const [messageData, setMessageData] = useRecoilState(messagesState);

  useEffect(() => {
        axios
        .get("http://localhost:8000/messages")
        .then((response) => {
          setMessageData(response.data);
          console.log("Fetched messages:", response.data);
        })
        .catch((error) => {
          console.error("Error fetching messages:", error);
        });
  }, [messageData]);

  return (
    <div className="flex flex-wrap p-5 gap-5 overflow-y-scroll h-screen">
      {messageData && messageData.length > 0 ? (
        messageData.map((data, index) => {
          return (
            <div
              className="bg-secondary rounded-lg border-[.1rem] border-accent w-fit text-white h-fit "
              key={index}
            >
              <div className="bg-accent w-full p-2 rounded-tl-lg rounded-tr-lg"></div>
              <div className="flex flex-col w-fit p-5">
                <span className="font-medium">
                  Chat Id: <span> {data.chat_id}</span>
                </span>
                <span className="font-medium">
                  Channel Name: <span> {data.channel_name}</span>
                </span>
                <span className="font-medium">
                  Username: <span> {data.username}</span>
                </span>
                <span className="font-medium">
                  UserId: <span> {data.user_id}</span>
                </span>
                <span className="font-medium">
                  Groupname: <span> {data.groupname}</span>
                </span>
                <span className="font-medium">
                  Text: <span> {data.text}</span>
                </span>
                <span className="font-medium">
                  Time: <span> {new Date(data.timestamp).toLocaleString()}</span>
                </span>
              </div>
            </div>
          );
        })
      ) : (
        <div>No messages available.</div>
      )}
    </div>
  );
};

export default Keyword_log;

import React, { useState, useEffect } from 'react';

function Image_rec() {``
  const [messageData, setMessageData] = useState(null);

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:5002/ws');

    socket.onopen = () => {
      console.log('Connected to WebSocket');
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMessageData(data);
    };

    socket.onclose = () => {
      console.log('Disconnected from WebSocket');
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return () => socket.close(); 
  }, []);

  return (
    <div>
      <h1>Real-Time Drug-Related Message Detection</h1>
      {messageData ? (
        <div>
          <p><strong>Channel Name:</strong> {messageData.channel_name || 'Private Chat'}</p>
          <p><strong>Username:</strong> {messageData.username}</p>
          <p><strong>Message:</strong> {messageData.text}</p>
          <p><strong>Timestamp:</strong> {messageData.timestamp}</p>
          <p><strong>Keywords Detected:</strong> {messageData.keywords_detected.join(', ')}</p>
        </div>
      ) : (
        <p>No drug-related messages detected yet.</p>
      )}
    </div>
  );
}



export default Image_rec

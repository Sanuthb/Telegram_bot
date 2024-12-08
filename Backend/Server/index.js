import express from 'express';
import { PrismaClient } from '@prisma/client';
import { WebSocketServer, WebSocket } from 'ws';
import cors from 'cors';
import dotenv from 'dotenv';
import Messageroute from './Routes/Message.js';
import Statsroute from './Routes/Stats.js';
import userRouter from './Routes/userRoutes.js';

dotenv.config();

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

const wss = new WebSocketServer({ port: 5001 });
let clients = [];

wss.on('connection', (ws) => {
  clients.push(ws);
  console.log('Client connected to WebSocket server.');

  ws.on('close', () => {
    clients = clients.filter(client => client !== ws);
    console.log('Client disconnected from WebSocket server.');
  });
});

function notifyClients(message) {
  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  });
}

const pythonWs = new WebSocket('ws:/localhost:5002/ws');

pythonWs.on('open', () => {
  console.log('Connected to Python WebSocket server.');
});

pythonWs.on('message', async (data) => {
  try {
    const messageData = JSON.parse(data);
    console.log('Received message from Python WebSocket:', messageData);

    const { chat_id, username, text, timestamp, keywords_detected, userid,groupname } = messageData;
    const latitude = messageData.latitude || null;
    const longitude = messageData.longitude || null;

    if (latitude && longitude) {
      // Update the user's location when location data is received
      const updatedMessage = await prisma.message.updateMany({
        where: { user_id: userid },
        data: { latitude, longitude },
      });

      if (updatedMessage.count > 0) {
        console.log(`Updated location for user_id: ${userid}`);
      } else {
        console.log(`No existing record found for user_id: ${userid}, skipping location update.`);
      }
    } else {
      // Insert a new message into the database
      const savedMessage = await prisma.message.create({
        data: {
          chat_id,
          username,
          user_id: userid,
          groupname,
          text,
          timestamp: new Date(timestamp),
          keywords_detected,
          latitude, // Null if not provided
          longitude, // Null if not provided
        },
      });

      notifyClients(savedMessage); // Notify WebSocket clients about the new message
      console.log('Inserted new message into the database:', savedMessage);
    }
  } catch (error) {
    console.error('Error processing message from Python WebSocket:', error);
  }
});

app.use('/messages',Messageroute)
app.use('/stats',Statsroute)
app.use('/adduser', userRouter)
app.use('/loginuser',userRouter)
app.use('/users',userRouter)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

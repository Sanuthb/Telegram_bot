import express from 'express';
import { PrismaClient } from '@prisma/client';
import { WebSocketServer, WebSocket } from 'ws'; 
import cors from 'cors';
import dotenv from 'dotenv';

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

const pythonWs = new WebSocket('wss://telegram-bot-ijo7.onrender.com/ws');

pythonWs.on('open', () => {
  console.log('Connected to Python WebSocket server.');
});

pythonWs.on('message', async (data) => {
  try {
    const messageData = JSON.parse(data);
    console.log('Received message from Python WebSocket:', messageData);

    // Handle missing fields by assigning default values or skipping invalid data
    const latitude = messageData.latitude || null;
    const longitude = messageData.longitude || null;

    // Ensure that latitude and longitude exist before updating
    if (latitude && longitude) {
      // Update the user's location based on the user_id
      const updatedMessage = await prisma.message.updateMany({
        where: {
          user_id: messageData.userid,  // Find message by user_id
        },
        data: {
          latitude: latitude,   // Update latitude
          longitude: longitude, // Update longitude
        },
      });

      if (updatedMessage.count > 0) {
        console.log(`Updated location for user_id: ${messageData.userid}`);
      } else {
        console.log(`No message found for user_id: ${messageData.userid}`);
      }
    } else {
      console.log('No location data provided, skipping location update.');
    }

  } catch (error) {
    console.error('Error processing message from Python WebSocket:', error);
  }
});



app.get('/messages', async (req, res) => {
  try {
    const messages = await prisma.message.findMany();
    const serializedMessages = messages.map(message => ({
      ...message,
      chat_id: message.chat_id.toString(),
      user_id: message.user_id.toString(),
      latitude: message.latitude,
      longitude: message.longitude,
    }));

    res.json(serializedMessages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

app.get('/stats', async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const messagesToday = await prisma.message.count({
      where: {
        timestamp: {
          gte: today, 
        },
      },
    });
    const totalMessages = await prisma.message.count();
    res.json({
      messagesToday,
      totalMessages,
      today,
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

app.post('/detect-drug-message', async (req, res) => {
  const { chat_id, channel_name, username, text, timestamp, keywords_detected, latitude, longitude } = req.body;

  try {
    const savedMessage = await prisma.message.create({
      data: {
        chat_id,
        channel_name,
        username,
        text,
        timestamp: new Date(timestamp),
        keywords_detected,
        latitude,  
        longitude, 
      },
    });

    notifyClients(savedMessage);
    res.status(200).json(savedMessage);
  } catch (error) {
    console.error("Error saving message:", error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

import express from 'express';
import { PrismaClient } from '@prisma/client';
import { WebSocketServer, WebSocket } from 'ws'; 
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 5000;

// Configure Express to use JSON and CORS
app.use(express.json());
app.use(cors());

// Set up WebSocket server on port 5001 for real-time updates to connected clients
const wss = new WebSocketServer({ port: 5001 });
let clients = [];

// Handle new WebSocket connections from clients
wss.on('connection', (ws) => {
  clients.push(ws);
  console.log('Client connected to WebSocket server.');

  ws.on('close', () => {
    clients = clients.filter(client => client !== ws);
    console.log('Client disconnected from WebSocket server.');
  });
});

// Notify connected clients of detected messages
function notifyClients(message) {
  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  });
}

// Connect to the Python FastAPI WebSocket server
const pythonWs = new WebSocket('ws://localhost:5002/ws'); 

pythonWs.on('open', () => {
  console.log('Connected to Python WebSocket server.');
});

// Listen for messages from the Python WebSocket and save to the database
pythonWs.on('message', async (data) => {
  try {
    const messageData = JSON.parse(data);
    console.log('Received message from Python WebSocket:', messageData);

    // Save received message to the database
    const savedMessage = await prisma.message.create({
      data: {
        chat_id: messageData.chat_id,
        channel_name: messageData.channel_name,
        username: messageData.username,
        groupname: messageData.groupname,
        user_id: messageData.userid,
        text: messageData.text,
        timestamp: new Date(messageData.timestamp),
        keywords_detected: messageData.keywords_detected,
      },
    });

    // Notify connected clients with the new message
    notifyClients(savedMessage);
  } catch (error) {
    console.error('Error processing message from Python WebSocket:', error);
  }
});

// REST endpoint to retrieve all messages
app.get('/messages', async (req, res) => {
  try {
    const messages = await prisma.message.findMany();
    res.json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// REST endpoint to get message statistics
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

// REST endpoint to manually save a detected message
app.post('/detect-drug-message', async (req, res) => {
  const { chat_id, channel_name, username, text, timestamp, keywords_detected } = req.body;
  try {
    const savedMessage = await prisma.message.create({
      data: {
        chat_id,
        channel_name,
        username,
        text,
        timestamp: new Date(timestamp),
        keywords_detected,
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

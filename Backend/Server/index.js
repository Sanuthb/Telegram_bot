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

    notifyClients(savedMessage);
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

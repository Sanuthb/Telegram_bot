import express from 'express';
import { PrismaClient } from '@prisma/client';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
const prisma = new PrismaClient();
const pollingInterval = 3000; // Poll every 3 seconds
const telegramBotApiUrl = 'https://telegram-bot-ijo7.onrender.com/';

app.use(express.json());

async function fetchAndStoreMessages() {
  try {
    const response = await axios.get(telegramBotApiUrl);
    const messageData = response.data.data; 

    if (messageData) {
      const { chat_id, channel_name, username, groupname ,userid, text, timestamp, keywords_detected } = messageData;

      await prisma.message.create({
        data: {
          chat_id,
          channel_name ,
          username,
          groupname,
          user_id: BigInt(userid),
          text,
          timestamp: new Date(timestamp),
          keywords_detected,
        },
      });
      console.log("Stored message:", messageData);
    } else {
      console.log("No new messages detected.");
    }
  } catch (error) {
    console.error("Failed to fetch or store messages:", error.message);
  }
}

// Periodically call the fetchAndStoreMessages function
setInterval(fetchAndStoreMessages, pollingInterval);

app.get('/stats', async (req, res) => {
  try {
    // Fetch count of messages sent today and total message count
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

    res.status(200).json({
      messagesToday,
      totalMessages,
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});

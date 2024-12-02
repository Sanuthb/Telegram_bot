import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();


const getMessage_db = async (req, res) => {
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
  };

  export default getMessage_db
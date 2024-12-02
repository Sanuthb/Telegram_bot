import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const getStats_db = async (req, res) => {
  try {
    // Get all detections grouped by day
    const detectionsByDay = await prisma.message.groupBy({
      by: ['timestamp'],
      _count: {
        id: true,
      },
      orderBy: {
        timestamp: 'asc',
      },
    });

    // Get the current date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0];

    // Initialize an object to aggregate detections by day
    const aggregatedData = {};

    // Aggregate the detections for each day
    detectionsByDay.forEach((entry) => {
      const day = entry.timestamp.toISOString().split('T')[0];
      if (!aggregatedData[day]) {
        aggregatedData[day] = 0;
      }
      aggregatedData[day] += entry._count.id; // Sum the detections for the same day
    });

    // Get today's detections
    const todayCount = aggregatedData[today] || 0;

    // Calculate total detections
    const totalCount = Object.values(aggregatedData).reduce((sum, count) => sum + count, 0);

    // Format the response data for daily detections
    const dailyData = Object.keys(aggregatedData).map((day) => ({
      day,
      detections: aggregatedData[day],
    }));

    // Send the response with today's detections, total detections, and daily detections data
    res.json({
      todayCount,
      totalCount,
      dailyData,
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

export default getStats_db;

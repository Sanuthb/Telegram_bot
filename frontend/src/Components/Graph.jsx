import React, { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { statsState } from '../Atoms/Atoms';  
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement } from 'chart.js';
import { fetchStats } from '../DBdata/Statsdata';

ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement);

const Graph = () => {
  const [stats, setStats] = useRecoilState(statsState);
  const [chartData, setChartData] = useState({
    labels: [], 
    datasets: [
      {
        label: 'Drug-related Messages',
        data: [],
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
        fill: false,
      },
    ],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedStats = await fetchStats(); // Expecting response like { todayCount, totalCount, dailyData }

        // Update the statsState with today's and total counts
        const totalMessagesToday = fetchedStats.todayCount;
        const totalMessages = fetchedStats.totalCount;

        setStats({
          messagesToday: totalMessagesToday,
          totalMessages: totalMessages,
          Today: new Date(),
        });

        // Prepare labels and data for the graph (daily detections data)
        const labels = fetchedStats.dailyData.map((item) => item.day); // Extract days
        const values = fetchedStats.dailyData.map((item) => item.detections); // Extract detections

        setChartData({
          labels: labels,
          datasets: [
            {
              label: 'Drug-related Messages',
              data: values,
              borderColor: 'rgb(75, 192, 192)',
              tension: 0.1,
              fill: false,
            },
          ],
        });
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      }
    };

    fetchData();
  }, [setStats]);

  return (
    <div className="w-1/2">
      <h3>Total Drug Detection Count: {stats.totalMessages}</h3>
      <Line data={chartData} />
    </div>
  );
};

export default Graph;

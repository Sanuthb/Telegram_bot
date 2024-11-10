// Pages/Home.js
import React, { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { statsState } from '../Atoms/Atoms';  
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement } from 'chart.js';
import { fetchStats } from '../DBdata/Statsdata';

ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement);

const Graph = () => {
  const [stats, setStats] = useRecoilState(statsState); 
  const [chartData, setChartData] = React.useState({
    labels: [], 
    datasets: [], 
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedStats = await fetchStats();  

        setStats({
          messagesToday: fetchedStats.messagesToday,
          totalMessages: fetchedStats.totalMessages,
          Today: new Date(), 
        });

        const labels = ['Today'];  
        const values = [fetchedStats.messagesToday];  

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
      <h3>Today's Drug Detection Count: {stats.messagesToday}</h3> 
      <Line data={chartData} />
    </div>
  );
};

export default Graph;

import { atom } from 'recoil';

export const activePageState = atom({
  key: 'activePageState', 
  default: 'dashboard', 
});


export const chartDataState = atom({
  key: 'chartDataState', 
  default: {
    labels: [], 
    datasets: [
      {
        label: 'Total Detections',
        data: [], 
        borderColor: 'rgb(75, 192, 192)', 
        tension: 0.1,
        fill: false,
      },
    ],
  },
});


export const statsState = atom({
  key: 'statsState', 
  default: {
    messagesToday: 0,
    totalMessages: 0,
    Today: new Date(),
  },
});


export const messagesState = atom({
  key: 'messagesState', 
  default: [],
});
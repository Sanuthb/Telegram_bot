import axios from 'axios';

const API_URL = 'http://localhost:8000';

export const fetchStats = async () => {
  try {
    const response = await axios.get(`${API_URL}/stats`);
    return response.data; 
  } catch (error) {
    throw new Error('Failed to fetch stats');
  }
};
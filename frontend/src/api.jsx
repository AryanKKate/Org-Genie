import axios from 'axios';

const API_URL = process.env.REACT_APP_BACKEND_URL;

export const fetchFAQs = async () => {
  const response = await axios.get(`${API_URL}/faqs`);
  return response.data;
};

export const sendQuery = async (query) => {
  const response = await axios.post(`${API_URL}/query`, { query });
  return response.data;
};

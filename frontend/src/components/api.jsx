
import axios from 'axios';
 
 //const API_URL = process.env.REACT_APP_BACKEND_URL;
 
 
 export const fetchFAQs = async () => {
   const response = await axios.get(`http://localhost:3001/faqs`);
   return response.data;
 };
 
 export const sendQuery = async (query) => {
   const response = await axios.post(`http://localhost:3001/query`, { query });
   return response.data;
 };

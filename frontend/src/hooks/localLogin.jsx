import axios from 'axios';
import { AUTH_URL } from '../constants.js';

export const localLogin = async (credentials) => {
  const loginUrl = `${AUTH_URL}/login/local`;
  try {
    const response = await axios.post(loginUrl, credentials);
    return response.data;
  } catch (error) {
    if (error.response) {
      // The request was made, and the server responded with a status code that falls out of the range of 2xx
      console.error('Error Data:', error.response.data);
      console.error('Error Status:', error.response.status);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('Error Request:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error Message:', error.message);
    }
    return null;
  }
};

import axios from 'axios';
const token = localStorage.getItem('token')
const API_URL = 'http://localhost:5000/api/dashboard';

export const getDashbaordStats = () =>
  axios.get(`${API_URL}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });
import axios from 'axios';
const token = localStorage.getItem('token')
const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:5000/api";
const API_URL = `${BASE_URL}/dashboard`;

export const getDashbaordStats = () =>
  axios.get(`${API_URL}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });
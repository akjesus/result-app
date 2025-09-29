import axios from "axios";
const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:5000/api";
const token = localStorage.getItem('token');

export const getSessionsWithSemesters = () =>
  axios.get(`${BASE_URL}/schools/sessions`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });

export const getAllLevels = () =>
  axios.get(`${BASE_URL}/schools/levels`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });

// src/api/departments.js
import axios from 'axios';
const token = localStorage.getItem('token')
const API_URL = 'http://localhost:5000/api/schools/departments';

export const getDepartments = () => axios.get(API_URL, {
    
    headers: {
          'Content-Type': 'application/json',
         'Authorization': `Bearer ${token}` 
          }
});
export const addDepartment = (data) => axios.post(API_URL, data);
export const updateDepartment = (id, data) => axios.put(`${API_URL}/${id}`, data);
export const deleteDepartment = (id) => axios.delete(`${API_URL}/${id}`);

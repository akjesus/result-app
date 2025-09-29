import axios from "axios";
const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:5000/api";
const API_URL = `${BASE_URL}/results`;
const token = localStorage.getItem('token')

export const getResults= (semester, department, session, level) => axios.get(API_URL,
        {
            params: {
                semester,
                department,
                session, 
                level
            },
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }
);

export const getResultsByDepartment2 = (departmentId) =>
  axios.get(`${API_URL}/departments/${departmentId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });

  

export const bulkUploadResults = (formData) =>
  axios.post(`${API_URL}/bulk-upload`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': `Bearer ${token}`
    }
  });

  export const getResultsByDepartment = (id, session, semester) => 
    axios.get(`${API_URL}/departments/${id}`,
        {
            params: {
                session, 
                semester
            },
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }
);
import axios from "axios";

const API_URL = "http://localhost:5000/api/results";
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

export const getResultsByDepartment = (departmentId) =>
  axios.get(`${API_URL}/gpa/${departmentId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });

export const addSchool = (data) => axios.post(API_URL, data);
export const updateSchool = (id, data) => axios.put(`${API_URL}/${id}`, data);
export const deleteSchool = (id) => axios.delete(`${API_URL}/${id}`);

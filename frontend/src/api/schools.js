// src/api/schools.js
import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:5000/api";
const token = localStorage.getItem('token')

console.log('REACT_APP_BASE_URL:', process.env.REACT_APP_BASE_URL);

export const getSchools = () => axios.get(`${BASE_URL}/schools/faculties`,
    {
    headers: {
          'Content-Type': 'application/json',
         'Authorization': `Bearer ${token}` 
          }
});

export const getCourses = () => axios.get(`${BASE_URL}/courses`,
    {
    headers: {
          'Content-Type': 'application/json',
         'Authorization': `Bearer ${token}` 
          }
});

export const getSessions = () => axios.get(`${BASE_URL}/schools/sessions`,
    {
    headers: {
          'Content-Type': 'application/json',
         'Authorization': `Bearer ${token}` 
          }
});

export const getLevels = () => axios.get(`${BASE_URL}/schools/levels`,
    {
    headers: {
          'Content-Type': 'application/json',
         'Authorization': `Bearer ${token}` 
          }
});

export const createCourse = (data) => axios.post(`${BASE_URL}/courses`, 
    { 
        name: data.title,
        code: data.code, 
        department_id: data.department, 
        level_id: data.level,
        semester_id: data.semester,
        credit_load: data.credit,
        active: data.active,
     }
        , 
        { headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  }
});

export const updateCourse = (data) => axios.put(`${BASE_URL}/courses`, 
    { 
        name: data.title,
        code: data.code, 
        department_id: data.department, 
        level_id: data.level,
        semester_id: data.semester,
        credit_load: data.credit,
        active: data.active,
     }
        , 
        { headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  }
});

export const getCoursesWithResults = () => axios.get(`${BASE_URL}/results/courses`,
    {
    headers: {
          'Content-Type': 'application/json',
         'Authorization': `Bearer ${token}` 
          }
});
export const addSchool = (data) => axios.post(`${BASE_URL}/schools/faculties`, data);
export const updateSchool = (id, data) => axios.put(`${BASE_URL}/schools/faculties/${id}`, data);
export const deleteSchool = (id) => axios.delete(`${BASE_URL}/schools/faculties/${id}`);

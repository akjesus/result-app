// src/api/schools.js
import axios from "axios";

const API_URL = "http://localhost:5000/api/schools/faculties";
const token = localStorage.getItem('token')

export const getSchools = () => axios.get(API_URL,
    {
    
    headers: {
          'Content-Type': 'application/json',
         'Authorization': `Bearer ${token}` 
          }
});

export const getCourses = () => axios.get("http://localhost:5000/api/courses",
    {
    headers: {
          'Content-Type': 'application/json',
         'Authorization': `Bearer ${token}` 
          }
});

export const getSessions = () => axios.get("http://localhost:5000/api/schools/sessions",
    {
    headers: {
          'Content-Type': 'application/json',
         'Authorization': `Bearer ${token}` 
          }
});

export const getLevels = () => axios.get("http://localhost:5000/api/schools/levels",
    {
    headers: {
          'Content-Type': 'application/json',
         'Authorization': `Bearer ${token}` 
          }
});

export const createCourse = (data) => axios.post("http://localhost:5000/api/courses", 
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

export const updateCourse = (data) => axios.put("http://localhost:5000/api/courses", 
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

export const addSchool = (data) => axios.post(API_URL, data);
export const updateSchool = (id, data) => axios.put(`${API_URL}/${id}`, data);
export const deleteSchool = (id) => axios.delete(`${API_URL}/${id}`);

// src/api/departments.js
import axios from 'axios';


const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:5000/api";
const API_URL = `${BASE_URL}/students`;
const token = localStorage.getItem('token')

export const getStudents = () => axios.get(API_URL, {
    headers: {
          'Content-Type': 'application/json',
         'Authorization': `Bearer ${token}` 
          }
});

export const getStudentsForDepartment = (id) => axios.get(`${API_URL}/departments/${id}`, {
    headers: {
          'Content-Type': 'application/json',
         'Authorization': `Bearer ${token}` 
          }
});
export const createStudent = (data) => axios.post(API_URL, data, {
    
    headers: {
          'Content-Type': 'application/json',
         'Authorization': `Bearer ${token}` 
          }
}
);

export const updateDepartment = (id, data) => axios.put(`${API_URL}/${id}`, data, {
    
    headers: {
          'Content-Type': 'application/json',
         'Authorization': `Bearer ${token}` 
          }
});


export const getResults = ( data) => axios.get(`${BASE_URL}/results/student`,
        {
            params: {
                semester: data.semester,
                session: data.session,
                level: data.level
            },
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }
);

export const getProfile = () => axios.get(`${BASE_URL}/auth/me`,
        {   headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }
);

export const changePassword = (data) => axios.post(`${BASE_URL}/students/change-password`,
        {
            old_password: data.currentPassword,
            new_password: data.newPassword,
            new_password_confirm: data.confirmPassword
        },
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }
);


export const getCurrentGPA = () => axios.get(`${BASE_URL}/students/gpa`,
        {   headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }
);
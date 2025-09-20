// src/api/departments.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/students';
const token = localStorage.getItem('token')

export const getStudents = () => axios.get(API_URL, {
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


export const getResults = ( data) => axios.get('http://localhost:5000/api/results/student',
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

export const getProfile = () => axios.get('http://localhost:5000/api/auth/me',
        {   headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }
);

export const changePassword = (data) => axios.post('http://localhost:5000/api/students/change-password',
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


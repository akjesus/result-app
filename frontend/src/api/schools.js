// src/api/schools.js
import axios from "axios";

const API_URL = "http://localhost:5000/api/schools";

export const getSchools = () => axios.get(API_URL);
export const addSchool = (data) => axios.post(API_URL, data);
export const updateSchool = (id, data) => axios.put(`${API_URL}/${id}`, data);
export const deleteSchool = (id) => axios.delete(`${API_URL}/${id}`);

// src/api/http.js
import axios from 'axios';

const http = axios.create({
  baseURL: process.env.REACT_APP_BASE, // https://friendpass.site
});

http.interceptors.request.use((config) => {
  const token = localStorage.getItem('fp_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default http;

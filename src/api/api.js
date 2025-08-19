import axios from 'axios';

const api = axios.create({
  baseURL: 'https://your-backend-domain.com', // 실제 백엔드 주소
  withCredentials: true, // 쿠키/세션 사용 시 true
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터 (토큰 자동 추가 등)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken"); 
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터 예시 (선택)
api.interceptors.response.use(
  response => response,
  error => {
    console.error(error.response || error.message);
    return Promise.reject(error);
  }
);

export default api;
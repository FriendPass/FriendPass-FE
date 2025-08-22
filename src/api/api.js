import axios from 'axios';

const api = axios.create({
  baseURL: 'https://dd8f1124daf6.ngrok-free.app', // ngrok URL 예시
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터
api.interceptors.request.use(
  (config) => {
    // 실제 로그인 후 발급받은 JWT만 사용
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log("[API] 요청 시작:", config.method.toUpperCase(), config.url, "헤더:", config.headers.Authorization || "없음");
    return config;
  },
  (error) => {
    console.error("[API] 요청 에러:", error);
    return Promise.reject(error);
  }
);

// 응답 인터셉터
api.interceptors.response.use(
  (response) => {
    console.log("[API] 응답 도착:", response.config.url, response.status, response.data);
    return response;
  },
  (error) => {
    console.error("[API] 응답 에러:", error.response ? error.response.status : error.message);
    return Promise.reject(error);
  }
);

export default api;

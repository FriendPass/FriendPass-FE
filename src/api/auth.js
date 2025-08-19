import api from './api';

// 로그인
export const login = (email, password) => {
  return api.post('/auth/login', { email, password });
};
//로그아웃
export const logout = async () => {
  try {
    const response = await api.post("/auth/logout");
    return response.data;
  } catch (error) {
    throw error;
  }
};
//학교 저장
export const updateSchool = (schoolName) => {
  return api.put('/auth/login', { school: schoolName });
};

// 국적 저장
export const updateNationality = (country) => {
  return api.put('/auth/login', { nationality: country });
};

// 이메일 인증번호 발송
export const sendEmailCode = (email) => {
  return api.post('/auth/email/send', { email });
};

// 이메일 인증번호 검증
export const verifyEmailCode = (email, code) => {
  return api.post('/auth/email/verify', { email, code });
};

// 회원가입
export const signup = (email, password, nickname) => {
  return api.post('/auth/signup', { email, password, nickname });
};

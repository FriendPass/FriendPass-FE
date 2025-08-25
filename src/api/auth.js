import api from './api';

// 로그인
export const login = async (email, password) => {
  const res = await api.post(
    '/auth/login',
    { email, password },
    { headers: { Authorization: '' } } // 로그인 시 기존 토큰 제거
  );

  return res.data; // axios response 전체 말고 data만 반환
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

// 이메일 인증번호 발송
export const sendEmailCode = (email) => {
  return api.post('/auth/email/send', { email });
};

// 이메일 인증번호 검증
export const verifyEmailCode = (email, code) => {
  return api.post('/auth/email/verify', { email, code });
};

// 회원가입
export const signup = (payload) => {
  return api.post('/auth/signup', payload);
};

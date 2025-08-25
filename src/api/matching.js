import api from './api';

// 1. 매칭 신청 (POST /matching/request)
export const requestMatching = async (region) => {
  try {
    const response = await api.post("/matching/request", { region });
    return response.data;
  } catch (error) {
    console.error("매칭 신청 실패:", error);
    throw error;
  }
};

// 2. 매칭 진행 상태 조회 (GET /matching/status)
export const getMyMatching = async () => {
  try {
    const response = await api.get("/matching/status");
    return response.data;
  } catch (error) {
    console.error("매칭 상태 조회 실패:", error);
    throw error;
  }
};

// 매칭된 멤버 가져오기
export const getMyMatchingMember = async () => {
  const res = await api.get("/matching/complete");
  return res.data; // 응답 데이터 그대로 리턴
};
// 관심사별 장소 불러오기
export const getMyMatchingPlaces = async () => {
  try {
    const response = await api.get('/matching/complete');
    return response.data;
  } catch (error) {
    console.error("매칭 장소 가져오기 실패:", error);
    throw error;
  }
};

// 사용자 위치 인증
export const certifyLocation = async (latitude, longitude) => {
  try {
    const response = await api.post("/certify", { latitude, longitude });
    return response.data; // { success: true/false, message: "..." }
  } catch (err) {
    console.error("위치 인증 요청 실패:", err);
    throw err;
  }
};

// 매칭 종료
export const exitMatching = async (payload) => {
  try {
    const res = await api.post("/matching/exit", payload);
    return res.data;
  } catch (error) {
    console.error("매칭 종료 실패:", error);
    throw error;
  }
};
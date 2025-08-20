import api from './api';

// 1. 매칭 신청 (POST /matching-requests)
export const requestMatching = async () => {
  try {
    const response = await api.post("/matching-requests");
    return response.data;
  } catch (error) {
    console.error("매칭 신청 실패:", error);
    throw error;
  }
};

// 2. 매칭 진행 상태 조회 (GET /matching-requests/me)
export const getMyMatching = async () => {
  try {
    const response = await api.get("/matching-requests/me");
    return response.data;
  } catch (error) {
    console.error("매칭 상태 조회 실패:", error);
    throw error;
  }
};

// 3. 매칭 실패/재매칭 (PATCH /matching-requests/{requestId})
export const rematch = async (requestId) => {
  try {
    const response = await api.patch(`/matching-requests/${requestId}`);
    return response.data;
  } catch (error) {
    console.error("재매칭 실패:", error);
    throw error;
  }
};

// 매칭된 멤버 가져오기
export const getMyMatchingMember = async () => {
  const res = await api.get("/matching-requests/me");
  return res.data; // 응답 데이터 그대로 리턴
};
// 관심사별 장소 불러오기
export const getMyMatchingPlaces = async () => {
  try {
    const response = await api.get('/matching-requests/me');
    return response.data;
  } catch (error) {
    console.error("매칭 장소 가져오기 실패:", error);
    throw error;
  }
};
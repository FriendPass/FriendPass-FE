import api from './api';

// 스탬프 1개 증가 API
export const increaseStamp = async () => {
  try {
    const response = await api.post("/rewards/stamps");
    return response.data; // 백엔드에서 리턴해주는 데이터
  } catch (error) {
    console.error("스탬프 증가 실패:", error);
    throw error;
  }
};

// 내 리워드 개수 가져오기
export const getMyRewards = async () => {
  const response = await api.get('/rewards/me')
  return response.data
}
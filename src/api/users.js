import api from './api';

//초기 관심사 설정
export const updateUserInterests = (interests) => {
  return api.put('/users/me/interests', { interests });
};

// 회원탈퇴
export const deleteUser = () => {
  return api.delete("/users/me");
};

// 내 정보 가져오기
export const getMyProfile = async () => {
  const res = await api.get("/users/me");
  return res.data;
};
// 닉네임 수정
export const updateNickname = async (nickname) => {
  const res = await api.put("/users/me", { nickname });
  return res.data;
};

// 프로필 이미지 업로드
export const updateProfileImage = async (imageFile) => {
  const formData = new FormData();
  formData.append("profileImage", imageFile);

  const res = await api.put("/users/me/profile-image", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

// 내 관심사 조회
export const getMyInterests = async () => {
  const response = await api.get("/interests");
  return response.data; // 배열 형태로 반환한다고 가정
};
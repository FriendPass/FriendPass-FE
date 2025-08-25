import api from './api';

//관심사 PUT
export const updateUserInterests = (interestIds) => {
  return api.put('/users/me/interests', { interestIds });
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
export const updateProfileImage = async (file) => {
  console.log("📤 보내는 imageFile 확인:", file instanceof File, file); 

  const formData = new FormData();
  formData.append("file", file);  // 매개변수 file 사용

  const res = await api.put("/users/me/profile-image", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  return res.data;
};

// 프로필 이미지 삭제
export const deleteProfileImage = async () => {
  try {
    const response = await api.delete("/users/me/profile-image");
    return response.data;
  } catch (err) {
    console.error("프로필 이미지 삭제 실패:", err);
    throw err;
  }
};

// 내 관심사 조회
export const getMyInterests = async () => {
  const response = await api.get("/interests");
  return response.data; // 배열 형태로 반환한다고 가정
};
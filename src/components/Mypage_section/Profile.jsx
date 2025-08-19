import React, { useEffect, useState } from "react";
import {
  getMyProfile,
  updateNickname,
  updateProfileImage,
} from "../../api/users";

const Profile = () => {
  const [nickname, setNickname] = useState("");
  const [university, setUniversity] = useState("");
  const [nation, setNation] = useState("");
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    // 페이지 로드 시 내 정보 가져오기
    const fetchData = async () => {
      try {
        const data = await getMyProfile();
        setNickname(data.nickname);
        setUniversity(data.university);
        setNation(data.nation);
        if (data.profileImageUrl) {
          setPreviewImage(data.profileImageUrl);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    try {
      if (nickname) {
        await updateNickname(nickname);
      }
      if (selectedImage) {
        await updateProfileImage(selectedImage);
      }
      alert("프로필이 성공적으로 수정되었습니다!");
    } catch (err) {
      console.error(err);
      alert("프로필 수정 실패");
    }
  };

  return (
    <div className='wrap'>
      <div className="profile-wrap">
        <div className="profile-box1">
          <a href="/mypage">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M3.825 9L8.71247 13.8875C9.10497 14.28 9.10215 14.9172 8.70619 15.3062C8.31517 15.6904 7.68758 15.6876 7.29997 15.3L0.707106 8.70711C0.316582 8.31658 0.316583 7.68342 0.707107 7.29289L7.29997 0.700027C7.68759 0.312414 8.31517 0.309638 8.70619 0.693805C9.10215 1.08281 9.10497 1.72003 8.71247 2.11253L3.825 7H15C15.5523 7 16 7.44772 16 8C16 8.55229 15.5523 9 15 9H3.825Z" fill="#333333"/>
</svg>
</a>
        <p className='profile-p1'>프로필 설정</p>
        </div>
        {/* 이미지 업로드 영역 */}
        <div className="profile-box2">
          <label htmlFor="profileImageUpload" style={{ cursor: "pointer" }}>
            <div className="profile-profile">
              {previewImage ? (
                <img
                  src={previewImage}
                  alt="프로필 미리보기"
                  style={{ width: "100%", height: "100%", objectFit: "cover",borderRadius: "18px" }}
                />
              ) : (
                <span>+</span>
              )}
            </div>
            <p className="profile-p2">사진 변경</p>
          </label>
          <input
            type="file"
            id="profileImageUpload"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleImageChange}
          />
        </div>
        {/* 닉네임/학교/국적 */}
        <div className="profile-box3">
          <div className="profile-nickname">
            <p className="profile-p2">닉네임</p>
            <input
              className="profile-modify-nickname"
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
            />
          </div>
          <div className="profile-unv">
            <p className='profile-p2'>학교</p>
            <div className='profile-unv-done'>
              <p className='profile-p2'>성신</p>
            </div>
          </div>
          <div className="profile-nation">
            <p className='profile-p2'>국적</p>
            <div className='profile-nation-done'>
              <p className='profile-p2'>성신여대</p>
            </div>
          </div>          
        </div>
        <button className="profile-btn" onClick={handleSubmit}>
          확인
        </button>
      </div>
    </div>
  )
}

export default Profile

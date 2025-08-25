import React, { useEffect, useState } from "react";
import {getMyProfile, updateNickname, updateProfileImage, deleteProfileImage} from "../../api/users";
import DEFAULT_PROFILE_IMAGE from "../../assets/img/basicprofile.png";
import { useTranslation } from "react-i18next";
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [nickname, setNickname] = useState("");
  const [schoolName, setSchoolName] = useState(""); // 학교 이름
  const [nationalityName, setNationalityName] = useState(""); 
  const [previewImage, setPreviewImage] = useState(DEFAULT_PROFILE_IMAGE);
  const [selectedImage, setSelectedImage] = useState(null);
  

  useEffect(() => {
    // 페이지 로드 시 내 정보 가져오기
    const fetchData = async () => {
      try {
        const data = await getMyProfile();
        setNickname(data.nickname);
        setSchoolName(data.schoolName); // 응답 필드명: schoolName
        setNationalityName(data.nationalityNameKo);

        if (data.profileImage) {
          setPreviewImage(data.profileImage); // 응답 필드명: profileImage
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    console.log("📥 선택된 파일:", file); 
    if (file) {
      setSelectedImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleDeleteImage = async () => {
    if (!window.confirm("프로필 사진을 삭제하시겠습니까?")) return;
    try {
      await deleteProfileImage(); // DELETE 호출
      setSelectedImage(null);
      setPreviewImage(DEFAULT_PROFILE_IMAGE);
      alert(t('profile.deleteSuccess'));
    } catch (err) {
      console.error(err);
      alert(t('profile.deleteFail'));
    }
  };

  const handleSubmit = async () => {
    try {
      if (nickname) {
        await updateNickname(nickname);
      }
      if (selectedImage) {
        console.log("📤 업로드할 selectedImage:", selectedImage);
        await updateProfileImage(selectedImage);
      }
      const updated = await getMyProfile();
      setPreviewImage(updated.profileImage);
      alert(t('profile.updateSuccess'));
      navigate('/mypage');
    } catch (err) {
      console.error(err);
      alert(t('profile.updateFail'));
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
        <p className='profile-p1'>{t('profile.title')}</p>
        </div>
        {/* 이미지 업로드 영역 */}
        <div className="profile-box2">
          <label htmlFor="profileImageUpload" style={{ cursor: "pointer" }}>
            <div className="profile-profile">
              {previewImage ? (
                <img
                  src={previewImage}
                  alt=""
                  style={{ width: "100%", height: "100%", objectFit: "cover",borderRadius: "18px" }}
                        onError={(e) => {
        e.target.onerror = null;
        e.target.src = DEFAULT_PROFILE_IMAGE;
      }}
                />
              ) : (
                <span>+</span>
              )}
            </div>
            <span className="profile-p2">{t('profile.changeImage')}</span>
          </label>
              <span className="profile-p2" style={{ color: "red", cursor: "pointer" }} onClick={handleDeleteImage}>
                {t('profile.delete')}
              </span>
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
            <p className="profile-p2">{t('profile.nickname')}</p>
            <input
              className="profile-modify-nickname"
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
            />
          </div>
          <div className="profile-unv">
            <p className='profile-p2'>{t('profile.school')}</p>
            <div className='profile-unv-done'>
              <p className='profile-p2'>{schoolName}</p>
            </div>
          </div>
          <div className="profile-nation">
            <p className='profile-p2'>{t('profile.nationality')}</p>
            <div className='profile-nation-done'>
              <p className='profile-p2'>{nationalityName}</p>
            </div>
          </div>          
        </div>
        <button className="profile-btn" onClick={handleSubmit}>
          {t('profile.confirm')}
        </button>
      </div>
    </div>
  )
}

export default Profile

import React, { useEffect, useState } from 'react'
import { logout } from "../../api/auth"; // 경로 맞게 수정 필요
import { deleteUser, getMyProfile } from "../../api/users";
import { useNavigate } from "react-router-dom";
import DefaultProfile from "../../assets/img/basicprofile.png";

const Mypage = () => {
  const navigate = useNavigate();
  const [profileImage, setProfileImage] = useState(null);
  const [nickname, setNickname] = useState(''); 

    // 마운트 시 유저 프로필 불러오기
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getMyProfile();
        setProfileImage(data.profileImage); // 필드명: profileImage
        setNickname(data.nickname); 
      } catch (error) {
        console.error("프로필 불러오기 실패:", error);
      }
    };
    fetchProfile();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      alert("로그아웃 되었습니다.");
      navigate("/login"); // 로그인 페이지로 이동
    } catch (error) {
      console.error("로그아웃 실패:", error);
      alert("로그아웃 중 문제가 발생했습니다.");
    }
  };

    // 회원탈퇴 핸들러
  const handleDeleteUser = async () => {
    if (!window.confirm("정말로 회원탈퇴 하시겠습니까?")) return;

    try {
      await deleteUser();
      alert("회원탈퇴가 완료되었습니다.");
      navigate("/login"); // 탈퇴 후 회원가입/홈으로 이동
    } catch (error) {
      console.error("회원탈퇴 실패:", error);
      alert("회원탈퇴 중 문제가 발생했습니다.");
    }
  };

  return (
    <div className='wrap'>
        <div className="mypage-wrap">
            <p className='mypage-p1'>마이페이지</p>
            <div className="mypage-box1">
            <div className="mypage-profile">
  <img
    src={profileImage || DefaultProfile}
    alt="프로필 이미지"
    style={{
      width: "83px",
      height: "77.5px",
      borderRadius: "18px",
      objectFit: "cover",
    }}
  />
          </div>
                <p className='mypage-p2'>{nickname}</p>
            </div>
            <div className="mypage-box2">
               <a href="/profile" className="mypage-p2">프로필 설정</a>
               <a href="/modifyInterest" className="mypage-p2">관심사 설정</a>
               <a href="/modifyLanguage" className="mypage-p2">언어 설정</a>
               <p className="mypage-p2" onClick={handleLogout} style={{cursor: "pointer"}}>로그아웃</p>
               <p className="mypage-p3" onClick={handleDeleteUser} style={{ cursor: "pointer"}}>회원탈퇴</p>
            </div>
        <div className="footer">
        <div className='mypage-footer'>
        <a href="/matching">
        <div className="menu-home">
          <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M15 2.5L18.8625 10.325L27.5 11.5875L21.25 17.675L22.725 26.275L15 22.2125L7.275 26.275L8.75 17.675L2.5 11.5875L11.1375 10.325L15 2.5Z" fill="white" stroke="#1E1E1E" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
<p>매칭</p>
        </div>
        </a>
        <a href="/chatList">
        <div className="menu-chat">
          <svg width="34" height="29" viewBox="0 0 34 29" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M29.75 13.8958C29.7549 15.4906 29.318 17.0639 28.475 18.4875C27.4754 20.1933 25.9388 21.6281 24.0372 22.6312C22.1356 23.6342 19.9442 24.1659 17.7083 24.1666C15.8385 24.1708 13.994 23.7982 12.325 23.0791L4.25 25.375L6.94167 18.4875C6.09865 17.0639 5.66179 15.4906 5.66667 13.8958C5.66753 11.9888 6.29087 10.1196 7.46685 8.49764C8.64284 6.87569 10.325 5.56503 12.325 4.71247C13.994 3.99343 15.8385 3.62082 17.7083 3.62497H18.4167C21.3695 3.76392 24.1585 4.82698 26.2496 6.61059C28.3408 8.39421 29.5871 10.7731 29.75 13.2916V13.8958Z" stroke="#1E1E1E" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
<p>채팅</p> 
        </div>
        </a>
        <a href="/ranking">
        <div className="menu-lank">
          <svg width="31" height="31" viewBox="0 0 31 31" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M10.6045 17.9413L9.04159 29.7084L15.4999 25.8334L21.9583 29.7084L20.3953 17.9284M24.5416 10.3334C24.5416 15.3269 20.4935 19.375 15.4999 19.375C10.5063 19.375 6.45825 15.3269 6.45825 10.3334C6.45825 5.33978 10.5063 1.29169 15.4999 1.29169C20.4935 1.29169 24.5416 5.33978 24.5416 10.3334Z" stroke="#1E1E1E" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
<p>랭킹</p>
        </div>
        </a>
        <div className="mypage-menu-mypage">
          <svg width="31" height="31" viewBox="0 0 23 25" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M21.8333 24.125V21.5417C21.8333 20.1714 21.289 18.8572 20.32 17.8883C19.3511 16.9193 18.0369 16.375 16.6667 16.375H6.33332C4.96304 16.375 3.64888 16.9193 2.67994 17.8883C1.711 18.8572 1.16666 20.1714 1.16666 21.5417V24.125" fill="#6177F0"/>
<path d="M11.5 11.2083C14.3535 11.2083 16.6667 8.89514 16.6667 6.04167C16.6667 3.1882 14.3535 0.875 11.5 0.875C8.64652 0.875 6.33332 3.1882 6.33332 6.04167C6.33332 8.89514 8.64652 11.2083 11.5 11.2083Z" fill="#6177F0"/>
<path d="M21.8333 24.125V21.5417C21.8333 20.1714 21.289 18.8572 20.32 17.8883C19.3511 16.9193 18.0369 16.375 16.6667 16.375H6.33332C4.96304 16.375 3.64888 16.9193 2.67994 17.8883C1.711 18.8572 1.16666 20.1714 1.16666 21.5417V24.125M16.6667 6.04167C16.6667 8.89514 14.3535 11.2083 11.5 11.2083C8.64652 11.2083 6.33332 8.89514 6.33332 6.04167C6.33332 3.1882 8.64652 0.875 11.5 0.875C14.3535 0.875 16.6667 3.1882 16.6667 6.04167Z" stroke="#1E1E1E" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
<p>마이페이지</p>
        </div>
        </div>
      </div>
        </div>
    </div>
  )
}

export default Mypage

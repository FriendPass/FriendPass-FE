import React from 'react'

const Home = () => {
  return (
    <div className='wrap'>
    <a href="/login">
      <p>login</p>
    </a>
    <a href="/joinUnv">
      <p>대학</p>
    </a>
    <a href="/joinStudent">
      <p>학생 유형</p>
    </a>
    <a href="/joinNation">
      <p>국적</p>
    </a>
    <a href="/join">
      <p>회원가입</p>
    </a>
    <a href="/interestChoice">
      <p>관심사 선택</p>
    </a>
    <a href="/language">
      <p>언어 설정</p>
    </a>
    <a href="/agree">
      <p>위치정보 동의 모덜</p>
    </a>
    <a href="/matching">
      <p>매칭 홈</p>
    </a>
    <a href="/matched">
      <p>매칭됨</p>
    </a>
    <a href="/certify">
      <p>리워드 모덜</p>
    </a>
    <a href="/yougetReward">
      <p>축하</p>
    </a>
    <a href="/mypage">
      <p>마이페이지</p>
    </a>
    <a href="/profile">
      <p>프로필 설정</p>
    </a>
    <a href="/modifyInterest">
      <p>관심사 수정</p>
    </a>
    <a href="/modifyLanguage">
      <p>언어 수정</p>
    </a>
    <a href="/matched">
      <p>매칭됨</p>
    </a>
    <a href="/certify">
      <p>리워드 모덜</p>
    </a>
    <a href="/yougetReward">
      <p>축하</p>
    </a>
    <a href="/ranking">
      <p>랭킹</p>
    </a>
    <a href="/chatList">
      <p>채팅 목록</p>
    </a>
    <a href="/member/:userId">
      <p>사용자 신고</p>
    </a>
    <a href="/chatInfo">
      <p>채팅방 정보</p>
    </a>
    <a href="/chat/:roomId">
      <p>채팅방 룸 아이디</p>
    </a>
    </div>
  )
}

export default Home

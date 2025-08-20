import React, { useState} from 'react';
import { increaseStamp } from "../../api/rewards";

const Certify = () => {
  const [stamps, setStamps] = useState(0);

  const handleIncreaseStamp = async () => {
    try {
      const data = await increaseStamp(); 
      // 서버에서 현재 스탬프 개수 반환한다고 가정
      setStamps(data.stamps);
      alert("스탬프가 추가되었어요!");
    } catch (error) {
      alert("스탬프 추가에 실패했습니다.");
    }
  };

  return (
      <div className="certify-wrap">
        <svg className='certify-close' width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
<line x1="0.707107" y1="1" x2="12" y2="12.2929" stroke="black" strokeLinecap="round"/>
<line x1="0.5" y1="-0.5" x2="16.4706" y2="-0.5" transform="matrix(-0.707107 0.707107 0.707107 0.707107 13 1)" stroke="black" strokeLinecap="round"/>
</svg>
<div className="certify-box1">
  <p className='certify-p1'>매칭 미션 장소에 도착했어요! 
    <br />지금 인증할까요?
  </p>
  <p className='certify-p2'>활동 스탬프를 받을 수 있어요.</p>
</div>
<div className="certify-box2">
  <a href="/yougetReward">
  <p className='certify-p3' onClick={handleIncreaseStamp}>인증할래요!</p>
  </a>
</div>
      </div>
  )
}

export default Certify

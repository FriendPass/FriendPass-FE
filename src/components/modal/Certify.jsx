import React from 'react';

const Certify = ({ onClose, onConfirm }) => {
  const handleConfirm = () => {
    // 종료 후 제한 상태 기록 (localStorage 사용)
    localStorage.setItem("matchingDisabledUntil", Date.now() + 2 * 24 * 60 * 60 * 1000); // 2일 후
    onConfirm?.();  // 필요 시 모달 닫기
  };

  return (
    <div className="certify-wrap">
      <svg className='certify-close' onClick={onClose} width="13" height="13" viewBox="0 0 13 13" fill="none">
        <line x1="0.707107" y1="1" x2="12" y2="12.2929" stroke="black" strokeLinecap="round"/>
        <line x1="0.5" y1="-0.5" x2="16.4706" y2="-0.5" transform="matrix(-0.707107 0.707107 0.707107 0.707107 13 1)" stroke="black" strokeLinecap="round"/>
      </svg>
      <div className="certify-box1">
        <p className='certify-p1'>주의하세요!</p>
        <p className='certify-p2'>지금 매칭을 종료하면 악용 방지를 위해<br />2일동안 매칭이 제한됩니다. <br />그래도 진행하시겠습니까?</p>
      </div>
      <a href="/matching">
      <div className="certify-box2" onClick={handleConfirm}>
        <p className='certify-p3'>확인 및 매칭 종료</p>
      </div>
      </a>
    </div>
  );
};

export default Certify;

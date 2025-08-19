import React from 'react'
import { useNavigate } from 'react-router-dom';
import { updateUserInterests } from '../../api/users';

function Interest_choice(){

const [activeIndexes, setActiveIndexes] = React.useState([]); // 배열로 상태 관리
const navigate = useNavigate();

const buttons = ['전통문화', '사진', '박물관', '전시', '공예', '맛집','카페', '전통시장', '요리', '문화체험',
  '그림', '산책', '쇼핑', '음악', '게임', '언어교환', '역사', '건축', '자연','운동','책/독서', '패션', '영화', '축제', '반려동물', '힐링'];

const toggleActive = (idx) => {
  if (activeIndexes.includes(idx)) {
    // 이미 선택된 버튼이면 해제
    setActiveIndexes(activeIndexes.filter(i => i !== idx));
  } else {
    // 최대 3개까지만 선택 가능
    if (activeIndexes.length < 3) {
      setActiveIndexes([...activeIndexes, idx]);
    } else {
      alert('최대 3개까지 선택할 수 있습니다.');
    }
  }
};

//관심사 저장
  const handleStart = async () => {
    const selected = activeIndexes.map(i => buttons[i]);
    try {
      await updateUserInterests(selected);
      navigate('/matching');
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert('관심사 저장 실패');
    }
  };

  return (
    <div className='wrap'>
    <div className='interest-choice-box1'>
    <a href="/join">
    <svg className='back' width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M3.825 9L8.71247 13.8875C9.10497 14.28 9.10215 14.9172 8.70619 15.3062C8.31517 15.6904 7.68758 15.6876 7.29997 15.3L0.707106 8.70711C0.316582 8.31658 0.316583 7.68342 0.707107 7.29289L7.29997 0.700027C7.68759 0.312414 8.31517 0.309638 8.70619 0.693805C9.10215 1.08281 9.10497 1.72003 8.71247 2.11253L3.825 7H15C15.5523 7 16 7.44772 16 8C16 8.55229 15.5523 9 15 9H3.825Z" fill="#333333"/>
</svg>
</a>
</div>
<div className="interest-choice-box2">
    <p>무엇에 관심이 있으신가요?</p>
    <h1>관심사를 기반으로 교환학생과 한국학생을</h1>
    <h1>AI가 매칭해드려요.</h1>
    <h1>최대 3개 선택할 수 있어요.</h1>
</div>
<div className="interest-choice-box3">
      {buttons.map((btn, idx) => (
      <button
        key={idx}
        className={`interest-button ${activeIndexes.includes(idx) ? "active" : ""}`}
        onClick={() => toggleActive(idx)}
      >
        {btn}
      </button>
      ))}
</div>
<button className='interest-start' onClick={handleStart}>FriendPass 시작하기</button>
    </div>
  )
}

export default Interest_choice

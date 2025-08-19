import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";

const Modify_Language = () => {

  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [showLanguages, setShowLanguages] = useState(false);
  const [selectedLang, setSelectedLang] = useState("");

  const languages = ["한국어", "English"];

  const handleShowLanguages = () => {
    setShowLanguages(!showLanguages);
  };

  const handleSelectLanguage = (lang) => {
    setSelectedLang(lang);
    setQuery(lang);
    setShowLanguages(false);
  };

  const handleConfirm = () => {
    if (!selectedLang) {
      alert("언어를 선택해주세요.");
      return;
    }
    // 언어 선택 값 저장
    localStorage.setItem("appLanguage", selectedLang);
    // 페이지 새로고침 (언어 반영)
    window.location.reload();
  };

  return (
    <div className='wrap'>
      <div className='language-box1'>
        <a href="mypage">
    <svg className='back' width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M3.825 9L8.71247 13.8875C9.10497 14.28 9.10215 14.9172 8.70619 15.3062C8.31517 15.6904 7.68758 15.6876 7.29997 15.3L0.707106 8.70711C0.316582 8.31658 0.316583 7.68342 0.707107 7.29289L7.29997 0.700027C7.68759 0.312414 8.31517 0.309638 8.70619 0.693805C9.10215 1.08281 9.10497 1.72003 8.71247 2.11253L3.825 7H15C15.5523 7 16 7.44772 16 8C16 8.55229 15.5523 9 15 9H3.825Z" fill="#333333"/>
</svg>
        </a>
        <div>
          <p>사용 언어를 선택해주세요</p>
        </div>
      </div>

      <div className='language-box2'>
        <div className="language-choice">
          <input
            type="text"
            value={query}
            readOnly
            style={{
              height: '25px',
              backgroundColor: 'white',
              color: 'black',
              cursor: 'pointer'
            }}
          />
          <svg
            className='language-find'
            onClick={handleShowLanguages}
            width="12" height="10" viewBox="0 0 12 10"
          >
            <line x1="0.5" y1="-0.5" x2="9.74781" y2="-0.5"
              transform="matrix(0.58549 0.81068 -0.701028 0.713134 0 1)"
              stroke="#888888" strokeLinecap="round" />
            <line x1="0.5" y1="-0.5" x2="9.74781" y2="-0.5"
              transform="matrix(-0.58549 0.81068 0.701028 0.713134 12 1)"
              stroke="#888888" strokeLinecap="round" />
          </svg>

          {showLanguages && (
            <ul className="language-list">
              {languages.map((lang) => (
                <li
                  key={lang}
                  onClick={() => handleSelectLanguage(lang)}
                >
                  {lang}
                </li>
              ))}
            </ul>
          )}
        </div>

        <button className='language-okbtn' onClick={handleConfirm}>
          확인
        </button>
      </div>
    </div>
  );
};

export default Modify_Language

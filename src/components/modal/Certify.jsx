import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const Certify = ({ onClose, onConfirm }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const handleConfirm = async () => {
    onClose(); // 모달 닫기
  };

  return (
    <div className="certify-wrap">
      <svg className='certify-close' onClick={onClose} width="13" height="13" viewBox="0 0 13 13" fill="none">
        <line x1="0.707107" y1="1" x2="12" y2="12.2929" stroke="black" strokeLinecap="round"/>
        <line x1="0.5" y1="-0.5" x2="16.4706" y2="-0.5" transform="matrix(-0.707107 0.707107 0.707107 0.707107 13 1)" stroke="black" strokeLinecap="round"/>
      </svg>
      <div className="certify-box1">
        <p className='certify-p1'>{t('certify.title')}</p>
        <p className='certify-p2'>{t('certify.line1')}<br />{t('certify.line2')}<br />{t('certify.line3')}</p>
      </div>
      <div className="certify-box2" onClick={handleConfirm}>
        <p className='certify-p3'>{t('certify.confirmButton')}</p>
      </div>
    </div>
  );
};

export default Certify;

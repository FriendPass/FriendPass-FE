import React from 'react'
import Delete from '../../assets/img/chat_img/delete.png'
import { useNavigate } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

export default function ReportModal({ openModal, closeModal,payload }) {
    const navigate = useNavigate();
    if (!openModal) return null;

    const SelectChoice = () => {
        closeModal();
        navigate('/reportchoices', { state: payload });
    }

    return (
        <div className='report_modal'>
            <img onClick={closeModal} src={Delete} alt="" />
            <p>사용자를 신고하시겠습니까?</p>
            <button id="yes" onClick={SelectChoice}>확인</button>
        </div>
    )
}





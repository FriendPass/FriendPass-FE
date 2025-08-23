import React from 'react'
import Delete from '../../assets/img/chat_img/delete.png'
import { useNavigate } from 'react-router-dom';

export default function ReportModal({ openModal, closeModal }) {
    const navigate = useNavigate();
    if (!openModal) return null;

    const SelectChoice = () => {
        navigate('/reportchoices')
    }

    return (
        <div className='report_modal'>
            <img onClick={closeModal} src={Delete} alt="" />
            <p>사용자를 신고하시겠습니까?</p>
            <button onClick={SelectChoice}>확인</button>
        </div>
    )
}





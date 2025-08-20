import React from 'react'
import Delete from '../../assets/img/chat_img/delete.png'
import axios from 'axios'

export default function ReportModal({ openModal, closeModal }) {
    if (!openModal) return null;
    const API_URL = "백엔드 API 주소"
    
    const handleReport = (userId) => {
        axios.post(API_URL, { targetUserId: userId })
            .then(() => {
                closeModal();
            })
            .catch(
                error => {
                    console.error("신고 axios 오류", error);
                });
    }

    return (
        <div className='report_modal'>
            <img onClick={closeModal} src={Delete} alt="" />
            <p>사용자를 신고하시겠습니까?</p>
            <button onClick={handleReport}>확인</button>
        </div>
    )
}



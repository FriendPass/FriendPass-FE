import React, { useState, useEffect } from 'react'
import report from '../../assets/img/chat_img/report.png'
import Delete from '../../assets/img/chat_img/delete.png'
import { useNavigate } from 'react-router-dom';
import ReportModal from './ReportModal';
import axios from 'axios';

export default function Profile() {
    const navigate = useNavigate();

    const goBack = () => {
        navigate(-1);
    }
    const [open, setOpen] = useState(false);
    const openModal = () => {
        setOpen(true);
    };
    const closeModal = () => {
        setOpen(false);
    };

    return (
        <div className="Profile wrap">
            <div className="header">
                <img onClick={goBack} src={Delete} alt="" />
            </div>
            <div className="main">
                <img src={Delete} alt="" />
                <span>Sarah</span>
            </div>
            <button id="profile_btn" onClick={openModal}>
                <img src={report} alt="" />
                <p>사용자 신고하기</p>
            </button>
            <ReportModal openModal={open} closeModal={closeModal}  />
        </div>
    )
}

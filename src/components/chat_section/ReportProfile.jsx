import React, { useState, useEffect } from 'react'
import report from '../../assets/img/chat_img/report.png'
import Delete from '../../assets/img/chat_img/delete.png'
import defaultProfile from '../../assets/img/chat_img/default_profile.png'
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import ReportModal from './ReportModal';
import axios from 'axios';
import { useTranslation } from "react-i18next";

const getAuthHeaders = () => {
    const raw = localStorage.getItem('accessToken');
    const token =
        raw && raw.startsWith('"') && raw.endsWith('"') ? raw.slice(1, -1) : raw;
    if (!token) return {};
    const value = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
    return { Authorization: value, 'Content-Type': 'application/json' };
};

const API_BASE = process.env.REACT_APP_CHAT_API;

export default function Profile() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { roomId, userId } = useParams();
    const { state } = useLocation();
    const rid = String(roomId ?? '').split(':')[0];

    const payload = {
        reportedUserID: Number(userId),
        chatId: Number(roomId),
    };

    const goInfo = () => {
        navigate(`/chat/${rid}/info`);
    }
    const [open, setOpen] = useState(false);
    const [profile, setProfile] = useState({
        nickname: state?.nickname ?? '',
        profileImage: state?.profileImage ?? '',
    });

    // state 없이 직접 진입한 경우(새로고침/딥링크)에도 안전하게 보완 조회
    useEffect(() => {
        if (profile.nickname && profile.profileImage) return;

        const INFO_URL = `${API_BASE}/rooms/${roomId}`;
        axios
            .get(INFO_URL, {
                headers: getAuthHeaders(),
            })
            .then(({ data }) => {
                const list = Array.isArray(data?.teammates) ? data.teammates : [];
                const found =
                    list.find((t) => String(t.userId) === String(userId)) ?? null;
                if (found) {
                    setProfile({
                        nickname: found.nickname ?? '',
                        profileImage: found.profileImage ?? '',
                    });
                }
            })
            .catch((e) => console.error('프로필 보완 조회 실패', e));
    }, [API_BASE, roomId, userId, profile.nickname, profile.profileImage]);

    return (
        <div className="Profile wrap">
            <div className="header">
                <img onClick={goInfo} src={Delete} alt="" />
            </div>
            <div className="main">
                <img className='profile_img' src={profile.profileImage || defaultProfile} alt='' />
                <span>{profile.nickname || t('reportProfile.user')}</span>
            </div>
            <button id="profile_btn" onClick={() => setOpen(true)}>
                <img src={report} alt="" />
                <p>{t('reportProfile.reportUser')}</p>
            </button>
            <ReportModal openModal={open} closeModal={() => setOpen(false)} payload={payload} />
        </div>
    )
}
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'
import { useTranslation } from "react-i18next";

const API_BASE = process.env.REACT_APP_CHAT_API;

const LIST_URL = `${API_BASE}/rooms`;


// 날짜 포맷터 (ISO 혹은 LocalDateTime 문자열 가정)
const fmtTime = (val) => {
    if (!val) return "";
    try {
        const d = new Date(val);
        if (!isNaN(d.getTime())) {
            const yyyy = d.getFullYear();
            const MM = String(d.getMonth() + 1).padStart(2, "0");
            const dd = String(d.getDate()).padStart(2, "0");
            const hh = String(d.getHours()).padStart(2, "0");
            const mm = String(d.getMinutes()).padStart(2, "0");
            return `${yyyy}-${MM}-${dd} ${hh}:${mm}`;
        }
    }
    catch (_) { }
    return String(val);
};

export default function List() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [current, setCurrent] = useState(null);
    const [previous, setPrevious] = useState([]);

    useEffect(() => {
        console.log('[ChatList] effect fired. LIST_URL =', LIST_URL);
        axios.get(LIST_URL, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`
            }
        })
            .then(({ data }) => {
                const toItem = (r) => ({
                    roomId: r.roomId,
                    title: r.roomName,
                    lastText: r.lastMessage ?? '',
                    lastTs: r.lastMessageAt ?? null,
                    isCurrent: !!r.current,
                });

                let cur = null;
                let prev = [];

                if (data && (data.current || data.previous)) {
                    const currentArr = Array.isArray(data.current) ? data.current.map(toItem) : [];
                    const previousArr = Array.isArray(data.previous) ? data.previous.map(toItem) : [];
                    cur = currentArr[0] ?? null;
                    prev = previousArr;
                }

                setCurrent(cur);
                setPrevious(prev);
            })
            .catch(
                error => {
                    console.error("채팅 목록 axios 오류", error);
                });
    }, []);

    const moveCurrent = () => {
        if (!current) return;
        navigate(`/chat/${current.roomId}`);
    }
    const movePrevious = (roomId) => {
        navigate(`/chat/${roomId}`);
    }

    return (
        <div className='List wrap'>
            <div className="header">
                <h1>{t('chatList.title')}</h1>
            </div>
            <div className="main">
                <div className="current_chat">
                    <h1>{t('chatList.currentMatch')}</h1>
                    {current && (
                        <div onClick={moveCurrent} className="room_box">
                            <div className="top">
                                <h1>{current.title}</h1>
                                <p>{fmtTime(current.lastTs)}</p>
                            </div>
                            <p id="LastText">{current.lastText}</p>
                        </div>
                    )}
                </div>

                <div className="previous_chat">
                    <h1>{t('chatList.previousMatch')}</h1>
                    <div className="room_list">
                        {previous.map(r => (
                            <div key={r.roomId} className="room_box" onClick={() => movePrevious(r.roomId)}>
                                <div className="top">
                                    <h1>{r.title}</h1>
                                    <p>{fmtTime(r.lastTs)}</p>
                                </div>
                                <p id="LastText">{r.lastText}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
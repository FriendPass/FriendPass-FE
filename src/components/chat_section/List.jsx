import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'

export default function List() {
    const navigate = useNavigate();
    const API_URL = "백엔드 API 주소"

    const [current, setCurrent] = useState(null);
    const [previous, setPrevious] = useState([]);

    useEffect(() => {
        axios.get(API_URL)
            .then(({ data }) => {
                const list = Array.isArray(data) ? data : [];
                const cur = list.find(r => r?.status !== 'archived') ?? list[0] ?? null;
                const prev = cur ? list.filter(r => r?.roomId !== cur.roomId) : [];

                setCurrent(cur);
                setPrevious(prev);
            })
            .catch(
                error => {
                    console.error("채팅 목록 axios 오류", error);
                });
    }, []);

    const moveCurrent = () => {
        navigate(`/chat/${current.roomId}`);
    }
    const movePrevious = (roomId) => {
        navigate(`/chat/${roomId}`);
    }

    return (
        <div className='List wrap'>
            <div className="header">
                <h1>채팅 목록</h1>
            </div>
            <div className="main">
                <div className="current_chat">
                    <h1>현재 매칭 채팅</h1>
                    {current && (
                        <div onClick={moveCurrent} className="room_box">
                            <div className="top">
                                <h1>{current.title}</h1>
                                <p>{current.lastTs}</p>
                            </div>
                            <p id="LastText">{current.lastText}</p>
                        </div>
                    )}
                </div>

                <div className="previous_chat">
                    <h1>이전 매칭 채팅</h1>
                    <div className="room_list">
                        {previous.map(r => (
                            <div key={r.roomId} className="room_box" onClick={() => movePrevious(r.roomId)}>
                                <div className="top">
                                    <h1>{r.title}</h1>
                                    <p>{r.lastTs}</p>
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
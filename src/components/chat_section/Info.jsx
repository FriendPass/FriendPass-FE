import React, { useState, useEffect } from 'react'
import back from '../../assets/img/chat_img/back_arrow.png'
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import defaultProfile from '../../assets/img/chat_img/default_profile.png'
import { useTranslation } from "react-i18next";

const API_BASE = process.env.REACT_APP_CHAT_API;


export default function Info() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { roomId } = useParams();

    const rid = String(roomId ?? '').split(':')[0]; // "1:1" -> "1"
    const ROOMS_URL = `${API_BASE}/rooms/${encodeURIComponent(rid)}`;
    const Title_URL = `${API_BASE}/rooms/${encodeURIComponent(rid)}/name`;

    const [isEdit, setIsEdit] = useState(false);
    const [name, setName] = useState(t('chatInfo.roomName'))
    const [selectedInterests, setSelectedInterests] = useState([]);
    const [members, setMembers] = useState([]);

    const goBack = () => {
        navigate(-1);
    }

    //채팅방 이름 변경
    const saveChanges = () => {
        const raw = localStorage.getItem('accessToken');
        const token =
            raw && raw.startsWith('"') && raw.endsWith('"') ? raw.slice(1, -1) : raw;
        if (!token) {
            alert('로그인이 만료됐어요. 다시 로그인 해주세요.');
            return;
        }
        const authValue = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
        axios
            .patch(
                Title_URL,
                { roomName: name },
                {
                    headers: {
                        Authorization: authValue,
                        'Content-Type': 'application/json',
                    },
                }
            )
            .then(() => {
                setIsEdit(false);
                console.log('채팅방 이름 수정 완료');
            })
            .catch((error) => {
                const status = error?.response?.status;
                if (status === 401) {
                    console.warn('401 Unauthorized:', error?.response?.data);
                    alert('세션이 만료됐어요. 다시 로그인 해주세요.');
                    return;
                }
                console.error('채팅방 이름 수정 실패', error);
                alert('이름 변경 중 오류가 발생했어요.');
            });
    };


    const handleKeyDown = (e) => {
        if (e.key === 'Enter') saveChanges();
    };

    //채팅방 정보 가져오기
    useEffect(() => {
        if (!rid) return;

        axios.get(ROOMS_URL, {
            headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
        })
            .then(({ data }) => {
                // { roomId, teamId, roomName, commonInterests:[{interestId, name}], teammates:[{userId, nickname, profileImage?}] }
                setName(data?.roomName ?? t('chatInfo.roomName'));

                const interests = Array.isArray(data?.commonInterests)
                    ? data.commonInterests.map(i => i?.name ?? String(i))
                    : [];
                setSelectedInterests(interests);

                const team = Array.isArray(data?.teammates) ? data.teammates : [];
                setMembers(team);

                console.log('채팅 정보 조회 완료');
            })
            .catch((error) => {
                console.error('채팅 정보 axios 오류', error);
            });
        // 의존성 최소화
    }, [rid]);

    const goProfile = (m) => {
        navigate(`/chat/${rid}/member/${m.userId}`, {
            state: {
                nickname: m.nickname ?? '',
                profileImage: m.profileImage ?? '',
            },
        });
    };


    return (
        <div className='Info wrap'>
            <div className="header">
                <img onClick={goBack} src={back} alt="" />
            </div>
            <div className="room_name">
                {isEdit ? (
                    <input type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        onKeyDown={handleKeyDown}
                        autoFocus
                    />
                ) : (
                    <h1 onClick={() => setIsEdit(true)}>{name}</h1>
                )}
            </div>
            <div className="main">
                <div className='top'>
                    <h2>{t('chatInfo.commonInterests')}</h2>
                    <div className='interest'>
                        {selectedInterests.length === 0 ? (
                            <p>{t('chatInfo.noInterests')}</p>
                        ) : (
                            selectedInterests.map((interest, idx) => (
                                <button key={idx}>{interest}</button>
                            ))
                        )}
                    </div>
                </div>

                <div className="bottom">
                    <h2>{t('chatInfo.members')}</h2>
                    <div className="memebers">
                        {members.length === 0 ? (
                            <p>{t('chatInfo.loadingMembers')}</p>
                        ) : (
                            members.map((m) => (
                                <div key={m.userId} className="member" onClick={() => goProfile(m)}>
                                    <img src={m.profileImage || defaultProfile} alt="" />
                                    <p>{m.nickname}</p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
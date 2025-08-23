import React, { useState, useEffect } from 'react'
import back from '../../assets/img/chat_img/back_arrow.png'
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import defaultProfile from '../../assets/img/chat_img/default_profile.png'

const API_BASE = process.env.REACT_APP_CHAT_API;


export default function Info() {
    const navigate = useNavigate();
    const { roomId } = useParams();
    const INFO_URL = `${API_BASE}/rooms/${roomId}`;
    const Title_URL = `${API_BASE}/rooms/${roomId}/name`

    const [isEdit, setIsEdit] = useState(false);
    const [name, setName] = useState('채팅방 이름');
    const [selectedInterests, setSelectedInterests] = useState([]);
    const [members, setMembers] = useState([]);

    const goBack = () => {
        navigate(-1);
    }

    //채팅방 이름 변경
    const saveChanges = () => {
        axios
            .patch(Title_URL, { roomName: name })

            .then(() => {
                setIsEdit(false);
                console.log('채팅방 이름 수정 완료');
            })
            .catch((error) => {
                console.error('채팅방 이름 수정 실패', error);
            });
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') saveChanges();
    };

    //채팅방 정보 가져오기
    useEffect(() => {
        axios
            .get(INFO_URL)
            .then(({ data }) => {
                // data: { roomId, teamId, roomName, commonInterests:[{interestId,name}], teammates:[{userId,nickname}] }
                if (data?.roomName) setName(data.roomName);

                const interests =
                    Array.isArray(data?.commonInterests)
                        ? data.commonInterests.map((i) => i.name)
                        : [];
                setSelectedInterests(interests);

                setMembers(Array.isArray(data?.teammates) ? data.teammates : []);
                console.log('채팅 정보 조회 완료');
            })
            .catch((error) => {
                console.error('채팅 정보 axios 오류', error);
            });
    }, [INFO_URL]);

    const goProfile = (m) => {
        navigate(`/chat/${roomId}/member/${m.userId}`, {
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
                    <h2>공통 관심사</h2>
                    <div className='interest'>
                        {selectedInterests.length === 0 ? (
                            <p>관심사 정보가 없습니다.</p>
                        ) : (
                            selectedInterests.map((interest, idx) => (
                                <button key={idx}>{interest}</button>
                            ))
                        )}
                    </div>
                </div>

                <div className="bottom">
                    <h2>매칭 멤버</h2>
                    <div className="memebers">
                        {members.length === 0 ? (
                            <p>멤버의 정보를 불러오는 중...</p>
                        ) : (
                            members.map((m) => (
                                <div key={m.userId} className="member" onClick={()=>goProfile(m)}>
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
}

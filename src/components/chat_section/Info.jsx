import React, { useState } from 'react'
import back from '../../assets/img/chat_img/back_arrow.png'
import location from '../../assets/img/chat_img/location.png'
import { useNavigate } from 'react-router-dom';

export default function Info() {
    const navigate = useNavigate();
    const [isEdit, setIsEdit] = useState(false);
    const [name, setName] = useState('채팅방 이름');

    const goBack = () => {
        navigate(-1);
    }
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            saveChanges();
        }
    };
    const saveChanges = () => {
        setIsEdit(false);
    };

    return (
        <div className='Info wrap'>
            <div className="header">
                <img onClick={goBack} src={back} alt="" />
            </div>
            <div className="room_name">
                {isEdit ? (
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
                ) : (
                    <h1 onClick={() => setIsEdit(true)}>{name}</h1>
                )}
            </div>
            <div className="main">
                <h2>매칭 정보 확인</h2>
                <div className="interest">
                    <h3>공통 관심사</h3>
                </div>
                <div className="place">
                    <h3>장소</h3>
                    <div className="location">
                        <img src={location} alt="" />
                    </div>
                </div>
                <div className="members">
                    <h3>매칭 멤버</h3>
                </div>
            </div>
        </div>
    )
}



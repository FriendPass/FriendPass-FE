import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSocket } from '../../socket/SocketProvider';
import arrow from '../../assets/img/chat_img/submit_arrow.png';
import back from '../../assets/img/chat_img/back_arrow.png';
import info from '../../assets/img/chat_img/info.png';


export default function LiveChat({ roomId, userId }) {
  const navigate = useNavigate();
  const socket = useSocket();

  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [myId, setMyId] = useState(null);
  const listRef = useRef(null);
  const textRef = useRef(null);
  const lastTsRef = useRef(0);

  const goBack = () => {
    navigate('/');
  }

  const goInfo = () => {
    navigate('/chatInfo')
  }

  // 방 입장 + 히스토리/실시간 리스너
  useEffect(() => {
    if (!socket || !roomId) return;

    const handleHistory = (list) => {
      if (list?.length) {
        lastTsRef.current = list[list.length - 1].ts;
        setMessages((prev) => [...prev, ...list]);
      }
    };

    const handleChat = (msg) => {
      lastTsRef.current = msg.ts;
      setMessages((prev) => [...prev, msg]);
    };

    const joinRoom = () => {
      socket.emit('join', { roomId, since: lastTsRef.current || 0 }); //서버에 방 입장+히스토리 요청
    };

    // 연결되어 있으면 즉시 join, 아니면 연결되자마자 join
    if (socket.connected) joinRoom();
    socket.on('connect', joinRoom);
    socket.on('history', handleHistory);
    socket.on('chat_msg', handleChat);

    return () => {
      socket.off('connect', joinRoom);
      socket.off('history', handleHistory);
      socket.off('chat_msg', handleChat);
    };
  }, [socket, roomId]);

  //자동 스크롤
  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  // 전송
  const sendMessage = (e) => {
    e.preventDefault();
    const text = message.trim();
    if (!text || !socket) return;
    if (!socket.connected) {
      console.warn('[send blocked] socket not connected');
      return;
    }
    console.log('[send]', { roomId, text });
    socket.emit('chat_msg', { roomId, text });
    setMessage('');

    if (textRef.current) {
      textRef.current.style.height = '';
    }
  };

  //textarea
  const autoGrow = (e) => {
    const el = e.currentTarget;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 150) + 'px';
  }


  return (
    <div className='LiveChat wrap'>
      <div className="header">
        <button id="back" onClick={() => { goBack() }}><img src={back} alt="" /></button>
        <h1>현재 채팅방</h1>
        <button id="info" onClick={() => { goInfo() }}><img src={info} alt="" /></button>
      </div>
      <div className="main">
        <div className="messages" ref={listRef}>
          {messages.map((m) => {
            const isMine = m.senderId === userId;
            return (
              <div className={`msg ${isMine ? 'mine' : 'theirs'}`} key={m.id ?? `${m.ts}-${m.message}`}>
                {!isMine && <div className="writer" title={m.senderId}>
                  {m.senderId}
                </div>}
                <div className="bubble">
                  <span>{m.text}</span>
                  <p>번역 보기</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <form onSubmit={sendMessage} className="input_container">
        <textarea
          ref={textRef}
          className="write"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onInput={autoGrow}
          rows={1}
        />
        <button type='submit'><img src={arrow} alt="" /></button>
      </form>
    </div>
  );
}


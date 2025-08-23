import React, { useEffect, useState, useRef } from 'react';
import { useSocket } from '../../socket/SocketProvider';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import arrow from '../../assets/img/chat_img/submit_arrow.png';
import back from '../../assets/img/chat_img/back_arrow.png';
import info from '../../assets/img/chat_img/info.png';

const API_BASE = process.env.REACT_APP_CHAT_API;
const API_BASE = process.env.REACT_APP_CHAT_API;

export default function LiveChat({ roomId, userId }) {
  const navigate = useNavigate();
  const socket = useSocket();

  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const listRef = useRef(null);
  const textRef = useRef(null);

  const goBack = () => {
    navigate('/');
  }

  const goInfo = () => {
    navigate('/chatInfo')
  }

  // 1) 최초 히스토리 로드 (REST)
  // 1) 최초 히스토리 로드 (REST)
  useEffect(() => {
    if (!roomId) return;
    let alive = true;
    (async () => {
      try {
        const { data } = await axios.get(`${API_BASE}/rooms/${roomId}/messages`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`
          }
        });
        if (!alive) return;
        setMessages(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error('[history GET fail]', e);
    if (!roomId) return;
    let alive = true;
    (async () => {
      try {
        const { data } = await axios.get(`${API_BASE}/rooms/${roomId}/messages`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`
          }
        });
        if (!alive) return;
        setMessages(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error('[history GET fail]', e);
      }
    })();
    return () => { alive = false; };
  }, [roomId]);

  //방 입장(STOMP 구독)
  useEffect(() => {
    if (!socket?.connected || !roomId) return;
    const unsub = socket.subscribeRoom(roomId, (msg) => {
      // msg: { id, roomId, senderId, senderNickname, text, sentAt }
    })();
    return () => { alive = false; };
  }, [roomId]);

  //방 입장(STOMP 구독)
  useEffect(() => {
    if (!socket?.connected || !roomId) return;
    const unsub = socket.subscribeRoom(roomId, (msg) => {
      // msg: { id, roomId, senderId, senderNickname, text, sentAt }
      setMessages((prev) => [...prev, msg]);
    });
    return () => unsub?.();
  }, [socket, socket?.connected, roomId]);
    });
    return () => unsub?.();
  }, [socket, socket?.connected, roomId]);

  //자동 스크롤
  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  // 전송
  const sendMessage = (e) => {
    e.preventDefault();
    const text = message.trim();
    if (!text || !socket?.connected) return;
    socket.sendMessage(roomId, { text });
    if (!text || !socket?.connected) return;
    socket.sendMessage(roomId, { text });
    setMessage('');
    textRef.current && (textRef.current.style.height = '');
  };

  // 5) 번역 (REST)
  const translateOne = (messageId) => {
    axios.get(`${API_BASE}/messages/${messageId}/translate`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`
      }
    })
      .then((response) => {
        const data = response.data;
        setMessages((prev) =>
          prev.map((m) =>
            m.id === messageId ? { ...m, translatedText: data.translatedText } : m
          )
        );
      })
      .catch((error) => {
        console.error("번역 axios 오류", error);
      });
  };

    textRef.current && (textRef.current.style.height = '');
  };

  // 5) 번역 (REST)
  const translateOne = (messageId) => {
    axios.get(`${API_BASE}/messages/${messageId}/translate`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`
      }
    })
      .then((response) => {
        const data = response.data;
        setMessages((prev) =>
          prev.map((m) =>
            m.id === messageId ? { ...m, translatedText: data.translatedText } : m
          )
        );
      })
      .catch((error) => {
        console.error("번역 axios 오류", error);
      });
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
                {!isMine && <div className="writer" title={m.senderNickname}>
                  {m.senderNickname}
                {!isMine && <div className="writer" title={m.senderNickname}>
                  {m.senderNickname}
                </div>}
                <div className="bubble">
                  <span>{m.text}</span>
                  <button type="button" onClick={() => translateOne(m.id)} style={{ marginLeft: 8 }}>
                    번역 보기
                  </button>
                  {m.translatedText && <div className="translated">{m.translatedText}</div>}
                  <button type="button" onClick={() => translateOne(m.id)} style={{ marginLeft: 8 }}>
                    번역 보기
                  </button>
                  {m.translatedText && <div className="translated">{m.translatedText}</div>}
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
    </div >
    </div >
  );
}

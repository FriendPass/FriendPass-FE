import React, { useEffect, useState, useRef } from 'react';
import { useSocket } from '../../socket/SocketProvider';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import arrow from '../../assets/img/chat_img/submit_arrow.png';
import back from '../../assets/img/chat_img/back_arrow.png';
import info from '../../assets/img/chat_img/info.png';
import { useTranslation } from "react-i18next";

const API_BASE = process.env.REACT_APP_CHAT_API;

export default function LiveChat() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { roomId } = useParams();
  const socket = useSocket();

  const rid = String(roomId ?? '').split(':')[0];
  const userId = Number(localStorage.getItem('userId') || 0);

  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [sending, setSending] = useState(false);
  const listRef = useRef(null);
  const textRef = useRef(null);

  const seenIdsRef = useRef(new Set());

  const goBack = () => {
    navigate('/chatList');
  }

  const goInfo = () => {
    navigate(`/chat/${rid}/info`);
  }

  // 1) 최초 히스토리 로드 (REST)
  useEffect(() => {
    if (!rid) return;
    let alive = true;
    (async () => {
      try {
        const { data } = await axios.get(`${API_BASE}/rooms/${rid}/messages`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
        });
        if (!alive) return;
        const arr = Array.isArray(data) ? data : [];
        seenIdsRef.current = new Set(
          arr.filter(m => m?.id != null).map(m => String(m.id))
        );
        setMessages(arr);
        arr.forEach(m => { if (m?.id) seenIdsRef.current.add(m.id); });
      } catch (e) {
        console.error('채팅history axios 오류', e);
      }
    })();
    return () => { alive = false; };
  }, [rid]);

  //방 입장(STOMP 구독)
  useEffect(() => {
    console.log('[WS] connected?', socket?.connected, 'rid=', rid);
    if (!socket?.connected || !rid) return;
    console.log('[WS] subscribe room', rid);
    const unsub = socket.subscribeRoom(rid, (msg) => {
      // msg: { id, roomId, senderId, senderNickname, text, sentAt, translatedText? }
      const id = msg?.id;
      if (id != null) {
        const key = String(id);
        if (!seenIdsRef.current.has(key)) {
          seenIdsRef.current.add(key);
          setMessages(prev => [...prev, msg]);
        }
      } else {
        // id가 없다면 안전하게 그냥 추가
        setMessages(prev => [...prev, msg]);
      }
    });
    return () => unsub?.();
  }, [socket, socket?.connected, rid]);

  //자동 스크롤
  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  // 전송
  const sendMessage = async (e) => {
    if (e?.preventDefault) e.preventDefault();
    const text = (message || '').trim();
    if (!text || sending) return; // 빈문자/중복 전송 방지
    setSending(true);
    try {
      const token = localStorage.getItem('accessToken');
      const url = `${API_BASE}/rooms/${rid}/messages`;
      const body = { text }; // 서버 스펙: { "text": "..." }
      const headers = { Authorization: `Bearer ${token}` };

      const { data } = await axios.post(url, body, { headers });
      console.log('[SEND] POST ok', data);

      if (data?.id != null) {
        const key = String(data.id);
        if (!seenIdsRef.current.has(key)) {
          seenIdsRef.current.add(key);
          setMessages(prev => [...prev, data]);
        }
      } else {
        setMessages(prev => [...prev, data]);
      }

      //입력창 정리
      setMessage('');
      if (textRef.current) textRef.current.style.height = '';
    } catch (err) {
      const status = err?.response?.status;
      console.error('[SEND] POST fail', status, err?.response?.data);
      // 필요시 사용자 피드백(토스트 등) 추가 가능
    } finally {
      setSending(false);
    }
  };

  // 5) 번역 (REST)
  const translateOne = (messageId) => {
    const me = Number(localStorage.getItem('userId') || 0);
    const target = messages.find((m) => m.id === messageId);
    if (!target || Number(target.senderId) === me) return;

    if (target.translatedText) {
      setMessages(prev =>
        prev.map(m => m.id === messageId ? { ...m, translatedText: undefined } : m)
      );
      return;
    }
    axios.get(`${API_BASE}/messages/${messageId}/translate`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
    })
      .then(({ data }) => {
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
        <h1>{t('liveChat.currentRoom')}</h1>
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
                </div>}
                <div className={`bubble ${m.translatedText ? 'has-translation' : ''}`}>
                  <span>{m.text}</span>
                  {!isMine && (
                    <>
                      <button type="button" onClick={() => translateOne(m.id)}>
                        {m.translatedText ? t('liveChat.hideTranslation') : t('liveChat.translate')}
                      </button>
                      {m.translatedText && <div className="translated">{m.translatedText}</div>}
                    </>
                  )}
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
        <button type='submit' disabled={sending || !message.trim()}><img src={arrow} alt="" /></button>
      </form>
    </div >
  );
}
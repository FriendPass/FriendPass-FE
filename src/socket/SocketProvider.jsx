// SocketProvider.jsx
import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const SocketCtx = createContext(null);
export const useSocket = () => useContext(SocketCtx);

const WS_URL = process.env.REACT_APP_WS_URL;   // 예: https://friendpass.site/ws
const PUB_BASE = '/app/rooms/';
const SUB_BASE = '/topic/rooms/';

// localStorage → auth 상태
function readAuth() {
  const token = localStorage.getItem('accessToken') || '';
  let userId = localStorage.getItem('userId') || '';
  if (!userId && token.includes('.')) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload?.sub) userId = String(payload.sub);
    } catch {}
  }
  return { token, userId };
}

export default function SocketProvider({ children }) {
  const [connected, setConnected] = useState(false);
  const [lastError, setLastError] = useState(null);
  const clientRef = useRef(null);
  const [auth, setAuth] = useState(readAuth());

  // 로그인/로그아웃 등 auth 변화 감지
  useEffect(() => {
    const sync = () => setAuth(readAuth());
    window.addEventListener('storage', sync);
    window.addEventListener('auth-updated', sync);
    const t = setInterval(sync, 1000);
    return () => {
      window.removeEventListener('storage', sync);
      window.removeEventListener('auth-updated', sync);
      clearInterval(t);
    };
  }, []);

  // ★ 단일 STOMP 클라이언트 생성/관리 (내장 재연결 사용)
  useEffect(() => {
    const { token, userId } = auth;
    console.log('[WS INIT]', { WS_URL, hasToken: !!token, userId });

    // 토큰/유저ID 없으면 연결 해제하고 대기
    if (!WS_URL || !token || !userId) {
      try { clientRef.current?.deactivate(); } catch {}
      clientRef.current = null;
      setConnected(false);
      if (!WS_URL) console.error('[WS] REACT_APP_WS_URL 미설정');
      if (!token || !userId) console.warn('[WS] 토큰/유저ID 없음. 연결 보류');
      return;
    }

    // 기존 연결 정리
    try { clientRef.current?.deactivate(); } catch {}
    clientRef.current = null;

    // [CHANGED] 내장 재연결(reconnectDelay)만 사용. 수동 타임아웃/쿼리스트링 재시도는 제거.
    const client = new Client({
      webSocketFactory: () => new SockJS(WS_URL),
      reconnectDelay: 5000,                                 // [CHANGED] 자동 재연결(5s)
      // 하트비트는 서버 설정에 맞춰 사용 (켜져 있어도 무해)
      heartbeatIncoming: 10000,                             // [ADDED]
      heartbeatOutgoing: 10000,                             // [ADDED]
      connectHeaders: {
        Authorization: `Bearer ${token}`,                   // [CHANGED] 헤더로만 인증
        'user-id': String(userId),
      },
      debug: (str) => console.log('[STOMP]', str),
      onConnect: () => {
        console.log('[WS] CONNECTED');
        setConnected(true);
        setLastError(null);
      },
      onStompError: (frame) => {
        const msg = `${frame.headers['message']} ${frame.body || ''}`.trim();
        console.error('[WS] STOMP ERROR:', msg);
        setLastError(msg);
      },
      onWebSocketError: (e) => {
        console.error('[WS] SOCKET ERROR:', e?.message || e);
        setLastError(e?.message || String(e));
      },
      onWebSocketClose: (e) => {
        console.warn('[WS] CLOSED:', e?.code, e?.reason);
        setConnected(false);
        // [NOTE] 재연결은 reconnectDelay가 자동 수행
      },
    });

    clientRef.current = client;
    client.activate();                                      // [CHANGED] 바로 활성화

    return () => {
      try { client.deactivate(); } catch {}
      clientRef.current = null;
      setConnected(false);
    };
  }, [WS_URL, auth.token, auth.userId]);

  const api = useMemo(() => ({
    connected,
    lastError,
    subscribeRoom: (rid, cb) => {
      if (!clientRef.current || !connected) return () => {};
      const sub = clientRef.current.subscribe(`${SUB_BASE}${rid}`, (msg) => {
        try { cb(JSON.parse(msg.body)); }
        catch { cb(msg.body); }
      });
      return () => { try { sub.unsubscribe(); } catch {} };
    },
    sendMessage: (rid, body) => {
      if (!clientRef.current || !connected) return;
      clientRef.current.publish({
        destination: `${PUB_BASE}${rid}`,
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(body),
      });
    },
  }), [connected, lastError]);

  return <SocketCtx.Provider value={api}>{children}</SocketCtx.Provider>;
}
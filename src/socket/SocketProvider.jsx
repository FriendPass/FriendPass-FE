import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SocketCtx = createContext(null);
export const useSocket = () => useContext(SocketCtx);

const SOCKET_URL = 'http://127.0.0.1:3001';

export default function SocketProvider({ children, userId }) {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // userId 없으면 연결하지 않고, 기존 연결이 있으면 끊음
    if (!userId) {
      if (socket) {
        socket.removeAllListeners();
        socket.disconnect();
        setSocket(null);
      }
      return;
    }

    const s = io(SOCKET_URL, {
      //withCredentials: true,
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 500,
      auth: { userId }, // ★ 로그인 직후 자동 연결 포인트
    });
    setSocket(s);

    const onConnect = () => console.log('[socket] connected', s.id);
    const onDisconnect = (r) => console.log('[socket] disconnected', r);
    s.on('connect', onConnect);
    s.on('disconnect', onDisconnect);
    s.on('connect_error', (err) => {
      console.error('[socket connect_error]', err?.message, err);
    });
    return () => {
      s.off('connect', onConnect);
      s.off('disconnect', onDisconnect);
      s.removeAllListeners();
      s.disconnect();
    };
    // userId가 바뀔 때만 재연결
  }, [userId]); // ★ 핵심: 의존성에 userId 추가

  return <SocketCtx.Provider value={socket}>{children}</SocketCtx.Provider>;
}

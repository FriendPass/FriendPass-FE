import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

const SocketCtx = createContext(null);
export const useSocket = () => useContext(SocketCtx);

const WS_URL = process.env.REACT_APP_WS_URL || "http://localhost:8080/ws";
const PUB_PREFIX = process.env.REACT_APP_STOMP_PUB_PREFIX || "/app/rooms/";
const SUB_PREFIX = process.env.REACT_APP_STOMP_SUB_PREFIX || "/topic/rooms/";

export default function SocketProvider({ children, userId, token }) {
  const clientRef = useRef(null);
  const [connected, setConnected] = useState(false);
  const subsRef = useRef(new Map()); //중복 구독 방지

  useEffect(() => {
    if (!userId || !token) {
      if (clientRef.current) {
        clientRef.current.deactivate();
        clientRef.current = null;
      }
      setConnected(false);
      subsRef.current.forEach((s) => s?.unsubscribe?.());
      subsRef.current.clear();
      return;
    }

    const client = new Client({
      webSocketFactory: () => new SockJS(WS_URL),
      reconnectDelay: 1000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      connectHeaders: {
        "user-id": String(userId),
        Authorization: `Bearer ${localStorage.getItem('access_token')}`
      },
      onConnect: () => setConnected(true),
      onStompError: (frame) => {
        console.error("[STOMP ERROR]", frame.headers["message"], frame.body);
      },
      onWebSocketClose: () => setConnected(false),
    });

    clientRef.current = client;
    client.activate();

    return () => {
      client.deactivate();
      clientRef.current = null;
    };
  }, [userId, token]);

  const api = useMemo(() => {
    return {
      connected,

      subscribeRoom(roomId, onMessage) {
        if (!clientRef.current || !connected || !roomId) return () => { };
        const dest = `${SUB_PREFIX}${roomId}`;
        const sub = clientRef.current.subscribe(dest, (frame) => {
          try {
            onMessage?.(JSON.parse(frame.body));
          } catch (e) {
            console.warn("[subscribeRoom] JSON parse fail", e, frame.body);
          }
        });
        return () => sub?.unsubscribe();
      },

      sendMessage(roomId, { text }) {
        if (!clientRef.current || !connected || !roomId || !text?.trim()) return;
        clientRef.current.publish({
          destination: `${PUB_PREFIX}${roomId}`,
          body: JSON.stringify({ text }),
        });
      }
    };
  }, [connected]);

  return <SocketCtx.Provider value={api}>{children}</SocketCtx.Provider>;
}

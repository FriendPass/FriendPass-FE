const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { v4: uuidv4 } = require('uuid');

const PORT = 3001;
const HOST = '127.0.0.1';

const app = express();
const server = http.createServer(app);

server.on('error', (e) => console.error('[server error]', e));
process.on('uncaughtException', (e) => console.error('[uncaughtException]', e));
process.on('unhandledRejection', (e) => console.error('[unhandledRejection]', e));

const ROOM_LIMIT = 500;
const rooms = new Map(); // roomId -> [messages]

function addMessage(roomId, msg) {
  const list = rooms.get(roomId) || [];
  list.push(msg);
  if (list.length > ROOM_LIMIT) list.splice(0, list.length - ROOM_LIMIT);
  rooms.set(roomId, list); //방이 없을 경우 생성.
}

function getHistory(roomId, sinceTs, limit = 50) {
  const list = rooms.get(roomId) || [];
  let hist = list;
  if (sinceTs) hist = list.filter((m) => m.ts > Number(sinceTs));
  // 최신 limit개만, 오래된 순으로
  return hist.slice(-limit);
}

const io = new Server(server, {
  cors: { origin: 'http://localhost:3000', methods: ['GET', 'POST'] },
});
console.log('[io] initialized');

// 소켓 연결 직전(핸드셰이크) 단계에서 userId 받기
io.use((socket, next) => {
  const userId = socket.handshake.auth?.userId; // 핸드셰이크 페이로드
  if (!userId) return next(new Error('unauthorized'));
  socket.data.userId = userId; //소켓 인스턴스에 기억
  next();
});

// 연결
io.on('connection', (socket) => {
  console.log('[io] connection:', socket.id, 'user:', socket.data.userId);

  // 방 입장 + 히스토리 전송
  socket.on('join', ({ roomId, since }) => {
    if (!roomId) return;
    socket.join(roomId);
    const history = getHistory(roomId, since, 50);
    socket.emit('history', history);
    console.log(`[join] user=${socket.data.userId} room=${roomId} hist=${history.length}`);
  });

  // 메시지 수신 → 저장 → 같은 방에 브로드캐스트
  socket.on('chat_msg', ({ roomId, text, tempId }) => {
    if (!roomId || !text) return;
    const msg = {
      id: uuidv4(),
      roomId,
      senderId: socket.data.userId, // 로그인 회원 ID로 기록
      text: String(text),
      ts: Date.now(),
    };
    addMessage(roomId, msg);
    io.to(roomId).emit('chat_msg', { ...msg, tempId }); // 낙관적 UI용 tempId는 선택
    console.log('[msg]', roomId, msg);
  });

  socket.on('disconnect', (reason) => {
    console.log('[io] disconnect:', socket.id, reason);
  });
});

server.listen(PORT, HOST, () => {
  const addr = server.address();
  console.log('[listen ok]', `http://${addr.address}:${addr.port}`);
});
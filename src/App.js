import React from 'react';
import { BrowserRouter, Routes, Route, useParams } from 'react-router-dom';
import ChatList from './components/chat_section/List';
import ChatInfo from './components/chat_section/Info';
import LiveChat from './components/chat_section/LiveChat';
import SocketProvider from './socket/SocketProvider';
import Ranking from './components/ranking_section/Ranking';
import Profile from './components/chat_section/Profile';
import LayoutNoNav from './components/nav_section/LayoutNoNav'
import LayoutwithNav from './components/nav_section/LayoutwithNav'
import { v4 as uuidv4 } from 'uuid';
import { useMemo } from 'react';

function useUserId() {
  return useMemo(() => {
    let id = localStorage.getItem('user_id');
    if (!id) { id = uuidv4(); localStorage.setItem('user_id', id); }
    return id;
  }, []);
}

function LiveChatPage({ userId }) {
  const { roomId } = useParams();
  return <LiveChat roomId={roomId} userId={userId} />;
}

export default function App() {
  const userId = useUserId();
  return (
    <BrowserRouter>
      <SocketProvider userId={userId}>
        <Routes>
          <Route element={<LayoutwithNav />}>
            <Route path='/ranking' element={<Ranking />} />
            <Route path='/' element={<ChatList />} />
          </Route>

          <Route element={<LayoutNoNav />}>
            <Route path='/chat/:roomId' element={<LiveChat userId={userId} />} />
            <Route path='/chatInfo' element={<ChatInfo />} />
            <Route path='/profile' element={<Profile />} />
          </Route>
        </Routes>
      </SocketProvider>
    </BrowserRouter>
  );
}



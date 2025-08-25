import React, { useMemo } from 'react';
import { BrowserRouter, Router, Routes, Route, useParams, useLocation, Navigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';


import ChatList from './components/chat_section/List';
import ChatInfo from './components/chat_section/Info';
import LiveChat from './components/chat_section/LiveChat';
import SocketProvider from './socket/SocketProvider';
import Ranking from './components/ranking_section/Ranking';
import ReportProfile from './components/chat_section/ReportProfile';
import LayoutNoNav from './components/nav_section/LayoutNoNav'
import LayoutwithNav from './components/nav_section/LayoutwithNav'
import ReportChoice from './components/chat_section/ReportChoice';

import Home from './components/Home';
import Login from './components/Login_section/Login';
import JoinStudent from './components/Login_section/Join_student';
import JoinUnv from './components/Login_section/Join_unv';
import JoinNation from './components/Login_section/Join_natoin';
import Join from './components/Login_section/Join'
import InterestChoice from './components/Login_section/Interest_choice'
import Language from './components/Login_section/Language'
import Agree from './components/modal/Agree'
import Matching from './components/Matching_section/Matching';
import Matched from './components/Matching_section/Matched';
import Certify from './components/modal/Certify';
import Yougetreward from './components/Matching_section/Yougetreward';
import Mypage from './components/Mypage_section/Mypage';
import Profile from './components/Mypage_section/Profile';
import ModifyInterest from './components/Mypage_section/Modify_Interest';
import ModifyLanguage from './components/Mypage_section/Modify_Language';

function useUserId() {
  return useMemo(() => {
    let id = localStorage.getItem('user_id');
    if (!id) { id = uuidv4(); localStorage.setItem('user_id', id); }
    return id;
  }, []);
}

export default function App() {
  const userId = useUserId();


  return (
    <BrowserRouter>
      <SocketProvider userId={userId}>
        <Routes>
          <Route element={<LayoutwithNav />}>
            <Route path="/ranking" element={<Ranking />} />
            <Route path="/chatList" element={<ChatList />} />
            <Route path="/matching" element={<Matching />} />
            <Route path="/matched" element={<Matched />} />
            <Route path="/mypage" element={<Mypage />} />
          </Route>

          <Route element={<LayoutNoNav />}>
            <Route path="/chat/:roomId" element={<LiveChat />} />
            <Route path="/chat/:roomId/info" element={<ChatInfo />} />
            <Route path="/member/:userId" element={<ReportProfile />} />
            <Route path='/reportchoices' element={<ReportChoice />} />

            <Route path="/home" element={<Home />} />
            <Route path="/" element={<Login />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/language" element={<Language />} />
            <Route path="/agree" element={<Agree />} />
            <Route path="/login" element={<Login />} />
            <Route path="/joinUnv" element={<JoinUnv />} />
            <Route path="/joinStudent" element={<JoinStudent />} />
            <Route path="/joinNation" element={<JoinNation />} />
            <Route path="/join" element={<Join />} />
            <Route path="/interestChoice" element={<InterestChoice />} />
            <Route path="/certify" element={<Certify />} />
            <Route path="/yougetReward" element={<Yougetreward />} />

            <Route path="/modifyInterest" element={<ModifyInterest />} />
            <Route path="/modifyLanguage" element={<ModifyLanguage />} />
          </Route>
        </Routes>
      </SocketProvider>
    </BrowserRouter>
  );
}





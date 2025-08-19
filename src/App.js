import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
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

const AppWrapper = () => {
  const location = useLocation();

  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/home" element={<Home />} />
        <Route path="/language" element={<Language/>} />
        <Route path="/agree" element={<Agree />} />
        <Route path="/login" element={<Login />} />
        <Route path="/joinUnv" element={<JoinUnv/>} />
        <Route path="/joinStudent" element={<JoinStudent/>} />
        <Route path="/joinNation" element={<JoinNation/>} />
        <Route path="/join" element={<Join/>} />
        <Route path="/interestChoice" element={<InterestChoice/>} />
        <Route path="/matching" element={<Matching/>} />
        <Route path="/matched" element={<Matched/>} />
        <Route path="/certify" element={<Certify />} />
        <Route path="/yougetReward" element={<Yougetreward />} />
        <Route path="/mypage" element={<Mypage/>} />
        <Route path="/profile" element={<Profile/>} />
        <Route path="/modifyInterest" element={<ModifyInterest/>} />
        <Route path="/modifyLanguage" element={<ModifyLanguage />} />
      </Routes>
    </>
  );
};

function App() {//라우터 기능 사용가능하게 환경세팅
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}

export default App;

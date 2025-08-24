import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import account1 from '../../assets/img/nav_img/account1.png'
import account2 from '../../assets/img/nav_img/account2.png'
import chat1 from '../../assets/img/nav_img/chat1.png'
import chat2 from '../../assets/img/nav_img/chat2.png'
import rank1 from '../../assets/img/nav_img/rank1.png'
import rank2 from '../../assets/img/nav_img/rank2.png'
import match1 from '../../assets/img/nav_img/match1.png'
import match2 from '../../assets/img/nav_img/match2.png'
import { useTranslation } from "react-i18next";

const Nav = () => {
  const { t } = useTranslation();
  const [active, setActive] = useState('match1');

  return (
    <div className='nav_wrap'>
      <Link className="nav_icon" id='match' to='/matching' onClick={() => setActive('match1')}>
        <img src={active === 'match1' ? match2 : match1} alt="" />
        <p style={{ color: active === 'match1' ? '#6177F0' : '#000000' }}>{t("menu.matching")}</p>
      </Link>
      <Link className="nav_icon" id='chat' to='/chatList' onClick={() => setActive('chat1')}>
        <img src={active === 'chat1' ? chat2 : chat1} alt="" />
        <p style={{ color: active === 'chat1' ? '#6177F0' : '#000000' }}>{t("menu.chat")}</p>
      </Link>
      <Link className="nav_icon" id='rank' to='/ranking' onClick={() => setActive('rank1')}>
        <img src={active === 'rank1' ? rank2 : rank1} alt="" />
        <p style={{ color: active === 'rank1' ? '#6177F0' : '#000000' }}>{t("menu.ranking")}</p>
      </Link>
      <Link className="nav_icon" id='account' to='/mypage' onClick={() => setActive('account1')}>
        <img src={active === 'account1' ? account2 : account1} alt="" />
        <p style={{ color: active === 'account1' ? '#6177F0' : '#000000' }}>{t("menu.mypage")}</p>
      </Link>

    </div>
  )
}

export default Nav

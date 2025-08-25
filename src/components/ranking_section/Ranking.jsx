import React, { useEffect, useState } from 'react'
import axios from 'axios'
import AxiosMockAdapter from 'axios-mock-adapter'; //테스트용
import { useTranslation } from "react-i18next";

const API_BASE = process.env.REACT_APP_RANK_API
const MyRank_URL = `${API_BASE}/me`;
const OthersRank_URL = `${API_BASE}/leaderboard`;

export default function Ranking() {
    const { t } = useTranslation();
    const [myRank, setMyRank] = useState(null);
    const [rankList, setRankList] = useState([]);


    //테스트용
    const mock = new AxiosMockAdapter(axios, { delayResponse: 400 });
    mock.onGet(MyRank_URL).reply(200, {                    // [추가] 내 랭킹 목업
        id: 'me01', rank: 7, name: '노은서', stamp: 15, isMe: true
    });
    mock.onGet(OthersRank_URL).reply(200, [                // [변경] 리더보드 목업(내 계정 제외)
        { id: 'u101', rank: 1, name: '김아라', stamp: 28, isMe: false },
        { id: 'u102', rank: 2, name: 'Lee John', stamp: 26, isMe: false },
        { id: 'u103', rank: 3, name: 'Zhang Li', stamp: 24, isMe: false },
        { id: 'u104', rank: 4, name: '佐藤', stamp: 20, isMe: false },
        { id: 'u105', rank: 5, name: '최유진', stamp: 19, isMe: false },
        { id: 'u106', rank: 6, name: 'Park Min', stamp: 16, isMe: false },
        { id: 'u107', rank: 8, name: 'Anna', stamp: 12, isMe: false },
    ]);

    useEffect(() => {
        //두 api 동시 호출
        Promise.all([axios.get(MyRank_URL), axios.get(OthersRank_URL)])
            .then(([meRes, listRes]) => {
                const me = meRes?.data ?? null;
                const others = Array.isArray(listRes?.data) ? listRes.data : [];
                setMyRank(me);                              
                setRankList(others);                       
            })
            .catch(error => {
                console.error("랭킹 axios 오류", error);   
            });
    }, []);

    return (
        <div className="rank wrap">
            <h1>{t("ranking.title")}</h1>
            <div className="my_ranking">
                <h2>{t("ranking.myRankTitle")}</h2>
                {myRank && (
                    <div className="box">
                        <div className="content">
                            <p id="rank">{t("ranking.rank", { n: myRank.rank })}</p>
                            <span>{t("ranking.stampsWithSpace", { n: myRank.stamp })}</span>
                        </div>
                    </div>
                )}
            </div>
            <div className="all_ranking">
                <h2>{t("ranking.allRankTitle")}</h2>
                <div className="box_list">
                    {rankList.map((rank) => (
                        <div className={`box ${rank.rank <= 3 ? `top_${rank.rank}` : ''}`} key={rank.id}>
                            <div className="content">
                                <p id="rank">{t("ranking.rank", { n: rank.rank })}</p>
                                <p id='name'>{rank.name}</p>
                                <span>{t("ranking.stampsNoSpace", { n: rank.stamp })}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
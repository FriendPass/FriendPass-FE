import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useTranslation } from "react-i18next";

const API_BASE = process.env.REACT_APP_RANK_API
const MyRank_URL = `${API_BASE}/me`;
const OthersRank_URL = `${API_BASE}/leaderboard`;

export default function Ranking() {
    const { t } = useTranslation();
    const [myRank, setMyRank] = useState(null);
    const [rankList, setRankList] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem("accessToken"); // 로그인 시 저장된 토큰
        const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

        //두 api 동시 호출
        Promise.all([
            axios.get(MyRank_URL, { headers: authHeaders }),
            axios.get(OthersRank_URL, { headers: authHeaders })
        ])
            .then(([meRes, listRes]) => {
                console.log("MyRank응담:", meRes.data);
                console.log("OtherRank응답:", listRes.data);
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
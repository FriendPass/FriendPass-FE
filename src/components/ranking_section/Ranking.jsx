import React, { useEffect, useState } from 'react'
import axios from 'axios'
import AxiosMockAdapter from 'axios-mock-adapter'; //테스트용

const API_BASE = process.env.REACT_APP_RANK_API
const MyRank_URL=  `${API_BASE}/me`;
const OthersRank_URL=`${API_BASE}/leaderboard?page=0&size=10`;

export default function Ranking() {
    const [myRank, setMyRank] = useState(null);
    const [rankList, setRankList] = useState([]);
    

    //테스트용
    const mock = new AxiosMockAdapter(axios, { delayResponse: 400 });
    mock.onGet(API_BASE).reply(200, [
        { id: 'u101', rank: 1, name: '김아라', stamp: 28, isMe: false },
        { id: 'u102', rank: 2, name: 'Lee John', stamp: 26, isMe: false },
        { id: 'u103', rank: 3, name: 'Zhang Li', stamp: 24, isMe: false },
        { id: 'u104', rank: 4, name: '佐藤', stamp: 20, isMe: false },
        { id: 'me01', rank: 7, name: '노은서', stamp: 15, isMe: true },
        { id: 'u105', rank: 5, name: '최유진', stamp: 19, isMe: false },
        { id: 'u106', rank: 6, name: 'Park Min', stamp: 16, isMe: false },
        { id: 'u107', rank: 8, name: 'Anna', stamp: 12, isMe: false },
    ]);
    
    useEffect(() => {
        axios.get(API_BASE)
            .then(response => {
                const data = response.data;
                const me = data.find(r => r.isMe);
                setMyRank(me);
                setRankList(data.filter(r => !r.isMe));
            })
            .catch(error => {
                console.error("랭킹 axios 오류", error);
            });
    }, []);

    return (
        <div className="rank wrap">
            <h1>랭킹</h1>
            <div className="my_ranking">
                <h2>나의 랭킹</h2>
                {myRank && (
                    <div className="box">
                        <div className="content">
                            <p id='rank'>{myRank.rank}등</p>
                            <span>리워드 도장 {myRank.stamp}개</span>
                        </div>
                    </div>
                )}
            </div>
            <div className="all_ranking">
                <h2>전체 랭킹</h2>
                <div className="box_list">
                    {rankList.map((rank) => (
                        <div className={`box ${rank.rank <= 3 ? `top_${rank.rank}` : ''}`} key={rank.id}>
                            <div className="content">
                                <p id='rank'>{rank.rank}등</p>
                                <p id='name'>{rank.name}</p>
                                <span>리워드 도장{rank.stamp}개</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

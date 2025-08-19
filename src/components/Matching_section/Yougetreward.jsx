import React, { useEffect, useState } from 'react'
import yougetrewardimg from '../../assets/img/yougetreward.png'
import { getMyRewards } from '../../api/rewards'

const Yougetreward = () => {
  const [rewardCount, setRewardCount] = useState(null)

  useEffect(() => {
    const fetchReward = async () => {
      try {
        const data = await getMyRewards()
        // 응답 구조에 맞게 count 꺼내기
        setRewardCount(data.count)
      } catch (error) {
        console.error('리워드 개수 불러오기 실패:', error)
      }
    }

    fetchReward()
  }, [])

  return (
    <div className='wrap'>
      <div className="yougetreward-wrap">
        <div className="yougetreward-box1">
            <p className='yougetreward-p1'>매칭 활동 인증이</p>
            <p className='yougetreward-p1'>완료되었습니다!</p>
        </div>
        <div className="yougetreward-box2">
            <p className='yougetreward-p1'>{rewardCount !== null ? `${rewardCount}번째 ` : ''}리워드 획득을</p>
            <p className='yougetreward-p1'>축하해요!</p>
        </div>
        <div className="yougetreward-box3">
        <img src={yougetrewardimg} alt="축하 이미지" />
        </div>
        <a href="/matching">
        <button className='yougetreward-btn'>매칭 홈으로 가기</button>
        </a>
      </div>
    </div>
  )
}

export default Yougetreward

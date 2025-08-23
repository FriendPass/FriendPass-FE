import React, { useEffect, useState } from 'react'
import yougetrewardimg from '../../assets/img/yougetreward.png'
import { getMyRewards } from '../../api/rewards'
import { useTranslation } from 'react-i18next'

const Yougetreward = () => {
  const [rewardCount, setRewardCount] = useState(null)
  const { t } = useTranslation()

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
            <p className='yougetreward-p1'>{t('yougetreward.complete1')}</p>
            <p className='yougetreward-p1'>{t('yougetreward.complete2')}</p>
        </div>
        <div className="yougetreward-box2">
            <p className='yougetreward-p1'>{rewardCount !== null ? `${rewardCount}번째 ` : ''}{t('yougetreward.reward1')}</p>
            <p className='yougetreward-p1'>{t('yougetreward.reward2')}</p>
        </div>
        <div className="yougetreward-box3">
        <img src={yougetrewardimg} alt="축하 이미지" />
        </div>
        <a href="/matching">
        <button className='yougetreward-btn'>{t('yougetreward.button')}</button>
        </a>
      </div>
    </div>
  )
}

export default Yougetreward

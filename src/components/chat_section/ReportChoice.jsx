import React, { useState } from 'react'
import Delete from '../../assets/img/chat_img/delete.png'
import axios from 'axios'
import { useNavigate, useLocation } from 'react-router-dom';

const API_BASE = process.env.REACT_APP_BASE;
const Report_URL = `${API_BASE}/reports`;

const CATEGORY_MAP = {
    '욕설/비하': 'ABUSE',
    '성희롱/부적절한 언행': 'SEXUAL_HARASSMENT',
    '스팸/광고': 'SPAM',
    '사기/금전 요구': 'FRAUD',
    '오프라인 위협/위험 행동': 'OFFLINE_THREAT',
    '기타(직접 작성)': 'OTHER',
};

export default function ReportChoice() {
    const navigate = useNavigate();
    const { state } = useLocation();

    const reportedUserID = state?.reportedUserID ?? null;
    const chatId = state?.chatId ?? null;
    const messageId = state?.messageId ?? null;

    const [category, setCategory] = useState('');
    const [reason, setReason] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const goBack = () => {
        navigate('/reportprofile');
    }

    const handleChoiceClick = (e) => {
        const block = e.target.closest('.block, .block2');
        if (!block) return;

        const label = block.querySelector('p')?.textContent?.trim();
        if (!label) return;

        setCategory(label);
        if (label !== '기타(직접 작성)') setReason('');
    };

    const handleReport = () => {
        if (submitting) return; // 중복 클릭 방지
        const reasonCategory = CATEGORY_MAP[category];

        if (!category) {
            alert('신고 사유를 선택해주세요.');
            return;
        }
        if (reasonCategory === 'OTHER' && !reason.trim()) {
            alert('기타 사유를 입력해주세요.');
            return;
        }

        const payload = {
            reportedUserID,
            chatId,
            messageId,
            reasonCategory,
            reasonText: reason.trim() || null,
        };

        setSubmitting(true);

        axios.post(Report_URL, payload)
            .then(() => {
                console.log("신고 작성 완료");
                navigate('/chatInfo', { replace: true });
            })
            .catch((error) => {
                console.error("신고 axios 오류", error);
            });
    }
    return (
        <div className="ReportChoice wrap">
            <div className="header">
                <img onClick={goBack} src={Delete} alt="" />
            </div>
            <div className="main">
                <h1>어떤 이유로 신고하시나요?</h1>
                <div className="choices" onClick={handleChoiceClick}>
                    <div className="block">
                        <p>욕설/비하</p>
                    </div>
                    <div className="block">
                        <p>성희롱/부적절한 언행</p>
                    </div>
                    <div className="block">
                        <p>스팸/광고</p>
                    </div>
                    <div className="block">
                        <p>사기/금전 요구</p>
                    </div>
                    <div className="block">
                        <p>오프라인 위협/위험 행동</p>
                    </div>
                    <div className="block2">
                        <p>기타(직접 작성)</p>
                        <input type="text" value={reason} onChange={(e) => { setReason(e.target.value) }} />
                    </div>
                </div>
                <button onClick={handleReport} disabled={submitting}> {submitting ? '신고 중...' : '신고하기'}</button>
            </div>
        </div>
    )
}

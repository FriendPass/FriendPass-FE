import React, { useState } from 'react'
import Delete from '../../assets/img/chat_img/delete.png'
import axios from 'axios'
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from "react-i18next";

const API_BASE = process.env.REACT_APP_BASE;
const Report_URL = `${API_BASE}/reports`;

const CATEGORY_MAP = {
    '욕설/비하': 'ABUSE',
    '성희롱/부적절한 언행': 'SEXUAL_HARASSMENT',
    '스팸/광고': 'SPAM',
    '사기/금전 요구': 'FRAUD',
    '오프라인 위협/위험 행동': 'OFFLINE_THREAT',
    '기타(직접 작성)': 'OTHER',
    'Abuse/Insult': 'ABUSE',
    'Sexual Harassment/Inappropriate Behavior': 'SEXUAL_HARASSMENT',
    'Spam/Ads': 'SPAM',
    'Fraud/Money Request': 'FRAUD',
    'Offline Threat/Risky Behavior': 'OFFLINE_THREAT',
    'Other (write directly)': 'OTHER',
};

export default function ReportChoice() {
    const { t, i18n } = useTranslation();
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
        if (label !== t('report.categories.other')) setReason('');
    };

    const handleReport = () => {
        if (submitting) return; // 중복 클릭 방지
        const reasonCategory = CATEGORY_MAP[category];

        if (!category) {
            alert(t('report.valid.selectCategory'));
            return;
        }
        if (reasonCategory === 'OTHER' && !reason.trim()) {
            alert(t('report.valid.enterOther'));
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
                <h1>{t('report.title')}</h1>
                <div className="choices" onClick={handleChoiceClick}>
                    <div className="block">
                        <p>{t('report.categories.abuse')}</p>
                    </div>
                    <div className="block">
                        <p>{t('report.categories.sexual')}</p>
                    </div>
                    <div className="block">
                        <p>{t('report.categories.spam')}</p>
                    </div>
                    <div className="block">
                        <p>{t('report.categories.fraud')}</p>
                    </div>
                    <div className="block">
                        <p>{t('report.categories.offline')}</p>
                    </div>
                    <div className="block2">
                        <p>{t('report.categories.other')}</p>
                        <input type="text" value={reason} onChange={(e) => { setReason(e.target.value) }} placeholder={t('report.otherPlaceholder')} />
                    </div>
                </div>
                <button onClick={handleReport} disabled={submitting}> {submitting ? t('report.submitting') : t('report.submit')}</button>
            </div>
        </div>
    )
}
import React from 'react'
import Delete from '../../assets/img/chat_img/delete.png'
import { useNavigate } from 'react-router-dom';
import { useTranslation } from "react-i18next";

export default function ReportModal({ openModal, closeModal, payload }) {
    const { t } = useTranslation();
    const navigate = useNavigate();
    if (!openModal) return null;

    const SelectChoice = () => {
        closeModal();
        navigate('/reportchoices', { state: payload });
    }

    return (
        <div className='report_modal'>
            <img onClick={closeModal} src={Delete} alt="" />
            <p>{t('reportModal.confirmText')}</p>
            <button id="yes" onClick={SelectChoice}>{t('common.confirm')}</button>
        </div>
    )
}





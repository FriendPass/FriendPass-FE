import React from 'react'
import { useTranslation } from 'react-i18next'

const GEO_OPTS = {
  enableHighAccuracy: true, // GPS 우선
  timeout: 15000,           // 15초 제한
  maximumAge: 0             // 캐시값 말고 최신값
};

const Agree = ({ onAgree }) => {
  const { t } = useTranslation()

  /** 에러별 안내 + 1회 재시도 */
  const handleGeoError = (error) => {
    console.error("위치 정보 접근 거부 또는 오류:", error);

    switch (error.code) {
      case error.PERMISSION_DENIED:
        alert(t("agree.errors.permissionDenied"));
        return;
      case error.POSITION_UNAVAILABLE:
        alert(t("agree.errors.unavailable"));
        break;
      case error.TIMEOUT:
        alert(t("agree.errors.timeout"));
        break;
      default:
        alert(t("agree.errors.unknown"));
    }

    // 신호가 약한 케이스를 위해 watchPosition으로 1회 더 시도
    try {
      const id = navigator.geolocation.watchPosition(
        (pos) => {
          navigator.geolocation.clearWatch(id);
          alert(t("agree.success"));
          onAgree?.(pos);
        },
        // 재시도 실패는 조용히 로그만
        (err) => console.warn("watchPosition fail:", err),
        { enableHighAccuracy: true, maximumAge: 60000, timeout: 20000 }
      );
    } catch (_) { }
  };

  // 위치 권한 요청 함수 (return 아래는 변경 X)
  const handleAllowLocation = async () => {
    if (!navigator.geolocation) {
      alert(t("agree.errors.notSupported"))
      return;
    }

    // (가능한 브라우저에서) 권한 상태 미리 확인
    try {
      if (navigator.permissions?.query) {
        const st = await navigator.permissions.query({ name: 'geolocation' });
        if (st.state === 'denied') {
          alert(t("agree.errors.permissionDenied"));
          return;
        }
      }
    } catch (_) { /* 일부 브라우저 미지원 */ }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log("위치 정보 허용됨 ✅", position.coords);
        alert(t("agree.success"));
        onAgree?.(position);
      },
      handleGeoError,
      GEO_OPTS
    );
  };

  return (
    <div className="agree-wrap">
      <div className="agree-box1">
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <mask id="mask0_88_267" maskUnits="userSpaceOnUse" x="0" y="0" width="32" height="32">
            <rect width="32" height="32" fill="#D9D9D9" />
          </mask>
          <g mask="url(#mask0_88_267)">
            <path d="M16.0019 15.7778C16.6746 15.7778 17.2499 15.5382 17.7277 15.0592C18.2055 14.5801 18.4444 14.0041 18.4444 13.3314C18.4444 12.6586 18.2048 12.0834 17.7257 11.6056C17.2466 11.1278 16.6707 10.8889 15.998 10.8889C15.3252 10.8889 14.7499 11.1285 14.2722 11.6076C13.7944 12.0866 13.5555 12.6626 13.5555 13.3353C13.5555 14.0081 13.795 14.5833 14.2741 15.0611C14.7532 15.5389 15.3291 15.7778 16.0019 15.7778ZM15.9999 26.4001C18.874 23.7778 20.9999 21.3982 22.3777 19.2612C23.7555 17.1241 24.4444 15.2371 24.4444 13.6C24.4444 11.0476 23.6293 8.95761 21.999 7.33012C20.3688 5.70263 18.3691 4.88889 15.9999 4.88889C13.6308 4.88889 11.6311 5.70263 10.0008 7.33012C8.37057 8.95761 7.55545 11.0476 7.55545 13.6C7.55545 15.2371 8.25545 17.1241 9.65545 19.2612C11.0555 21.3982 13.1703 23.7778 15.9999 26.4001ZM15.9999 29.3334C12.4221 26.2889 9.74992 23.4611 7.98325 20.85C6.21659 18.2389 5.33325 15.8222 5.33325 13.6C5.33325 10.2667 6.40547 7.61113 8.54992 5.63335C10.6944 3.65558 13.1777 2.66669 15.9999 2.66669C18.8221 2.66669 21.3055 3.65558 23.4499 5.63335C25.5944 7.61113 26.6666 10.2667 26.6666 13.6C26.6666 15.8222 25.7833 18.2389 24.0166 20.85C22.2499 23.4611 19.5777 26.2889 15.9999 29.3334Z" fill="#1C1B1F" />
          </g>
        </svg>
        <p className='agree-p1'>{t("agree.title")}</p>
      </div>
      <div className="agree-box2">
        <p className='agree-p2'>{t("agree.description1")}<br />
          {t("agree.description2")}</p>
        <p className='agree-p2'>
          {t("agree.description3")}<br />
          {t("agree.description4")}
        </p>
      </div>
      <div className="agree-box3" onClick={handleAllowLocation}>
        <p className='agree-p3'>{t("agree.confirm")}</p>
      </div>
    </div>
  )
}

export default Agree

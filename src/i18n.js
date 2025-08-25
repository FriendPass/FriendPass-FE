// src/i18n.js
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// 언어 리소스 불러오기
import ko from "./locales/ko.json";
import en from "./locales/en.json";

// localStorage에 저장된 언어 불러오기 (없으면 'ko')
const savedLang = localStorage.getItem("language") || "ko";

i18n.use(initReactI18next).init({
  resources: {
    ko: { translation: ko },
    en: { translation: en },
  },
  lng: savedLang, // 기본 언어
  fallbackLng: "ko",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;

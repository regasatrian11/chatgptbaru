import { useState, useEffect } from 'react';
import { i18n } from '../utils/i18n';

export function useTranslation() {
  const [, forceUpdate] = useState({});

  useEffect(() => {
    const handleLanguageChange = () => {
      forceUpdate({});
    };

    i18n.addListener(handleLanguageChange);

    return () => {
      i18n.removeListener(handleLanguageChange);
    };
  }, []);

  return {
    t: (key: string) => i18n.t(key),
    currentLanguage: i18n.getCurrentLanguage(),
    setLanguage: (language: string) => i18n.setLanguage(language)
  };
}
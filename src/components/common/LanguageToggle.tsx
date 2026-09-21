import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

export const LanguageToggle: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();

  return (
    <button
      onClick={() => setLanguage(language === 'EN' ? 'TA' : 'EN')}
      className="px-2.5 py-1.5 rounded-lg border border-navy-700 bg-navy-900 text-slate-200 hover:bg-navy-700 text-xs font-bold transition-colors"
      title={t('navSwitchLanguageTitle')}
    >
      {language === 'EN' ? 'தமிழ்' : 'English'}
    </button>
  );
};

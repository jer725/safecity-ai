import { translations } from '../../data/translations';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEmergency } from '../../context/EmergencyContext';
import { useLanguage } from '../../context/LanguageContext';
import { 
  ShieldAlert, 
  Volume2, 
  VolumeX, 
  Clock, 
  Radio, 
  Users, 
  Car, 
  Building2, 
  ChevronRight,
  Activity,
  Sparkles
} from 'lucide-react';
import { Role } from '../../types';

export const Navbar: React.FC = () => {
  const { 
    activeRole, 
    soundMuted, 
    toggleSound, 
    emergencyRequests,
    activeTrafficAlert
  } = useEmergency();
  const { t: translate } = useLanguage();

const isProtectedPage = activeRole === 'POLICE' || activeRole === 'GOVERNMENT';

const t = (key: keyof typeof translations['EN']): string => {
  if (isProtectedPage) {
    return translations['EN'][key] || key;
  }
  return translate(key);
};

  const navigate = useNavigate();

  const [timeStr, setTimeStr] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString('en-US', { hour12: false }));
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const activeEmergenciesCount = emergencyRequests.filter(
    e => e.status === 'DISPATCHED' || e.status === 'EN_ROUTE'
  ).length;

  const getRoleBadge = (role: Role) => {
    switch (role) {
      case 'PUBLIC':
        return { label: t('roleBadgePublicView'), color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' };
      case 'POLICE':
        return { label: t('roleBadgePoliceTerminal'), color: 'bg-amber-500/20 text-amber-400 border-amber-500/40' };
      case 'GOVERNMENT':
        return { label: t('roleBadgeGovCenter'), color: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40' };
      default:
        return { label: t('roleBadgePortalOverview'), color: 'bg-slate-700/50 text-slate-300 border-slate-600' };
    }
  };

  const badge = getRoleBadge(activeRole);

  return (
    <header className="sticky top-0 z-50 bg-[#11162b]/95 backdrop-blur-md border-b border-navy-700 shadow-md">
      {/* Top Banner Alert if active checkpoint alarm exists */}
      {activeTrafficAlert && (
        <div className="bg-red-600/90 text-white px-4 py-1.5 text-xs font-semibold flex items-center justify-between animate-pulse">
          <div className="flex items-center gap-2 max-w-7xl mx-auto w-full">
            <ShieldAlert className="w-4 h-4 text-yellow-300" />
            <span>
              🚨 {t('navPriorityAlertPrefix')} <span className="underline font-bold">{activeTrafficAlert.name}</span> {t('navPriorityAlertSuffix')}
            </span>
            <button
              onClick={() => navigate('/police')}
              className="ml-auto bg-white text-red-700 px-2 py-0.5 rounded text-xs font-bold hover:bg-slate-100 flex items-center gap-1 shadow"
            >
              {t('navSwitchToTrafficView')} <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & System Brand */}
          <div 
            onClick={() => navigate('/')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="relative">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-600 via-red-500 to-cyan-500 p-0.5 shadow-glow-red group-hover:scale-105 transition-transform">
                <div className="w-full h-full bg-[#11162b] rounded-[7px] flex items-center justify-center">
                  <ShieldAlert className="w-5 h-5 text-red-500 group-hover:text-cyan-400 transition-colors" />
                </div>
              </div>
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-white group-hover:text-cyan-300 transition-colors">
                  SafeCity <span className="text-cyan-400">AI</span>
                </span>
                <span className="hidden sm:inline-block text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30">
                  {t('navLiveDispatchBadge')}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden md:block font-medium">
                {t('heroSubtitle')}
              </p>
            </div>
          </div>

          {/* Center Role Navigation Switcher */}
          <nav className="hidden lg:flex items-center gap-1 bg-navy-900/80 p-1 rounded-lg border border-navy-700">
            <button
              onClick={() => navigate('/')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                activeRole === 'HOME'
                  ? 'bg-cyan-500 text-black font-semibold shadow-glow-cyan'
                  : 'text-slate-300 hover:text-white hover:bg-navy-700'
              }`}
            >
              {t('home')}
            </button>
            <button
              onClick={() => navigate('/public')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                activeRole === 'PUBLIC'
                  ? 'bg-red-500 text-white font-semibold shadow-glow-red'
                  : 'text-slate-300 hover:text-white hover:bg-navy-700'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              {t('publicCardTitle')}
            </button>
            <button
              onClick={() => navigate('/police')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                activeRole === 'POLICE'
                  ? 'bg-amber-500 text-black font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-navy-700'
              }`}
            >
              <Car className="w-3.5 h-3.5" />
              {t('trafficPolice')}
              {activeTrafficAlert && (
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
              )}
            </button>
            <button
              onClick={() => navigate('/government')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                activeRole === 'GOVERNMENT'
                  ? 'bg-cyan-500 text-black font-semibold shadow-glow-cyan'
                  : 'text-slate-300 hover:text-white hover:bg-navy-700'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              {t('govCardTitle')}
            </button>
          </nav>

          {/* Right Status Badges & Controls */}
          <div className="flex items-center gap-3">
            {/* Active Role Indicator */}
            <div className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs border ${badge.color}`}>
              <Radio className="w-3 h-3 animate-pulse" />
              <span className="font-semibold">{badge.label}</span>
            </div>

            {/* Active Emergencies Counter */}
            <div 
              onClick={() => navigate('/government')}
              className="flex items-center gap-1.5 bg-red-950/60 border border-red-500/40 text-red-300 px-2.5 py-1 rounded-md text-xs font-mono font-bold cursor-pointer hover:bg-red-900/50 transition-colors"
              title={t('navActiveEmergenciesTitle')}
            >
              <Activity className="w-3.5 h-3.5 text-red-400 animate-pulse" />
              <span>{activeEmergenciesCount} {t('navActiveLabel')}</span>
            </div>

            {/* System Clock */}
            <div className="hidden sm:flex items-center gap-1.5 text-slate-300 font-mono text-xs bg-navy-900 px-2.5 py-1 rounded-md border border-navy-700">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span>{timeStr || '19:45:00'}</span>
            </div>

            {/* Sound Toggle */}
            <button
              onClick={toggleSound}
              className={`p-2 rounded-lg border transition-colors ${
                soundMuted
                  ? 'bg-navy-900 border-slate-700 text-slate-500 hover:text-slate-300'
                  : 'bg-cyan-500/10 border-cyan-500/40 text-cyan-400 hover:bg-cyan-500/20'
              }`}
              title={soundMuted ? t('navUnmuteTitle') : t('navMuteTitle')}
            >
              {soundMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            {/* Language toggle intentionally removed from here — 
                it now appears only on the Home and General Public pages. */}
          </div>
        </div>
      </div>
    </header>
  );
};

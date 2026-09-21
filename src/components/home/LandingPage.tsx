import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useEmergency } from '../../context/EmergencyContext';
import { useLanguage } from '../../context/LanguageContext';
import { 
  ShieldAlert, 
  Users, 
  Car, 
  Building2, 
  ArrowRight, 
  Activity, 
  Radio, 
  Zap, 
  Eye, 
  MapPin, 
  Clock, 
  HeartHandshake
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { emergencyRequests, vehicles, cctvCameras, aiIncidents } = useEmergency();
  const { t } = useLanguage();

  const activeEmergencies = emergencyRequests.filter(
  e => e.status === 'DISPATCHED' || e.status === 'EN_ROUTE'
).length;
  const activeVehicles = vehicles.filter(v => v.status === 'Emergency Response').length;
  const camerasOnline = cctvCameras.filter(c => c.status === 'ONLINE').length;

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-between py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      
      {/* Hero Header Section */}
      <section className="text-center space-y-4 pt-4 sm:pt-8 animate-fade-in">
        
        {/* Live Network Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold tracking-wide">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
          <span>{t('heroPill')}</span>
        </div>

        {/* Main Title & Subtitle */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
          SafeCity <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-pink-500 to-cyan-400">AI</span>
        </h1>
        
        <p className="text-xl sm:text-2xl font-semibold text-slate-200 tracking-wide">
          {t('heroSubtitle')}
        </p>

        <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-400 font-normal italic">
          {t('heroQuote')}
        </p>
      </section>

      {/* 3 Main Persona Cards Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
        
        {/* Role Card 1: General Public */}
        <div
          onClick={() => navigate('/public')}
          className="group relative bg-[#151b34] hover:bg-[#1a2242] border border-red-500/30 hover:border-red-500 rounded-lg p-6 sm:p-8 shadow-card hover:shadow-glow-red transition-all duration-300 cursor-pointer flex flex-col justify-between"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-14 h-14 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 group-hover:scale-110 group-hover:bg-red-500 group-hover:text-white transition-all duration-300">
                <Users className="w-7 h-7" />
              </div>
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-red-400 bg-red-500/10 px-2.5 py-1 rounded border border-red-500/20">
                {t('publicCardBadge')}
              </span>
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-white group-hover:text-red-300 transition-colors">
                {t('publicCardTitle')}
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                {t('publicCardDesc')}
              </p>
            </div>

            <div className="pt-2 space-y-2 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-red-400" />
                <span>{t('publicCardFeature1')}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-cyan-400" />
                <span>{t('publicCardFeature2')}</span>
              </div>
              <div className="flex items-center gap-2">
                <HeartHandshake className="w-4 h-4 text-emerald-400" />
                <span>{t('publicCardFeature3')}</span>
              </div>
            </div>
          </div>

          <div className="pt-6 mt-4 border-t border-navy-700 flex items-center justify-between text-red-400 font-bold text-sm group-hover:translate-x-1 transition-transform">
            <span>{t('publicCardCta')}</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>

        {/* Role Card 2: Traffic Police */}
        <div
          onClick={() => navigate('/police')}
          className="group relative bg-[#151b34] hover:bg-[#1a2242] border border-amber-500/30 hover:border-amber-500 rounded-lg p-6 sm:p-8 shadow-card hover:shadow-glow-cyan transition-all duration-300 cursor-pointer flex flex-col justify-between"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-14 h-14 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-110 group-hover:bg-amber-500 group-hover:text-black transition-all duration-300">
                <Car className="w-7 h-7" />
              </div>
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded border border-amber-500/20">
                {t('policeCardBadge')}
              </span>
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-white group-hover:text-amber-300 transition-colors">
                {t('policeCardTitle')}
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                {t('policeCardDesc')}
              </p>
            </div>

            <div className="pt-2 space-y-2 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-amber-400" />
                <span>{t('policeCardFeature1')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-emerald-400" />
                <span>{t('policeCardFeature2')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-400" />
                <span>{t('policeCardFeature3')}</span>
              </div>
            </div>
          </div>

          <div className="pt-6 mt-4 border-t border-navy-700 flex items-center justify-between text-amber-400 font-bold text-sm group-hover:translate-x-1 transition-transform">
            <span>{t('policeCardCta')}</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>

        {/* Role Card 3: Government Control */}
        <div
          onClick={() => navigate('/government')}
          className="group relative bg-[#151b34] hover:bg-[#1a2242] border border-cyan-500/30 hover:border-cyan-500 rounded-lg p-6 sm:p-8 shadow-card hover:shadow-glow-cyan transition-all duration-300 cursor-pointer flex flex-col justify-between"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-14 h-14 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 group-hover:bg-cyan-500 group-hover:text-black transition-all duration-300">
                <Building2 className="w-7 h-7" />
              </div>
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded border border-cyan-500/20">
                {t('govCardBadge')}
              </span>
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                {t('govCardTitle')}
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                {t('govCardDesc')}
              </p>
            </div>

            <div className="pt-2 space-y-2 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-400" />
                <span>{t('govCardFeature1')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-purple-400" />
                <span>{t('govCardFeature2')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-emerald-400" />
                <span>{t('govCardFeature3')}</span>
              </div>
            </div>
          </div>

          <div className="pt-6 mt-4 border-t border-navy-700 flex items-center justify-between text-cyan-400 font-bold text-sm group-hover:translate-x-1 transition-transform">
            <span>{t('govCardCta')}</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </section>

      {/* Live Operational Metrics Ribbon */}
      <section className="bg-navy-900/80 border border-navy-700 rounded-lg p-4 sm:p-6 shadow-card">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="border-r border-navy-700/60 last:border-none">
            <div className="text-2xl sm:text-3xl font-extrabold text-cyan-400 font-mono">
              {t('metricFleetValue')}
            </div>
            <div className="text-xs text-slate-400 mt-1 uppercase font-semibold">
              {t('metricFleet')}
            </div>
          </div>
          <div className="border-r border-navy-700/60 last:border-none">
            <div className="text-2xl sm:text-3xl font-extrabold text-red-400 font-mono flex items-center justify-center gap-1">
              <span>{activeEmergencies.toString().padStart(2, '0')}</span>
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
            </div>
            <div className="text-xs text-slate-400 mt-1 uppercase font-semibold">
              {t('metricActiveCases')}
            </div>
          </div>
          <div className="border-r border-navy-700/60 last:border-none">
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono">
                            {camerasOnline}/8 {t('metricFeeds')}
            </div>
            <div className="text-xs text-slate-400 mt-1 uppercase font-semibold">
              {t('metricCctv')}
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-purple-400 font-mono">
              {aiIncidents.length}
            </div>
            <div className="text-xs text-slate-400 mt-1 uppercase font-semibold">
              {t('metricAiIncidents')}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
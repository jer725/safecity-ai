import React from 'react';
import { useEmergency } from '../../context/EmergencyContext';
import { useLanguage } from '../../context/LanguageContext';
import { 
  Radio, 
  MapPin, 
  Clock, 
  Navigation, 
  ShieldCheck, 
  PhoneCall, 
  FastForward, 
  RotateCcw, 
  CheckCircle2, 
  ArrowLeft,
  Activity,
  AlertTriangle
} from 'lucide-react';
import { CityMap } from '../map/CityMap';
import { FirstAidPanel } from './FirstAidPanel';
import { INITIAL_VEHICLES } from '../../data/mockData';

interface PublicTrackingViewProps {
  onBackToSOS: () => void;
}

export const PublicTrackingView: React.FC<PublicTrackingViewProps> = ({ onBackToSOS }) => {
  const { currentEmergency, fastForwardEmergency, resolveEmergency, checkpoints } = useEmergency();
  const { t, language } = useLanguage();

  const assignedVehicle = INITIAL_VEHICLES.find(
    (v) => v.id === currentEmergency?.assignedVehicleId
  );

  if (!currentEmergency) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16 space-y-4">
        <div className="w-16 h-16 rounded-full bg-navy-800 text-slate-400 mx-auto flex items-center justify-center text-2xl">
          🚑
        </div>
        <h3 className="text-xl font-bold text-white">{t('trackNoActiveTitle')}</h3>
        <p className="text-sm text-slate-400">
          {t('trackNoActiveDesc')}
        </p>
        <button
          onClick={onBackToSOS}
          className="bg-red-600 hover:bg-red-500 text-white font-bold px-6 py-2.5 rounded-lg text-sm transition-colors inline-flex items-center gap-2"
        >
          <Radio className="w-4 h-4" />
          <span>{t('trackGoToSos')}</span>
        </button>
      </div>
    );
  }

  const isArrived = currentEmergency.status === 'ARRIVED';
  const isResolved = currentEmergency.status === 'RESOLVED';

  const destinationName = language === 'TA' && currentEmergency.location.nameTA
    ? currentEmergency.location.nameTA
    : currentEmergency.location.name;

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in py-2">
      
      {/* Top Navigation & Status Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-navy-700 pb-3">
        <button
          onClick={onBackToSOS}
          className="text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t('trackBackToSos')}</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-400">{t('trackRequestId')}</span>
          <span className="text-xs font-mono font-bold text-white bg-navy-900 border border-navy-700 px-2 py-0.5 rounded">
            {currentEmergency.id}
          </span>
          <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
            isResolved
              ? 'bg-slate-700 text-slate-300 border-slate-600'
              : isArrived
              ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
              : currentEmergency.status === 'DISPATCHED'
              ? 'bg-red-500/20 text-red-400 border-red-500/40 animate-pulse'
              : 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40 animate-pulse'
          }`}>
            {isResolved ? t('trackStatusResolved') : isArrived ? t('trackStatusArrived') : currentEmergency.status === 'DISPATCHED' ? t('trackStatusDispatched') : t('trackStatusEnRoute')}
          </span>
        </div>
      </div>

      {/* Main Grid: Left Map + Live Status Card, Right First-Aid Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Columns: Interactive Map & Telemetry Dashboard */}
        <div className={`space-y-4 ${currentEmergency.assignedVehicleType !== 'Police' ? 'lg:col-span-7' : 'lg:col-span-12'}`}>
          
          {/* Live Status Card */}
          <div className="bg-[#151b34] border border-navy-700 rounded-xl p-5 shadow-card space-y-4">
            
            {/* Header / Vehicle Title */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-navy-700 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-red-600/20 border border-red-500/40 flex items-center justify-center text-2xl">
                  {currentEmergency.assignedVehicleType === 'Ambulance' ? '🚑' : currentEmergency.assignedVehicleType === 'Police' ? '🚔' : '🚒'}
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
                    <span>{currentEmergency.assignedVehicleType.toUpperCase()} {t('trackEnRouteLabel')}</span>
                  </div>
                  <h3 className="text-xl font-black text-white font-mono">
                    {currentEmergency.assignedVehicleId} – {currentEmergency.assignedVehicleType}
                  </h3>
                </div>
              </div>

              {/* Ambulance Driver Contact — dynamic per assigned vehicle */}
              <button
  onClick={() => alert(`Driver: ${assignedVehicle?.driverName ?? 'N/A'}\nContact: ${assignedVehicle?.contactNumber ?? 'N/A'}`)}
  className="bg-navy-900 hover:bg-navy-800 border border-navy-600 text-slate-200 hover:text-white px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
>
  <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
  <span>{t('trackCallDriver')} {assignedVehicle?.driverName?.split(' ')[0] ?? t('trackDriverFallback')}</span>
</button>
            </div>

            {/* Key Live Telemetry Metrics */}
            <div className="grid grid-cols-3 gap-3 text-center">
              
              {/* ETA Metric */}
              <div className="bg-navy-900/90 border border-navy-700 rounded-lg p-3">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-center gap-1">
                  <Clock className="w-3 h-3 text-cyan-400" />
                  <span>{t('trackEta')}</span>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-cyan-300 font-mono mt-1">
                  {isArrived ? (
                    <span className="text-emerald-400 text-xl sm:text-2xl">{t('trackArrivedLabel')}</span>
                  ) : (
                    `${currentEmergency.etaMinutes} min`
                  )}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  {isArrived ? t('trackOnScene') : t('trackRealtimeCountdown')}
                </div>
              </div>

              {/* Distance Remaining */}
              <div className="bg-navy-900/90 border border-navy-700 rounded-lg p-3">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-center gap-1">
                  <Navigation className="w-3 h-3 text-red-400" />
                  <span>{t('trackDistance')}</span>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-white font-mono mt-1">
                  {currentEmergency.distanceKm} km
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  {t('trackViaGreenCorridor')}
                </div>
              </div>

              {/* Incident Location */}
              <div className="bg-navy-900/90 border border-navy-700 rounded-lg p-3">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-center gap-1">
                  <MapPin className="w-3 h-3 text-emerald-400" />
                  <span>{t('trackDestination')}</span>
                </div>
                <div className="text-sm sm:text-base font-bold text-slate-100 font-mono mt-1 truncate">
                  {destinationName}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  {t('trackMetroGrid')}
                </div>
              </div>

            </div>

            {/* Route Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-slate-300 font-medium">
                <span>{t('trackRouteProgress')}</span>
                <span className="font-mono text-cyan-400 font-bold">{currentEmergency.routeProgress}%</span>
              </div>
              <div className="w-full bg-navy-900 rounded-full h-2.5 overflow-hidden border border-navy-700">
                <div
                  className="bg-gradient-to-r from-red-500 via-yellow-400 to-cyan-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${currentEmergency.routeProgress}%` }}
                ></div>
              </div>
            </div>

          </div>

          {/* Interactive Live Map */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
              <span className="flex items-center gap-1.5">
                <Navigation className="w-4 h-4 text-cyan-400" />
                <span>{t('trackLiveGps')}</span>
              </span>
              <span className="text-[11px] text-slate-400">
                {t('trackUpdatesEvery')}
              </span>
            </div>
            
            <CityMap
              emergency={currentEmergency}
              checkpoints={checkpoints}
              heightClass="h-[360px]"
            />
          </div>

        </div>

        {/* Right 5 Columns: Parallel First-Aid Guide (Non-Blocking) - hidden for Police */}
        {currentEmergency.assignedVehicleType !== 'Police' && (
          <div className="lg:col-span-5 space-y-4">
            <FirstAidPanel />
          </div>
        )}

      </div>

    </div>
  );
};
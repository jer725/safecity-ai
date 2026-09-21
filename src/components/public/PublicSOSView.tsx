import React, { useState } from 'react';
import { useEmergency } from '../../context/EmergencyContext';
import { useLanguage } from '../../context/LanguageContext';
import { 
  ShieldAlert, 
  MapPin, 
  Radio, 
  CheckCircle, 
  ChevronRight, 
  Zap, 
  Flame, 
  Ambulance, 
  Truck,
  LocateFixed
} from 'lucide-react';
import { ServiceType } from '../../types';
import { CITY_LANDMARKS } from '../../data/mockData';
import { EmergencyConfirmationModal } from './EmergencyConfirmationModal';

interface PublicSOSViewProps {
  onNavigateToTracking: () => void;
}

export const PublicSOSView: React.FC<PublicSOSViewProps> = ({ onNavigateToTracking }) => {
  const { dispatchEmergency, currentEmergency } = useEmergency();
  const { t, language } = useLanguage();

  const [selectedLandmark, setSelectedLandmark] = useState<string>('Main Road');
  const [selectedService, setSelectedService] = useState<ServiceType | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [sosRevealed, setSosRevealed] = useState<boolean>(false);

  const handleSelectService = (service: ServiceType) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  const handleConfirmDispatch = () => {
    if (!selectedService) return;
    setIsModalOpen(false);
    
    // Step 3: Instant Dispatch in < 3s, ID EMG[4-digit], auto-assign vehicle
    const emgId = dispatchEmergency(selectedService, selectedLandmark, `${selectedService} Emergency Call`);
    
    // Transition to live tracking screen
    onNavigateToTracking();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in py-4">
      
      {/* If an emergency is already active, show quick jump banner */}
      {currentEmergency && currentEmergency.status !== 'RESOLVED' && (
        <div className="bg-gradient-to-r from-red-950/70 via-navy-900 to-navy-900 border border-red-500/50 rounded-lg p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-glow-red">
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-red-500 animate-ping"></span>
            <div>
              <div className="font-bold text-white text-sm">
                {t('sosBannerActive')} ({currentEmergency.id})
              </div>
              <div className="text-xs text-slate-300">
                {currentEmergency.assignedVehicleType} {currentEmergency.assignedVehicleId} {t('sosBannerEnRoute')} {currentEmergency.location.name}. {t('sosBannerEta')} {currentEmergency.etaMinutes} {t('sosBannerMin')}
              </div>
            </div>
          </div>
          <button
            onClick={onNavigateToTracking}
            className="w-full sm:w-auto bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-1 shrink-0"
          >
            <span>{t('sosBannerViewTracking')}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Hero SOS Trigger Section */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold">
          <Radio className="w-3.5 h-3.5 animate-pulse" />
          <span>{t('sosConsolePill')}</span>
        </div>

        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          {t('sosHeroTitle')}
        </h2>
        
        <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto">
          {t('sosHeroDesc')}
        </p>
      </div>

      {/* Citizen Location Selector */}
      <div className="bg-[#151b34] border border-navy-700 rounded-lg p-4 shadow-card max-w-xl mx-auto">
        <div className="flex items-center justify-between gap-2 mb-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-cyan-400" />
            <span>{t('sosLocationLabel')}</span>
          </label>
          <span className="text-[11px] text-cyan-400 font-mono flex items-center gap-1">
            <LocateFixed className="w-3 h-3" /> {t('sosGpsLocked')}
          </span>
        </div>
        <select
          value={selectedLandmark}
          onChange={(e) => setSelectedLandmark(e.target.value)}
          className="w-full bg-navy-900 border border-navy-600 rounded-lg px-3.5 py-2.5 text-sm text-white font-medium focus:outline-none focus:border-cyan-400 transition-colors"
        >
          {Object.keys(CITY_LANDMARKS).map((name) => {
            const landmark = CITY_LANDMARKS[name];
            const displayName = language === 'TA' && landmark.nameTA ? landmark.nameTA : landmark.name;
            const displayAddress = language === 'TA' && landmark.addressTA ? landmark.addressTA : landmark.address;
            return (
              <option key={name} value={name}>
                {displayName} – {displayAddress}
              </option>
            );
          })}
        </select>
      </div>

      {/* Main SOS Trigger Button */}
      <div className="flex flex-col items-center justify-center py-4">
        <button
          onClick={() => setSosRevealed(true)}
          className={`relative group w-48 h-48 sm:w-56 sm:h-56 rounded-full bg-gradient-to-br from-red-600 via-red-500 to-red-700 border-4 border-white/20 shadow-2xl flex flex-col items-center justify-center text-white transition-all transform hover:scale-105 active:scale-95 ${
            !sosRevealed ? 'animate-beacon shadow-glow-red' : 'shadow-glow-red'
          }`}
          style={{ minWidth: '44px', minHeight: '44px' }}
        >
          <div className="absolute inset-0 rounded-full border border-red-300 opacity-20 group-hover:scale-110 transition-transform"></div>
          <ShieldAlert className="w-16 h-16 sm:w-20 sm:h-20 mb-2 drop-shadow-md group-hover:scale-110 transition-transform" />
          <span className="text-2xl sm:text-3xl font-black tracking-wider drop-shadow-md">
            🚨 SOS
          </span>
          <span className="text-xs font-bold tracking-widest uppercase mt-1 text-red-100">
            {t('sosEmergencyLabel')}
          </span>
        </button>

        <p className="mt-4 text-xs sm:text-sm text-slate-400 font-medium text-center">
          {t('sosHelperText')}
        </p>
      </div>

      {/* Step 1 – 4 Emergency Service Selection Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between border-b border-navy-700 pb-2">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">
            {t('sosSelectServiceTitle')}
          </h3>
          <span className="text-xs text-slate-400">{t('sosStepOfTwo')}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Service 1: Ambulance */}
          <div
            onClick={() => handleSelectService('Ambulance')}
            className="group bg-[#151b34] hover:bg-[#1f284d] border-2 border-red-500/40 hover:border-red-500 rounded-lg p-5 shadow-card hover:shadow-glow-red transition-all cursor-pointer flex flex-col justify-between"
            style={{ minHeight: '140px' }}
          >
            <div className="flex items-start justify-between">
              <div className="text-4xl group-hover:scale-110 transition-transform">🚑</div>
              <span className="text-[10px] font-mono font-bold bg-red-500/20 text-red-300 px-2 py-0.5 rounded">
                {t('svcAmbulanceTag')}
              </span>
            </div>
            <div>
              <h4 className="text-lg font-bold text-white group-hover:text-red-300">
                {t('svcAmbulanceName')}
              </h4>
              <p className="text-xs text-slate-400 mt-1">
                {t('svcAmbulanceDesc')}
              </p>
            </div>
          </div>

          {/* Service 2: Police */}
          <div
            onClick={() => handleSelectService('Police')}
            className="group bg-[#151b34] hover:bg-[#1f284d] border-2 border-amber-500/40 hover:border-amber-500 rounded-lg p-5 shadow-card hover:shadow-glow-cyan transition-all cursor-pointer flex flex-col justify-between"
            style={{ minHeight: '140px' }}
          >
            <div className="flex items-start justify-between">
              <div className="text-4xl group-hover:scale-110 transition-transform">🚔</div>
              <span className="text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded">
                {t('svcPoliceTag')}
              </span>
            </div>
            <div>
              <h4 className="text-lg font-bold text-white group-hover:text-amber-300">
                {t('svcPoliceName')}
              </h4>
              <p className="text-xs text-slate-400 mt-1">
                {t('svcPoliceDesc')}
              </p>
            </div>
          </div>

          {/* Service 3: Fire Engine */}
          <div
            onClick={() => handleSelectService('Fire Engine')}
            className="group bg-[#151b34] hover:bg-[#1f284d] border-2 border-orange-500/40 hover:border-orange-500 rounded-lg p-5 shadow-card hover:shadow-glow-red transition-all cursor-pointer flex flex-col justify-between"
            style={{ minHeight: '140px' }}
          >
            <div className="flex items-start justify-between">
              <div className="text-4xl group-hover:scale-110 transition-transform">🚒</div>
              <span className="text-[10px] font-mono font-bold bg-orange-500/20 text-orange-300 px-2 py-0.5 rounded">
                {t('svcFireTag')}
              </span>
            </div>
            <div>
              <h4 className="text-lg font-bold text-white group-hover:text-orange-300">
                {t('svcFireName')}
              </h4>
              <p className="text-xs text-slate-400 mt-1">
                {t('svcFireDesc')}
              </p>
            </div>
          </div>

          {/* Service 4: Emergency Jeep / Rescue */}
          <div
            onClick={() => handleSelectService('Emergency Jeep')}
            className="group bg-[#151b34] hover:bg-[#1f284d] border-2 border-cyan-500/40 hover:border-cyan-500 rounded-lg p-5 shadow-card hover:shadow-glow-cyan transition-all cursor-pointer flex flex-col justify-between"
            style={{ minHeight: '140px' }}
          >
            <div className="flex items-start justify-between">
              <div className="text-4xl group-hover:scale-110 transition-transform">🚙</div>
              <span className="text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded">
                {t('svcJeepTag')}
              </span>
            </div>
            <div>
              <h4 className="text-lg font-bold text-white group-hover:text-cyan-300">
                {t('svcJeepName')}
              </h4>
              <p className="text-xs text-slate-400 mt-1">
                {t('svcJeepDesc')}
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* Confirmation Modal */}
      {selectedService && (
        <EmergencyConfirmationModal
          isOpen={isModalOpen}
          serviceType={selectedService}
          landmark={selectedLandmark}
          onConfirm={handleConfirmDispatch}
          onCancel={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};
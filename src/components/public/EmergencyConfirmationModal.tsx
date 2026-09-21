import React from 'react';
import { ShieldAlert, MapPin, AlertCircle, X, Check } from 'lucide-react';
import { ServiceType } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

interface EmergencyConfirmationModalProps {
  isOpen: boolean;
  serviceType: ServiceType;
  landmark: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const EmergencyConfirmationModal: React.FC<EmergencyConfirmationModalProps> = ({
  isOpen,
  serviceType,
  landmark,
  onConfirm,
  onCancel
}) => {
  const { t } = useLanguage();

  if (!isOpen) return null;

  const getServiceDetails = () => {
    switch (serviceType) {
      case 'Ambulance':
        return { icon: '🚑', name: t('svcAmbulanceName'), label: t('modalAmbulanceLabel'), color: 'text-red-400' };
      case 'Police':
        return { icon: '🚔', name: t('svcPoliceName'), label: t('modalPoliceLabel'), color: 'text-amber-400' };
      case 'Fire Engine':
        return { icon: '🚒', name: t('svcFireName'), label: t('modalFireLabel'), color: 'text-orange-400' };
      case 'Emergency Jeep':
        return { icon: '🚙', name: t('svcJeepName'), label: t('modalJeepLabel'), color: 'text-cyan-400' };
    }
  };

  const details = getServiceDetails();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-[#151b34] border-2 border-red-500 rounded-xl shadow-2xl max-w-lg w-full overflow-hidden">
        
        {/* Header Bar */}
        <div className="bg-red-600 px-6 py-4 flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-6 h-6 animate-pulse" />
            <h3 className="text-lg font-extrabold uppercase tracking-wide">
              {t('modalTitle')}
            </h3>
          </div>
          <button 
            onClick={onCancel}
            className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-red-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          <div className="text-center space-y-2">
            <div className="text-5xl my-2">{details.icon}</div>
            <div className="text-sm font-semibold uppercase tracking-wider text-slate-400">
              {t('modalYouSelected')}
            </div>
            <div className={`text-2xl font-extrabold ${details.color}`}>
              {details.name}
            </div>
            <p className="text-sm text-slate-300 font-medium">
              {details.label}
            </p>
          </div>

          {/* Location Verification Box */}
          <div className="bg-navy-900 border border-navy-700 rounded-lg p-4 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
              <MapPin className="w-4 h-4 text-cyan-400" />
              <span>{t('modalTargetLocation')}</span>
            </div>
            <div className="text-base font-bold text-white">
              {landmark}, {t('modalMetroCorridor')}
            </div>
            <p className="text-xs text-slate-400">
              {t('modalLocationQuestion')}
            </p>
          </div>

          {/* Prompt Critical Safeguard Notice */}
          <div className="flex items-start gap-2.5 bg-red-950/40 border border-red-500/30 rounded-lg p-3 text-xs text-red-200">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span>
              <strong>{t('modalImmediateDispatchLabel')}</strong> {t('modalImmediateDispatchDesc')}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <button
              onClick={onConfirm}
              className="w-full min-h-[48px] bg-red-600 hover:bg-red-500 active:bg-red-700 text-white font-extrabold px-6 py-3.5 rounded-lg shadow-glow-red flex items-center justify-center gap-2 transition-all transform active:scale-95 text-sm sm:text-base tracking-wide uppercase"
            >
              <Check className="w-5 h-5 stroke-[3]" />
              <span>{t('modalConfirm')}</span>
            </button>
            
            <button
              onClick={onCancel}
              className="w-full min-h-[48px] bg-navy-800 hover:bg-navy-700 text-slate-300 hover:text-white font-bold px-6 py-3.5 rounded-lg border border-navy-600 flex items-center justify-center transition-colors text-sm uppercase"
            >
              {t('modalCancel')}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

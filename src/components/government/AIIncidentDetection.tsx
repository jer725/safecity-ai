import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useEmergency } from '../../context/EmergencyContext';
import { 
  Sparkles, 
  ShieldAlert, 
  Flame, 
  Users, 
  Car, 
  Zap, 
  Clock, 
  MapPin, 
  Eye, 
  CheckCircle2, 
  AlertTriangle 
} from 'lucide-react';
import { AIIncident, SeverityLevel, EmergencyRequest } from '../../types';

export const AIIncidentDetection: React.FC = () => {
  const { aiIncidents, emergencyRequests, selectEmergencyForTracking, autoDispatchAIIncident, triggerMockAIIncident } = useEmergency();
  const navigate = useNavigate();

  const handleTrackEmergency = (emergency?: EmergencyRequest) => {
    if (emergency) {
      selectEmergencyForTracking(emergency);
      navigate('/public');
    }
  };

  const getSeverityBadge = (severity: SeverityLevel) => {
    switch (severity) {
      case 'CRITICAL':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-600/30 text-red-400 border border-red-500/50 animate-pulse">🔴 CRITICAL</span>;
      case 'HIGH':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/40">🔴 HIGH</span>;
      case 'MEDIUM':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-yellow-500/20 text-yellow-400 border border-yellow-500/40">🟠 MEDIUM</span>;
      case 'LOW':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-400 border border-blue-500/40">🔵 LOW</span>;
    }
  };

  const getIncidentIcon = (type: string) => {
    if (type.toLowerCase().includes('accident') || type.toLowerCase().includes('collision')) return '🚗';
    if (type.toLowerCase().includes('fire') || type.toLowerCase().includes('smoke')) return '🔥';
    if (type.toLowerCase().includes('crowd')) return '👥';
    if (type.toLowerCase().includes('blockage')) return '🚧';
    return '🚨';
  };

  return (
    <div className="bg-[#151b34] border border-navy-700 rounded-xl p-5 shadow-card space-y-4">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-navy-700 pb-3">
        <div>
          <h3 className="text-base font-extrabold uppercase tracking-wider text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            <span>AI Autonomous Incident Detection Feed</span>
          </h3>
          <p className="text-xs text-slate-400">
            Real-time inference stream from neural edge cameras and smart city sensors
          </p>
        </div>
      </div>

      {/* Detections List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {aiIncidents.map((inc) => {
          const isDispatched = inc.autoDispatched || inc.status === 'DISPATCHED';
          const matchedEmergency = emergencyRequests.find(e => e.id === inc.assignedVehicleId);
          const liveStatus = matchedEmergency?.status;
          const isResolved = liveStatus === 'RESOLVED';
          const matchedPoliceEmergency = emergencyRequests.find(e => e.id === inc.assignedPoliceEmergencyId);
          const policeLiveStatus = matchedPoliceEmergency?.status;
          const isPoliceResolved = policeLiveStatus === 'RESOLVED';

          return (
            <div
              key={inc.id}
              className={`bg-navy-900/90 border rounded-xl p-4 shadow-card space-y-3 transition-all ${
                inc.severity === 'CRITICAL' || inc.severity === 'HIGH'
                  ? 'border-red-500/40 hover:border-red-500'
                  : 'border-navy-700 hover:border-navy-600'
              }`}
            >
              {/* Top Row: Incident ID, Type, Severity */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">{getIncidentIcon(inc.type)}</span>
                  <div>
                    <h4 className="text-sm font-extrabold text-white font-mono flex items-center gap-1.5">
                      <span>{inc.id} – {inc.type}</span>
                    </h4>
                    <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3 text-cyan-400" />
                      <span>{inc.timestamp}</span>
                      <span>• Source: {inc.source}</span>
                    </div>
                  </div>
                </div>

                <div>
                  {getSeverityBadge(inc.severity)}
                </div>
              </div>

              {/* Middle Row: Location & Recommendation */}
              <div className="bg-navy-950/80 p-2.5 rounded-lg border border-navy-800 space-y-1 text-xs">
                <div className="flex items-center gap-1.5 text-slate-300">
                  <MapPin className="w-3.5 h-3.5 text-red-400 shrink-0" />
                  <span>Location: <strong className="text-white">{inc.location}</strong></span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-300">
                  <Zap className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>Recommended Response: <strong className="text-cyan-300">{inc.recommendedResponse}</strong></span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                  <span>Confidence: <strong className="text-emerald-400">{(inc.confidenceScore * 100).toFixed(0)}%</strong></span>
                  <span>Auto-Dispatched: <strong className={isDispatched ? 'text-emerald-400' : 'text-amber-400'}>{isDispatched ? 'YES' : 'NO'}</strong></span>
                </div>
              </div>

              {/* Bottom Action Row */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-[10px] text-slate-500 font-mono">
                  {inc.assignedVehicleId ? `Assigned: ${inc.assignedVehicleId}` : ''}
                </span>

                <div className="flex flex-col items-end gap-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-500 font-mono">🚑</span>
                    <span className={`text-xs font-bold flex items-center gap-1 px-2 py-1 rounded border ${
                      isResolved
                        ? 'text-slate-300 bg-slate-700/40 border-slate-600'
                        : liveStatus === 'ARRIVED'
                        ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
                        : 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30 animate-pulse'
                    }`}>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{liveStatus ? liveStatus.replace('_', ' ') : 'Auto-Dispatched'}</span>
                    </span>
                    {!isResolved && (
                      <button
                        onClick={() => handleTrackEmergency(matchedEmergency)}
                        className="bg-cyan-600/30 hover:bg-cyan-600/50 text-cyan-200 border border-cyan-500/40 px-2.5 py-1 rounded text-[11px] font-semibold transition-colors"
                      >
                        Track
                      </button>
                    )}
                  </div>
                  {matchedPoliceEmergency && (
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-500 font-mono">🚓</span>
                      <span className={`text-xs font-bold flex items-center gap-1 px-2 py-1 rounded border ${
                        isPoliceResolved
                          ? 'text-slate-300 bg-slate-700/40 border-slate-600'
                          : policeLiveStatus === 'ARRIVED'
                          ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
                          : 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30 animate-pulse'
                      }`}>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{policeLiveStatus ? policeLiveStatus.replace('_', ' ') : 'Auto-Dispatched'}</span>
                      </span>
                      {!isPoliceResolved && (
                        <button
                          onClick={() => handleTrackEmergency(matchedPoliceEmergency)}
                          className="bg-cyan-600/30 hover:bg-cyan-600/50 text-cyan-200 border border-cyan-500/40 px-2.5 py-1 rounded text-[11px] font-semibold transition-colors"
                        >
                          Track
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};

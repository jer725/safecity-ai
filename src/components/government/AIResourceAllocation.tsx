import React, { useState } from 'react';
import { useEmergency } from '../../context/EmergencyContext';
import { 
  Zap, 
  MapPin, 
  Clock, 
  Navigation, 
  CheckCircle2, 
  ShieldAlert, 
  Sparkles,
  Sliders
} from 'lucide-react';
import { CITY_LANDMARKS } from '../../data/mockData';

export const AIResourceAllocation: React.FC = () => {
  const { vehicles, dispatchEmergency, setActiveRole } = useEmergency();

  const [selectedTargetLocation, setSelectedTargetLocation] = useState<string>('Main Road');

  const targetLoc = CITY_LANDMARKS[selectedTargetLocation] || CITY_LANDMARKS['Main Road'];

  // Calculate distance matrix and recommendations dynamically
  const calculateRecommendation = (type: 'Ambulance' | 'Police' | 'Fire Engine') => {
    const matchingVehicles = vehicles.filter(v => v.type === type);
    
    // Sort by distance to targetLoc
    const scored = matchingVehicles.map(v => {
      const dx = targetLoc.x - v.coords.x;
      const dy = targetLoc.y - v.coords.y;
      const distPx = Math.sqrt(dx * dx + dy * dy);
      const distKm = parseFloat(((distPx / 100) * 1.4).toFixed(1)) || 3.2;
      const etaMin = Math.max(3, Math.round((distKm / (v.speedKmh || 45)) * 60));
      
      const isAvailable = v.status === 'Available';
      const score = (100 - distKm * 5) + (isAvailable ? 40 : 10);

      return {
        vehicle: v,
        distKm,
        etaMin,
        score
      };
    });

    scored.sort((a, b) => b.score - a.score);
    return scored[0];
  };

  const recAmb = calculateRecommendation('Ambulance');
  const recPol = calculateRecommendation('Police');
  const recFir = calculateRecommendation('Fire Engine');

  const handleInstantDeploy = (type: 'Ambulance' | 'Police' | 'Fire Engine') => {
    dispatchEmergency(type, selectedTargetLocation, `AI Optimal Dispatch (${type})`);
    setActiveRole('PUBLIC');
  };

  return (
    <div className="bg-[#151b34] border border-navy-700 rounded-xl p-5 shadow-card space-y-5">
      
      {/* Header & Location Selector */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-navy-700 pb-3">
        <div>
          <h3 className="text-base font-extrabold uppercase tracking-wider text-white flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-400" />
            <span>AI Multi-Resource Allocation Engine</span>
          </h3>
          <p className="text-xs text-slate-400">
            Real-time neural routing, fleet availability, and specialized equipment matching
          </p>
        </div>

        {/* Sector Selector */}
        <div className="flex items-center gap-2 bg-navy-900 border border-navy-700 px-3 py-1.5 rounded-lg">
          <MapPin className="w-4 h-4 text-cyan-400" />
          <span className="text-xs text-slate-400">Target Sector:</span>
          <select
            value={selectedTargetLocation}
            onChange={(e) => setSelectedTargetLocation(e.target.value)}
            className="bg-transparent text-xs font-bold text-white focus:outline-none cursor-pointer"
          >
            {Object.keys(CITY_LANDMARKS).map((loc) => (
              <option key={loc} value={loc} className="bg-navy-900 text-white">
                {loc}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Target Sector Details Pill */}
      <div className="bg-navy-900/80 border border-cyan-500/30 rounded-lg p-3 text-xs flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-white font-medium">
          <span className="text-cyan-400 font-bold">Emergency Detected At:</span>
          <span className="font-bold underline">{selectedTargetLocation}</span>
          <span className="text-slate-400 font-mono">({targetLoc.lat.toFixed(4)}°N, {targetLoc.lng.toFixed(4)}°E)</span>
        </div>
        <div className="text-[11px] text-emerald-400 font-mono">
          ✓ Nearest node route optimized via Green Corridor
        </div>
      </div>

      {/* 3 AI Recommendations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Recommended Ambulance */}
        <div className="bg-navy-900/90 border-2 border-red-500/40 hover:border-red-500 rounded-xl p-4 shadow-card space-y-3 transition-all flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-2xl">🚑</span>
              <span className="text-[10px] font-mono font-bold uppercase bg-red-500/20 text-red-300 px-2 py-0.5 rounded">
                Match: {recAmb.score.toFixed(0)}%
              </span>
            </div>
            
            <div>
              <div className="text-[11px] uppercase font-bold text-slate-400">Recommended Ambulance</div>
              <h4 className="text-base font-extrabold text-white font-mono">{recAmb.vehicle.id}</h4>
              <p className="text-xs text-slate-300 font-medium">{recAmb.vehicle.organization}</p>
            </div>

            <div className="bg-navy-950 p-2.5 rounded-lg border border-navy-800 space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Distance:</span>
                <span className="font-mono font-bold text-white">{recAmb.distKm} km</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Estimated Arrival:</span>
                <span className="font-mono font-bold text-cyan-400">{recAmb.etaMin} minutes</span>
              </div>
              <div className="pt-1 text-[11px] text-slate-400">
                <strong>Reason:</strong> Nearest available ambulance with ALS equipment & ventilator.
              </div>
            </div>
          </div>

          <button
            onClick={() => handleInstantDeploy('Ambulance')}
            className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-2 rounded-lg text-xs transition-colors flex items-center justify-center gap-1.5"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Deploy {recAmb.vehicle.id}</span>
          </button>
        </div>

        {/* Recommended Police Unit */}
        <div className="bg-navy-900/90 border-2 border-amber-500/40 hover:border-amber-500 rounded-xl p-4 shadow-card space-y-3 transition-all flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-2xl">🚔</span>
              <span className="text-[10px] font-mono font-bold uppercase bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded">
                Match: {recPol.score.toFixed(0)}%
              </span>
            </div>
            
            <div>
              <div className="text-[11px] uppercase font-bold text-slate-400">Recommended Police Unit</div>
              <h4 className="text-base font-extrabold text-white font-mono">{recPol.vehicle.id}</h4>
              <p className="text-xs text-slate-300 font-medium">{recPol.vehicle.organization}</p>
            </div>

            <div className="bg-navy-950 p-2.5 rounded-lg border border-navy-800 space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Distance:</span>
                <span className="font-mono font-bold text-white">{recPol.distKm} km</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Estimated Arrival:</span>
                <span className="font-mono font-bold text-cyan-400">{recPol.etaMin} minutes</span>
              </div>
              <div className="pt-1 text-[11px] text-slate-400">
                <strong>Reason:</strong> Closest patrol unit with traffic control & priority barrier gear.
              </div>
            </div>
          </div>

          <button
            onClick={() => handleInstantDeploy('Police')}
            className="w-full bg-amber-600 hover:bg-amber-500 text-black font-bold py-2 rounded-lg text-xs transition-colors flex items-center justify-center gap-1.5"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Deploy {recPol.vehicle.id}</span>
          </button>
        </div>

        {/* Recommended Fire Engine */}
        <div className="bg-navy-900/90 border-2 border-orange-500/40 hover:border-orange-500 rounded-xl p-4 shadow-card space-y-3 transition-all flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-2xl">🚒</span>
              <span className="text-[10px] font-mono font-bold uppercase bg-orange-500/20 text-orange-300 px-2 py-0.5 rounded">
                Match: {recFir.score.toFixed(0)}%
              </span>
            </div>
            
            <div>
              <div className="text-[11px] uppercase font-bold text-slate-400">Recommended Fire Engine</div>
              <h4 className="text-base font-extrabold text-white font-mono">{recFir.vehicle.id}</h4>
              <p className="text-xs text-slate-300 font-medium">{recFir.vehicle.organization}</p>
            </div>

            <div className="bg-navy-950 p-2.5 rounded-lg border border-navy-800 space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Distance:</span>
                <span className="font-mono font-bold text-white">{recFir.distKm} km</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Estimated Arrival:</span>
                <span className="font-mono font-bold text-cyan-400">{recFir.etaMin} minutes</span>
              </div>
              <div className="pt-1 text-[11px] text-slate-400">
                <strong>Reason:</strong> High-pressure water tender with hydraulic extrication tools.
              </div>
            </div>
          </div>

          <button
            onClick={() => handleInstantDeploy('Fire Engine')}
            className="w-full bg-orange-600 hover:bg-orange-500 text-white font-bold py-2 rounded-lg text-xs transition-colors flex items-center justify-center gap-1.5"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Deploy {recFir.vehicle.id}</span>
          </button>
        </div>

      </div>

    </div>
  );
};

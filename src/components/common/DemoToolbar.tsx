import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEmergency } from '../../context/EmergencyContext';
import { 
  Zap, 
  FastForward, 
  Camera, 
  RotateCcw, 
  Sparkles, 
  ChevronUp, 
  ChevronDown, 
  ShieldAlert, 
  CheckCircle,
  Clock
} from 'lucide-react';
const SOS_SERVICE_TYPES: Array<'Ambulance' | 'Police' | 'Fire Engine' | 'Emergency Jeep'> = [
  'Ambulance', 'Ambulance', 'Police', 'Fire Engine', 'Emergency Jeep'
];

const SOS_LOCATIONS = [
  'Main Road', 'Bus Stand', 'Junction', 'Hospital Road',
  'Railway Station', 'Market Area', 'Highway', 'Residential Area'
];

const SOS_INCIDENT_TYPES: Record<string, string[]> = {
  'Ambulance': ['Road Accident', 'Medical Emergency', 'Fall Injury', 'Chest Pain'],
  'Police': ['Theft Report', 'Public Disturbance', 'Road Accident'],
  'Fire Engine': ['Fire Outbreak', 'Gas Leak', 'Building Fire'],
  'Emergency Jeep': ['Road Blockage', 'Flooding', 'Rescue Needed']
};

export const DemoToolbar: React.FC = () => {
  const { 
    currentEmergency, 
    fastForwardEmergency, 
    triggerMockAIIncident, 
    dispatchEmergency, 
    resetSimulationState,
    simulationSpeed,
    setSimulationSpeed,
    resolveEmergency
  } = useEmergency();

  const navigate = useNavigate();

  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  return (
    <aside aria-label="Demo Assistant Controller" className="fixed bottom-4 right-4 z-50">
      <div className="bg-[#11162b]/95 border border-cyan-500/40 rounded-xl shadow-2xl backdrop-blur-md overflow-hidden text-xs transition-all duration-300 w-80">
        
        {/* Header Bar */}
        <div 
          onClick={() => setIsExpanded(!isExpanded)}
          className="bg-gradient-to-r from-navy-900 via-navy-800 to-navy-900 px-3 py-2 border-b border-navy-700 flex items-center justify-between cursor-pointer hover:bg-navy-800 transition-colors"
        >
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            <span className="font-bold text-cyan-300 flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-yellow-400" />
              Demo Assistant & Quick Test Controls
            </span>
          </div>
          <button className="text-slate-400 hover:text-white">
            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>

        {/* Expandable Body */}
        {isExpanded && (
          <div className="p-3 space-y-2.5">
            <div className="text-[11px] text-slate-400 leading-tight">
              Use these shortcuts to simulate live lifecycle events across Citizen, Traffic Police, and Government views.
            </div>

            {/* Current Active Emergency Status Pill */}
            {currentEmergency ? (
              <div className="bg-navy-900 p-2 rounded-lg border border-navy-700 space-y-1">
                <div className="flex items-center justify-between font-mono">
                  <span className="text-white font-bold">{currentEmergency.id} ({currentEmergency.assignedVehicleId})</span>
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                    currentEmergency.status === 'ARRIVED' 
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                      : currentEmergency.status === 'RESOLVED'
                      ? 'bg-slate-700 text-slate-300'
                      : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 animate-pulse'
                  }`}>
                    {currentEmergency.status}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>ETA: <strong className="text-white">{currentEmergency.etaMinutes} min</strong></span>
                  <span>Dist: <strong className="text-white">{currentEmergency.distanceKm} km</strong></span>
                  <span>Loc: <strong className="text-slate-300">{currentEmergency.location.name}</strong></span>
                </div>
              </div>
            ) : (
              <div className="bg-navy-900 p-2 rounded-lg border border-navy-700 text-slate-400 text-center text-[11px]">
                No active citizen emergency selected.
              </div>
            )}

            {/* Quick Actions Grid */}
            <div className="grid grid-cols-2 gap-1.5">
              <button
                onClick={() => {
  const randomService = SOS_SERVICE_TYPES[Math.floor(Math.random() * SOS_SERVICE_TYPES.length)];
  const randomLocation = SOS_LOCATIONS[Math.floor(Math.random() * SOS_LOCATIONS.length)];
  const incidentOptions = SOS_INCIDENT_TYPES[randomService];
  const randomIncident = incidentOptions[Math.floor(Math.random() * incidentOptions.length)];
  dispatchEmergency(randomService, randomLocation, randomIncident);
}}
                className="bg-red-600/30 hover:bg-red-600/50 text-red-200 border border-red-500/40 px-2 py-1.5 rounded-lg flex items-center gap-1.5 font-medium transition-colors"
                title="Dispatch a new simulated Ambulance"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
                <span>Simulate SOS</span>
              </button>

              <button
                onClick={() => fastForwardEmergency(undefined, 2)}
                className="bg-amber-600/30 hover:bg-amber-600/50 text-amber-200 border border-amber-500/40 px-2 py-1.5 rounded-lg flex items-center gap-1.5 font-medium transition-colors"
                title="Jump ETA to 2 minutes (Triggers Traffic Police Checkpoint Alert!)"
              >
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>Jump to 2m ETA</span>
              </button>

              <button
                onClick={() => fastForwardEmergency(undefined, 0)}
                className="bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-200 border border-emerald-500/40 px-2 py-1.5 rounded-lg flex items-center gap-1.5 font-medium transition-colors"
                title="Set vehicle status to ARRIVED"
              >
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>Instant Arrival</span>
              </button>

              <button
                onClick={() => triggerMockAIIncident('Road Accident Collision')}
                className="bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 border border-purple-500/40 px-2 py-1.5 rounded-lg flex items-center gap-1.5 font-medium transition-colors"
                title="Trigger an AI incident on Camera 07 (Highway)"
              >
                <Camera className="w-3.5 h-3.5 text-purple-400" />
                <span>AI CCTV Alert</span>
              </button>
            </div>

            {/* Simulation Speed & Reset */}
            <div className="flex items-center justify-between pt-1 border-t border-navy-700">
              <div className="flex items-center gap-1">
                <span className="text-[10px] text-slate-400">Speed:</span>
                <button
                  onClick={() => setSimulationSpeed(1)}
                  className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                    simulationSpeed === 1 ? 'bg-cyan-500 text-black' : 'bg-navy-800 text-slate-300'
                  }`}
                >
                  1x
                </button>
                <button
                  onClick={() => setSimulationSpeed(5)}
                  className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                    simulationSpeed === 5 ? 'bg-cyan-500 text-black' : 'bg-navy-800 text-slate-300'
                  }`}
                >
                  5x Fast
                </button>
              </div>

              {currentEmergency && currentEmergency.status !== 'RESOLVED' && (
                <button
                  onClick={() => resolveEmergency(currentEmergency.id)}
                  className="text-[10px] text-emerald-400 hover:text-emerald-300 underline"
                >
                  Resolve Case
                </button>
              )}

              <button
                onClick={resetSimulationState}
                className="text-[10px] text-slate-400 hover:text-red-400 flex items-center gap-1"
                title="Reset to default mock data"
              >
                <RotateCcw className="w-3 h-3" />
                Reset
              </button>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import { useEmergency } from '../../context/EmergencyContext';
import { 
  Car, 
  ShieldAlert, 
  Radio, 
  CheckCircle, 
  Zap, 
  MapPin, 
  Clock, 
  Navigation, 
  AlertTriangle, 
  Layers, 
  Sliders, 
  LogOut,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { CityMap } from '../map/CityMap';
import { TrafficCheckpoint } from '../../types';

export const TrafficPoliceDashboard: React.FC = () => {
  const { 
    emergencyRequests, 
    vehicles,
    checkpoints, 
    acknowledgeTrafficAlert, 
    toggleGreenCorridor,
    activeTrafficAlert,
    setActiveRole
  } = useEmergency();

  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'DASHBOARD' | 'ALERTS' | 'VEHICLES' | 'ROUTES'>('DASHBOARD');
  const [selectedCheckpoint, setSelectedCheckpoint] = useState<TrafficCheckpoint | null>(null);
  const [acknowledgedIds, setAcknowledgedIds] = useState<Set<string>>(new Set());

  // Active approaching vehicles filtered from emergency requests
  const activeEmergencies = emergencyRequests.filter(
    e => e.status === 'DISPATCHED' || e.status === 'EN_ROUTE'
  );

  const showBanner = activeTab === 'DASHBOARD';
  const showAlertsSection = activeTab === 'DASHBOARD' || activeTab === 'ALERTS';
  const showRoutesSection = activeTab === 'DASHBOARD' || activeTab === 'ROUTES';
  const showMap = activeTab === 'DASHBOARD' || activeTab === 'ROUTES';
  const showVehiclesSection = activeTab === 'VEHICLES';

  const alertsCard = (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-navy-700 pb-2">
        <div className="flex items-center gap-2">
          <Radio className="w-4 h-4 text-red-400 animate-pulse" />
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-white">
            LIVE EMERGENCY VEHICLE ALERTS
          </h3>
        </div>
        <span className="text-xs text-slate-400 font-mono">
          {activeEmergencies.length} Approaching Units
        </span>
      </div>

      {activeEmergencies.length === 0 ? (
        <div className="bg-[#151b34] border border-navy-700 rounded-xl p-8 text-center text-slate-400 space-y-2">
          <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto" />
          <div className="text-sm font-bold text-white">All Traffic Corridors Clear</div>
          <p className="text-xs">No emergency vehicles currently requesting traffic signal override.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {activeEmergencies.map((emg) => {
            const isHighPriority = emg.etaMinutes <= 5;
            const isAcknowledged = acknowledgedIds.has(emg.id);
            const priorityBadge = isHighPriority 
              ? { label: '🔴 HIGH PRIORITY', bg: 'bg-red-500/20 text-red-400 border-red-500/40' }
              : { label: '🟠 MEDIUM PRIORITY', bg: 'bg-amber-500/20 text-amber-400 border-amber-500/40' };

            return (
              <div
                key={emg.id}
                className={`bg-[#151b34] hover:bg-[#1a2242] border-2 rounded-xl p-4 sm:p-5 shadow-card transition-all space-y-3 ${
  isAcknowledged ? 'border-emerald-500/40' : 'border-red-500/40 hover:border-red-500'
}`}
              >
                {/* Top Row: Vehicle ID & Priority */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">
                      {emg.assignedVehicleType === 'Ambulance' ? '🚑' : emg.assignedVehicleType === 'Police' ? '🚔' : '🚒'}
                    </span>
                    <div>
                      <h4 className="text-base font-extrabold text-white font-mono">
                        {emg.assignedVehicleId} – {emg.assignedVehicleType}
                      </h4>
                      <div className="text-xs text-slate-400 font-mono">
                        Route: {emg.routePoints[0]?.name || 'City Hospital'} → {emg.location.name}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-mono font-extrabold px-2.5 py-1 rounded-full border ${priorityBadge.bg}`}>
                      {priorityBadge.label}
                    </span>
                  </div>
                </div>

                {/* Middle Row: Checkpoint, ETA & Action */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-navy-900/80 p-3 rounded-lg border border-navy-700 text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Next Checkpoint:</span>
                    <span className="font-bold text-white text-sm">Trichy Main Road Traffic Booth</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">ETA to Checkpoint:</span>
                    <span className="font-mono font-extrabold text-cyan-400 text-base">
                      {emg.etaMinutes} minutes
                    </span>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Required Action:</span>
                    <span className="text-red-300 font-semibold flex items-center gap-1.5 mt-0.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0" />
                      <span>Clear traffic and provide priority passage</span>
                    </span>
                  </div>
                </div>

                {/* Bottom Action Buttons */}
                {/* Bottom Action Buttons */}
<div className="flex flex-wrap items-center justify-end gap-2 pt-1">
  {isAcknowledged ? (
    <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5">
      <CheckCircle className="w-3.5 h-3.5" />
      <span>Acknowledged</span>
    </span>
  ) : (

      <button
        onClick={() => {
          acknowledgeTrafficAlert(checkpoints[0].id);
          setAcknowledgedIds(prev => new Set(prev).add(emg.id));
        }}
        className="bg-navy-800 hover:bg-navy-700 text-slate-200 border border-navy-600 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors"
      >
        <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
        <span>Acknowledge</span>
      </button>
  )}
</div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  const routesCard = (
    <div className="space-y-3 pt-4">
      <div className="flex items-center justify-between border-b border-navy-700 pb-2">
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-300">
          City Traffic Police Checkpoints (4 Booths)
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {checkpoints.map((cp) => {
          const isCorridor = cp.greenCorridorActive;
          const isAlert = cp.currentStatus === 'ALERT';

          return (
            <div
              key={cp.id}
              className={`bg-[#151b34] border rounded-lg p-3.5 space-y-2 transition-all ${
                isCorridor 
                  ? 'border-emerald-500 shadow-glow-green' 
                  : isAlert 
                  ? 'border-red-500 shadow-glow-red' 
                  : 'border-navy-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white truncate">{cp.name}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                  isCorridor ? 'bg-emerald-500/20 text-emerald-300' : isAlert ? 'bg-red-500/20 text-red-300 animate-pulse' : 'bg-navy-900 text-slate-400'
                }`}>
                  {isCorridor ? '🟢 GREEN CORRIDOR' : isAlert ? '🔴 ALERT' : '⚪ NORMAL'}
                </span>
              </div>

              <div className="text-[11px] text-slate-300">
                Action: <span className="font-semibold text-white">{cp.actionRequired}</span>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-navy-800 text-xs">
                <span className="text-[10px] text-slate-400">ID: {cp.id}</span>
                <button
                  onClick={() => toggleGreenCorridor(cp.id)}
                  className={`text-[11px] font-bold px-2 py-1 rounded transition-colors ${
                    isCorridor 
                      ? 'bg-emerald-600 text-white hover:bg-emerald-700' 
                      : 'bg-navy-800 text-slate-300 hover:text-white hover:bg-navy-700'
                  }`}
                >
                  {isCorridor ? 'Active' : 'Enable Corridor'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const vehiclesCard = (
    <div className="space-y-3">
      <div className="flex items-center justify-between border-b border-navy-700 pb-2">
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-300">
          Active Emergency Vehicles ({activeEmergencies.length})
        </h3>
      </div>

      {activeEmergencies.length === 0 ? (
        <div className="bg-[#151b34] border border-navy-700 rounded-xl p-8 text-center text-slate-400 space-y-2">
          <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto" />
          <div className="text-sm font-bold text-white">No Vehicles Currently Active</div>
          <p className="text-xs">All units are on standby. Nothing to track right now.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {activeEmergencies.map((emg) => {
            const vehicle = vehicles.find(v => v.id === emg.assignedVehicleId);
            return (
              <div
                key={emg.id}
                className="bg-[#151b34] border border-navy-700 rounded-lg p-3.5 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-extrabold text-white font-mono flex items-center gap-1.5">
                    <span>{emg.assignedVehicleType === 'Ambulance' ? '🚑' : emg.assignedVehicleType === 'Police' ? '🚔' : '🚒'}</span>
                    <span>{emg.assignedVehicleId}</span>
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    {emg.status.replace('_', ' ')}
                  </span>
                </div>
                <div className="text-[11px] text-slate-300 space-y-1">
                  <div>Driver: <span className="text-white font-semibold">{vehicle?.driverName || 'N/A'}</span></div>
                  <div>Destination: <span className="text-white font-semibold">{emg.location.name}</span></div>
                  <div>ETA: <span className="text-cyan-400 font-bold">{emg.etaMinutes} min</span></div>
                  <div>Incident: <span className="text-white">{emg.incidentType}</span></div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in py-4 px-2 sm:px-4">
      
      {/* Traffic Police Sub-Navbar */}
      <div className="bg-[#151b34] border border-navy-700 rounded-lg p-3 flex flex-wrap items-center justify-between gap-3 shadow-card">
        
        {/* Terminal Title */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
            <Car className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-extrabold text-white flex items-center gap-2">
              <span>Traffic Police Coordination Terminal</span>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Div 04
              </span>
            </h2>
            <p className="text-[11px] text-slate-400">
              Corridor Clearance & Automated Checkpoint Approaching Alerts
            </p>
          </div>
        </div>

        {/* Traffic Tabs */}
        <div className="flex items-center gap-1 bg-navy-900 p-1 rounded-lg border border-navy-700 text-xs font-medium">
          <button
            onClick={() => setActiveTab('DASHBOARD')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeTab === 'DASHBOARD' ? 'bg-amber-500 text-black font-bold' : 'text-slate-300 hover:text-white'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('ALERTS')}
            className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1 ${
              activeTab === 'ALERTS' ? 'bg-amber-500 text-black font-bold' : 'text-slate-300 hover:text-white'
            }`}
          >
            <span>Emergency Alerts</span>
            {activeEmergencies.length > 0 && (
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('VEHICLES')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeTab === 'VEHICLES' ? 'bg-amber-500 text-black font-bold' : 'text-slate-300 hover:text-white'
            }`}
          >
            Active Vehicles ({activeEmergencies.length})
          </button>
          <button
            onClick={() => setActiveTab('ROUTES')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeTab === 'ROUTES' ? 'bg-amber-500 text-black font-bold' : 'text-slate-300 hover:text-white'
            }`}
          >
            Corridor Routes
          </button>
          <button
            onClick={() => {
              setActiveRole('HOME');
              navigate('/');
            }}
            className="px-3 py-1.5 rounded-md text-slate-400 hover:text-red-400 transition-colors flex items-center gap-1"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Exit</span>
          </button>
        </div>
      </div>

      {/* Critical Approaching Alert Banner if any vehicle is <= 2 min */}
      {showBanner && activeTrafficAlert && (
        <div className="bg-gradient-to-r from-red-600 via-red-500 to-red-700 text-white rounded-xl p-5 shadow-glow-red animate-pulse flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center text-2xl shrink-0">
              🚨
            </div>
            <div>
              <div className="text-xs font-black uppercase tracking-widest text-yellow-300">
                CRITICAL CHECKPOINT PRIORITY ALERT
              </div>
              <h3 className="text-xl font-extrabold">
                EMERGENCY VEHICLE APPROACHING – ETA: 2 MINUTES
              </h3>
              <p className="text-xs text-red-100 font-medium mt-0.5">
                Target Checkpoint: <strong>{activeTrafficAlert.name}</strong> | Action Required: <strong>Clear traffic and provide priority passage</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <button
              onClick={() => toggleGreenCorridor(activeTrafficAlert.id)}
              className="flex-1 md:flex-none bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold px-4 py-2.5 rounded-lg text-xs uppercase tracking-wide flex items-center justify-center gap-1.5 shadow-lg transition-all"
            >
              <Zap className="w-4 h-4" />
              <span>Activate Green Corridor</span>
            </button>
            <button
              onClick={() => acknowledgeTrafficAlert(activeTrafficAlert.id)}
              className="flex-1 md:flex-none bg-white text-red-700 hover:bg-slate-100 font-extrabold px-4 py-2.5 rounded-lg text-xs uppercase tracking-wide flex items-center justify-center gap-1.5 shadow-lg transition-all"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Acknowledge</span>
            </button>
          </div>
        </div>
      )}

      {/* Vehicles-only tab: full width, no map */}
      {showVehiclesSection && vehiclesCard}

      {/* Main Grid: Left Alerts/Routes, Right Map (Dashboard & Routes tabs) */}
      {(showAlertsSection || showRoutesSection) && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          <div className="lg:col-span-7 space-y-4">
            {showAlertsSection && alertsCard}
            {showRoutesSection && routesCard}
          </div>

          {showMap && (
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-[#151b34] border border-navy-700 rounded-xl p-4 shadow-card space-y-3">
                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <Navigation className="w-4 h-4 text-cyan-400" />
                    <span>Active Corridor Map</span>
                  </span>
                  <span className="text-cyan-400 font-mono">Live Feeds</span>
                </div>

                <CityMap
                  emergency={activeEmergencies[0] || null}
                  checkpoints={checkpoints}
                  heightClass="h-[480px]"
                />
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
};

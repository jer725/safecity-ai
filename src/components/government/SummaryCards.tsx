import React from 'react';
import { useEmergency } from '../../context/EmergencyContext';
import { 
  Ambulance, 
  Activity, 
  Shield, 
  Flame, 
  Car, 
  Camera, 
  Radio,
  Sparkles
} from 'lucide-react';

export const SummaryCards: React.FC = () => {
  const { vehicles, emergencyRequests, cctvCameras, checkpoints } = useEmergency();

  const registeredAmbulances = vehicles.filter(v => v.type === 'Ambulance').length || 42;
  const policeVehicles = vehicles.filter(v => v.type === 'Police').length || 25;
  const fireEngines = vehicles.filter(v => v.type === 'Fire Engine').length || 16;
  const activeEmergencies = emergencyRequests.filter(e => e.status !== 'RESOLVED').length;
  const activeVehicles = vehicles.filter(v => v.status === 'Emergency Response').length;
  const onlineCameras = cctvCameras.filter(c => c.status === 'ONLINE').length;
  const trafficAlerts = checkpoints.filter(cp => cp.currentStatus === 'ALERT' || cp.greenCorridorActive).length || 5;

  const metrics = [
    {
      id: 'amb',
      title: 'Registered Ambulances',
      value: registeredAmbulances,
      icon: <Ambulance className="w-5 h-5 text-red-400" />,
      color: 'border-red-500/30 bg-red-950/20 text-red-300',
      indicator: '🟢 Normal',
      indicatorColor: 'text-emerald-400'
    },
    {
      id: 'emg',
      title: 'Active Emergencies',
      value: activeEmergencies.toString().padStart(2, '0'),
      icon: <Activity className="w-5 h-5 text-red-500 animate-pulse" />,
      color: 'border-red-500/50 bg-red-950/40 text-red-400 shadow-glow-red',
      indicator: '🔴 Critical Priority',
      indicatorColor: 'text-red-400'
    },
    {
      id: 'pol',
      title: 'Police Vehicles',
      value: policeVehicles,
      icon: <Shield className="w-5 h-5 text-amber-400" />,
      color: 'border-amber-500/30 bg-amber-950/20 text-amber-300',
      indicator: '🟢 Active Fleet',
      indicatorColor: 'text-emerald-400'
    },
    {
      id: 'fir',
      title: 'Fire Engines',
      value: fireEngines,
      icon: <Flame className="w-5 h-5 text-orange-400" />,
      color: 'border-orange-500/30 bg-orange-950/20 text-orange-300',
      indicator: '🟢 Standby',
      indicatorColor: 'text-emerald-400'
    },
    {
      id: 'act-veh',
      title: 'Active Emergency Vehicles',
      value: activeVehicles.toString().padStart(2, '0'),
      icon: <Car className="w-5 h-5 text-cyan-400" />,
      color: 'border-cyan-500/40 bg-cyan-950/30 text-cyan-300 shadow-glow-cyan',
      indicator: '🟠 Responding',
      indicatorColor: 'text-amber-400'
    },
    {
      id: 'cctv',
      title: 'CCTV Cameras Online',
      value: `${onlineCameras}/${cctvCameras.length}`,
      icon: <Camera className="w-5 h-5 text-purple-400" />,
      color: 'border-purple-500/30 bg-purple-950/20 text-purple-300',
      indicator: '🟢 100% Operational',
      indicatorColor: 'text-emerald-400'
    },
    {
      id: 'trf',
      title: 'Traffic Alerts',
      value: trafficAlerts.toString().padStart(2, '0'),
      icon: <Radio className="w-5 h-5 text-amber-400" />,
      color: 'border-amber-500/30 bg-amber-950/20 text-amber-300',
      indicator: '🟠 Monitored',
      indicatorColor: 'text-amber-400'
    }
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
      {metrics.map((m) => (
        <div
          key={m.id}
          className={`border rounded-xl p-3.5 shadow-card transition-all hover:scale-[1.02] flex flex-col justify-between ${m.color}`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-300 leading-tight">
              {m.title}
            </span>
            <div className="p-1.5 rounded-lg bg-navy-900/60 border border-navy-700">
              {m.icon}
            </div>
          </div>

          <div className="mt-2">
            <div className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-white">
              {m.value}
            </div>
            <div className={`text-[10px] font-bold mt-1 ${m.indicatorColor}`}>
              {m.indicator}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

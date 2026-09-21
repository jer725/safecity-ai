import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEmergency } from '../../context/EmergencyContext';
import { 
  Building2, 
  Activity, 
  Car, 
  Camera, 
  Sparkles, 
  Zap, 
  Bell, 
  LogOut, 
  Navigation,
  Layers,
  MapPin,
  Clock
} from 'lucide-react';
import { RegisteredVehiclesTable } from './RegisteredVehiclesTable';
import { EmergencyRequestMonitor } from './EmergencyRequestMonitor';
import { CCTVMonitoringGrid } from './CCTVMonitoringGrid';
import { AIIncidentDetection } from './AIIncidentDetection';
import { RealTimeAlertPanel } from './RealTimeAlertPanel';
import { CameraSuppressionRequests } from './CameraSuppressionRequests';
import { CityMap } from '../map/CityMap';

export const GovernmentDashboard: React.FC = () => {
  const { activeRole, setActiveRole, currentEmergency, emergencyRequests, checkpoints } = useEmergency();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<
    'OVERVIEW' | 'EMERGENCIES' | 'VEHICLES' | 'CCTV' | 'AI_DETECTION' | 'ALERTS' | 'REQUESTS'
  >('OVERVIEW');

  const activeEmergencies = emergencyRequests.filter(
    e => e.status === 'DISPATCHED' || e.status === 'EN_ROUTE'
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in py-4 px-2 sm:px-4">
      
      {/* Government Navigation Bar */}
      <div className="bg-[#151b34] border border-navy-700 rounded-xl p-3 sm:p-4 flex flex-wrap items-center justify-between gap-3 shadow-card">
        
        {/* Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-white flex items-center gap-2">
              <span>Government Emergency Command Center</span>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                HQ OVERSIGHT
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              SafeCity AI – Real-Time Intelligent Emergency Response Network
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-1 bg-navy-900 p-1 rounded-lg border border-navy-700 text-xs font-medium">
          <button
            onClick={() => setActiveTab('OVERVIEW')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeTab === 'OVERVIEW' ? 'bg-cyan-500 text-black font-bold shadow-glow-cyan' : 'text-slate-300 hover:text-white'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('EMERGENCIES')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeTab === 'EMERGENCIES' ? 'bg-cyan-500 text-black font-bold shadow-glow-cyan' : 'text-slate-300 hover:text-white'
            }`}
          >
            Emergencies
          </button>
          <button
            onClick={() => setActiveTab('VEHICLES')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeTab === 'VEHICLES' ? 'bg-cyan-500 text-black font-bold shadow-glow-cyan' : 'text-slate-300 hover:text-white'
            }`}
          >
            Vehicles (42)
          </button>
          <button
            onClick={() => setActiveTab('CCTV')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeTab === 'CCTV' ? 'bg-cyan-500 text-black font-bold shadow-glow-cyan' : 'text-slate-300 hover:text-white'
            }`}
          >
            CCTV (8 Feeds)
          </button>
          <button
            onClick={() => setActiveTab('AI_DETECTION')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeTab === 'AI_DETECTION' ? 'bg-cyan-500 text-black font-bold shadow-glow-cyan' : 'text-slate-300 hover:text-white'
            }`}
          >
            AI Detection
          </button>
          <button
            onClick={() => setActiveTab('ALERTS')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeTab === 'ALERTS' ? 'bg-cyan-500 text-black font-bold shadow-glow-cyan' : 'text-slate-300 hover:text-white'
            }`}
          >
            Alerts
          </button>
          <button
            onClick={() => setActiveTab('REQUESTS')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeTab === 'REQUESTS' ? 'bg-cyan-500 text-black font-bold shadow-glow-cyan' : 'text-slate-300 hover:text-white'
            }`}
          >
            Requests
          </button>
          <button
            onClick={() => navigate('/')}
            className="px-3 py-1.5 rounded-md text-slate-400 hover:text-red-400 transition-colors flex items-center gap-1"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Exit</span>
          </button>
        </div>

      </div>

      {/* Conditional or Overview Layout */}
      {activeTab === 'OVERVIEW' && (
        <div className="space-y-6">
          
          {/* Main Command Center Grid: Left Live Map, Right Real-Time Alert Ticker */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left 8 Cols: Map View */}
            <div className="lg:col-span-8 bg-[#151b34] border border-navy-700 rounded-xl p-4 shadow-card space-y-3">
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-300">
                <span className="flex items-center gap-1.5">
                  <Navigation className="w-4 h-4 text-cyan-400" />
                  <span>City-Wide Real-Time Dispatch Map</span>
                </span>
                <span className="text-cyan-400 font-mono">
                  {activeEmergencies.length} Active Missions
                </span>
              </div>

              <CityMap
                emergency={activeEmergencies[0] || null}
                checkpoints={checkpoints}
                heightClass="h-[420px]"
              />
            </div>

            {/* Right 4 Cols: Real-Time Event Stream (Section 12) */}
            <div className="lg:col-span-4">
              <RealTimeAlertPanel />
            </div>

          </div>

          {/* Section 8: Emergency Request Monitoring */}
          <EmergencyRequestMonitor />

          {/* Section 9: CCTV Monitoring Grid */}
          <CCTVMonitoringGrid />

          {/* Section 10: AI Incident Detection */}
          <AIIncidentDetection />

          {/* Section 7: Registered Vehicles Table */}
          <RegisteredVehiclesTable />

        </div>
      )}

      {/* Specific Tab Views for deep inspection */}
      {activeTab === 'EMERGENCIES' && (
        <div className="space-y-6">
          <EmergencyRequestMonitor />
          <CityMap emergency={activeEmergencies[0] || null} checkpoints={checkpoints} heightClass="h-[440px]" />
        </div>
      )}

      {activeTab === 'VEHICLES' && (
        <RegisteredVehiclesTable />
      )}

      {activeTab === 'CCTV' && (
        <CCTVMonitoringGrid />
      )}

      {activeTab === 'AI_DETECTION' && (
        <AIIncidentDetection />
      )}

      {activeTab === 'ALERTS' && (
        <RealTimeAlertPanel />
      )}

      {activeTab === 'REQUESTS' && (
        <CameraSuppressionRequests />
      )}

    </div>
  );
};

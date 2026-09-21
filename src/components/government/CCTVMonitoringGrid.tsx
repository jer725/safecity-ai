import React, { useState } from 'react';
import { useEmergency } from '../../context/EmergencyContext';
import { 
  Camera, 
  Eye, 
  ShieldAlert, 
  Maximize2, 
  Activity, 
  Radio, 
  Sparkles,
  Zap
} from 'lucide-react';
import { CCTVCamera } from '../../types';

export const CCTVMonitoringGrid: React.FC = () => {
  const { cctvCameras, triggerMockAIIncident, autoDispatchAIIncident, aiIncidents } = useEmergency();

  const [fullscreenCam, setFullscreenCam] = useState<CCTVCamera | null>(null);

  const handleTriggerIncident = (cam: CCTVCamera) => {
    triggerMockAIIncident('Traffic Collision / Obstruction', cam.number);
  };

  return (
    <div className="bg-[#151b34] border border-navy-700 rounded-xl p-5 shadow-card space-y-4">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-navy-700 pb-3">
        <div>
          <h3 className="text-base font-extrabold uppercase tracking-wider text-white flex items-center gap-2">
            <Camera className="w-5 h-5 text-purple-400" />
            <span>AI CCTV Surveillance & Video Analytics Grid (8 Feeds)</span>
          </h3>
          <p className="text-xs text-slate-400">
            Real-time computer vision inference with automatic hazard and accident classification
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-emerald-400 flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>8/8 FEEDS ONLINE</span>
          </span>
        </div>
      </div>

      {/* 8 Camera Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cctvCameras.map((cam) => {
          const hasIncident = cam.hasIncident;

          return (
            <div
              key={cam.id}
              className={`relative bg-[#0d1224] rounded-xl overflow-hidden border transition-all duration-300 flex flex-col justify-between ${
  cam.suppressed
    ? 'border-2 border-amber-500/60'
    : hasIncident
    ? 'border-2 border-red-500 shadow-glow-red'
    : 'border-navy-700 hover:border-navy-500'
}`}
            >
              {/* Camera Header Bar */}
              <div className="bg-navy-900/90 px-3 py-2 border-b border-navy-800 flex items-center justify-between text-xs">
                <span className="font-bold text-white font-mono">
                  {cam.number} – {cam.name}
                </span>
                {cam.suppressed ? (
  <span className="text-[10px] font-bold text-amber-400 flex items-center gap-1">
    <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
    PAUSED
  </span>
) : (
  <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
    ONLINE
  </span>
)}
              </div>

              {/* Simulated Video Canvas Frame */}
              <div 
                onClick={() => setFullscreenCam(cam)}
                className="relative h-44 bg-slate-950 cctv-scanline overflow-hidden cursor-pointer group flex items-center justify-center select-none"
              >
                {/* Background City Street Gradient Simulation */}
                <div className="absolute inset-0 bg-gradient-to-b from-navy-950 via-slate-900 to-navy-900 opacity-90"></div>

                {/* Road perspective lines */}
                <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
                  <div className="w-0.5 h-full bg-cyan-400 rotate-12"></div>
                  <div className="w-0.5 h-full bg-cyan-400 -rotate-12"></div>
                </div>

                {/* Animated HUD Scanline */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400/10 to-transparent w-full h-8 animate-scanline pointer-events-none"></div>

                {/* Video Timestamp HUD Overlay */}
                <div className="absolute top-2 left-2 text-[9px] font-mono text-cyan-400/90 bg-black/60 px-1.5 py-0.5 rounded">
                  REC ● {cam.resolution} | {cam.streamFps} FPS
                </div>

                {/* Fullscreen Button */}
                <button 
                  className="absolute top-2 right-2 text-slate-400 hover:text-white bg-black/60 p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Expand Feed"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>

                {/* AI Object Detection Bounding Boxes */}
                {cam.detections.map((det, i) => (
                  <div
                    key={i}
                    className="absolute border border-cyan-400/80 bg-cyan-500/10 rounded-sm pointer-events-none"
                    style={{
                      left: `${(det.box[0] / 400) * 100}%`,
                      top: `${(det.box[1] / 250) * 100}%`,
                      width: `${(det.box[2] / 400) * 100}%`,
                      height: `${(det.box[3] / 250) * 100}%`,
                    }}
                  >
                    <span className="absolute -top-3.5 left-0 text-[8px] font-mono bg-cyan-500 text-black font-bold px-1 rounded-t">
                      {det.label} {(det.confidence * 100).toFixed(0)}%
                    </span>
                  </div>
                ))}

                {/* Red Incident Alert Overlay inside Video */}
                {hasIncident && (
                  <div className="absolute inset-0 bg-red-900/30 flex flex-col items-center justify-center p-2 text-center pointer-events-none animate-pulse">
                    <ShieldAlert className="w-8 h-8 text-red-400 mb-1" />
                    <span className="text-xs font-black uppercase text-red-200 bg-red-950/80 px-2 py-0.5 rounded border border-red-500">
                      🚨 AI COLLISION DETECTED
                    </span>
                  </div>
                )}
                {cam.suppressed && (
  <div className="absolute inset-0 bg-amber-900/40 flex flex-col items-center justify-center p-2 text-center pointer-events-none">
    <span className="text-2xl mb-1">🎥</span>
    <span className="text-xs font-black uppercase text-amber-200 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-500">
      Monitoring Paused
    </span>
    <span className="text-[10px] text-amber-300/90 mt-1">
      {cam.suppressionReason}
    </span>
  </div>
)}
              </div>

              {/* Bottom Incident Status Bar */}
              <div className={`p-2.5 text-xs flex items-center justify-between border-t ${
                hasIncident 
                  ? 'bg-red-950/60 border-red-500/40' 
                  : 'bg-navy-900/80 border-navy-800'
              }`}>
                {hasIncident ? (
                  <span className="text-red-400 font-extrabold flex items-center gap-1 text-[11px] animate-pulse">
                    <span className="w-2 h-2 rounded-full bg-red-500"></span>
                    🔴 POSSIBLE INCIDENT DETECTED
                  </span>
                ) : (
                  <span className="text-slate-400 text-[11px]">
                    No Incident Detected
                  </span>
                )}

                {/* Quick Simulation Trigger on Camera */}
                <button
                  onClick={() => handleTriggerIncident(cam)}
                  className="text-[10px] text-slate-400 hover:text-cyan-300 font-mono"
                  title="Simulate AI Detection"
                >
                  [Simulate]
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* Fullscreen Video Modal */}
      {fullscreenCam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 animate-fade-in">
          <div className="bg-[#0e1326] border-2 border-cyan-500 rounded-xl max-w-3xl w-full p-4 shadow-glow-cyan space-y-3">
            <div className="flex items-center justify-between border-b border-navy-700 pb-2">
              <h4 className="font-mono font-bold text-white text-base flex items-center gap-2">
                <Camera className="w-4 h-4 text-cyan-400" />
                <span>LIVE FEED: {fullscreenCam.number} – {fullscreenCam.name}</span>
              </h4>
              <button
                onClick={() => setFullscreenCam(null)}
                className="text-slate-400 hover:text-white font-mono text-base"
              >
                ✕
              </button>
            </div>

            <div className="relative h-80 bg-black rounded-lg overflow-hidden cctv-scanline flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-b from-navy-950 via-slate-900 to-navy-900 opacity-90"></div>
              <div className="text-center space-y-2 relative z-10">
                <Activity className="w-12 h-12 text-cyan-400 mx-auto animate-pulse" />
                <div className="text-cyan-300 font-mono text-sm font-bold">
                  4K ULTRA HD NEURAL INFERENCE ENGINE ACTIVE
                </div>
                <div className="text-xs text-slate-400">
                  Target Coordinates: {fullscreenCam.locationName} | Latency: 42ms | Objects Tracked: 14
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">Status: {fullscreenCam.hasIncident ? '🔴 INCIDENT FLAGGED' : '🟢 ALL CLEAR'}</span>
              <button
                onClick={() => setFullscreenCam(null)}
                className="bg-navy-800 hover:bg-navy-700 text-white font-bold px-4 py-1.5 rounded-lg"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

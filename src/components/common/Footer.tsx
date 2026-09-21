import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, Phone, Activity, HeartHandshake } from 'lucide-react';

export const Footer: React.FC = () => {
  const navigate = useNavigate();

  return (
    <footer className="bg-[#11162b] border-t border-navy-700 text-slate-400 py-8 px-4 sm:px-6 lg:px-8 mt-12 text-xs">
      <div className="max-w-7xl mx-auto space-y-6">
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-navy-800 pb-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-400">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <div className="font-extrabold text-white text-sm">
                SafeCity AI – Real-Time Intelligent Emergency Response Network
              </div>
              <div className="text-[11px] text-slate-500">
                AI-Powered Emergency Coordination for Faster, Safer Cities.
              </div>
            </div>
          </div>

          {/* Emergency Hotlines Badges */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-[11px] font-bold uppercase text-slate-500">Direct Lines:</span>
            <span className="bg-red-950/60 border border-red-500/40 text-red-300 px-2 py-1 rounded font-mono font-bold">
              🚑 108 Ambulance
            </span>
            <span className="bg-amber-950/60 border border-amber-500/40 text-amber-300 px-2 py-1 rounded font-mono font-bold">
              🚔 100 Police
            </span>
            <span className="bg-orange-950/60 border border-orange-500/40 text-orange-300 px-2 py-1 rounded font-mono font-bold">
              🚒 101 Fire
            </span>
            <span className="bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 px-2 py-1 rounded font-mono font-bold">
              📞 112 Unified
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/')} className="hover:text-white transition-colors">Home</button>
            <button onClick={() => navigate('/public')} className="hover:text-white transition-colors">General Public</button>
            <button onClick={() => navigate('/police')} className="hover:text-white transition-colors">Traffic Police</button>
            <button onClick={() => navigate('/government')} className="hover:text-white transition-colors">Government Control</button>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>All Neural Dispatch Engines Operational • Trichy Smart City Node</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
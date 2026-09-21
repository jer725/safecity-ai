import React, { useState } from 'react';
import { useEmergency } from '../../context/EmergencyContext';
import { Bell, Clock } from 'lucide-react';
import { AlertLog } from '../../types';

export const RealTimeAlertPanel: React.FC = () => {
  const { alertLogs } = useEmergency();

  const [filterLevel, setFilterLevel] = useState<string>('ALL');

  const filteredLogs = alertLogs.filter(log => {
    if (filterLevel === 'ALL') return true;
    return log.level === filterLevel;
  });

  const getAlertBadge = (level: AlertLog['level']) => {
    switch (level) {
      case 'CRITICAL':
        return <span className="text-red-400 font-bold font-mono">🔴 CRITICAL</span>;
      case 'HIGH':
        return <span className="text-orange-400 font-bold font-mono">🟠 HIGH</span>;
      case 'TRAFFIC':
        return <span className="text-cyan-400 font-bold font-mono">🔵 TRAFFIC</span>;
      case 'RESOLVED':
        return <span className="text-emerald-400 font-bold font-mono">🟢 RESOLVED</span>;
      case 'INFO':
        return <span className="text-slate-400 font-mono">⚪ INFO</span>;
    }
  };

  return (
    <div className="bg-[#151b34] border border-navy-700 rounded-xl p-4 sm:p-5 shadow-card space-y-3">
      
      {/* Header & Filter */}
      <div className="flex items-center justify-between border-b border-navy-700 pb-3">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-cyan-400 animate-pulse" />
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-white">
            Real-Time System Event Stream
          </h3>
          <span className="text-[10px] font-mono bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded-full border border-cyan-500/30">
            Live Ticker
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-[11px] text-slate-400">Filter:</span>
          <select
            value={filterLevel}
            onChange={(e) => setFilterLevel(e.target.value)}
            className="bg-navy-900 border border-navy-700 rounded px-2 py-1 text-[11px] text-slate-200 focus:outline-none focus:border-cyan-400"
          >
            <option value="ALL">All Levels</option>
            <option value="CRITICAL">🔴 Critical</option>
            <option value="HIGH">🟠 High</option>
            <option value="TRAFFIC">🔵 Traffic</option>
            <option value="RESOLVED">🟢 Resolved</option>
          </select>
        </div>
      </div>

      {/* Scrollable Event Log List */}
      <div className="space-y-2 max-h-64 sm:max-h-72 overflow-y-auto pr-1">

        {/* NEW: shows when there are no events */}
        {filteredLogs.length === 0 && (
          <p className="text-slate-400 text-center py-8 text-sm">
            No events yet. Events appear when an emergency is triggered.
          </p>
        )}

        {filteredLogs.map((log) => (
          <div
            key={log.id}
            className="bg-navy-900/80 hover:bg-navy-800 border border-navy-800 rounded-lg p-2.5 text-xs flex items-start gap-2.5 transition-colors animate-fade-in"
          >
            <div className="shrink-0 mt-0.5">
              {getAlertBadge(log.level)}
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-slate-200 leading-snug break-words">
                {log.message}
              </p>
            </div>

            <div className="shrink-0 text-[10px] font-mono text-slate-400 flex items-center gap-1">
              <Clock className="w-3 h-3 text-slate-500" />
              <span>{log.timestamp}</span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
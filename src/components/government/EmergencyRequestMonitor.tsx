import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import { useEmergency } from '../../context/EmergencyContext';
import { 
  Activity, 
  Clock, 
  MapPin, 
  CheckCircle, 
  ShieldAlert, 
  Search, 
  Filter, 
  Navigation,
  CheckCircle2
} from 'lucide-react';
import { EmergencyRequest, EmergencyStatus } from '../../types';

export const EmergencyRequestMonitor: React.FC = () => {
  const { emergencyRequests, resolveEmergency, selectEmergencyForTracking, setActiveRole } = useEmergency();
  const navigate = useNavigate();

  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const filteredRequests = emergencyRequests.filter(req => {
  if (req.source === 'AI_DETECTION') return false;
  if (statusFilter === 'ALL') return true;
  return req.status === statusFilter;
});

  const getStatusBadge = (status: EmergencyStatus) => {
    switch (status) {
      case 'REGISTERED':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">REGISTERED</span>;
      case 'DISPATCHED':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/20 text-red-300 border border-red-500/30 animate-pulse">🔴 DISPATCHED</span>;
      case 'EN_ROUTE':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 animate-pulse">🔵 EN ROUTE</span>;
      case 'ARRIVED':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">🟢 ARRIVED</span>;
      case 'RESOLVED':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-700 text-slate-300">RESOLVED</span>;
    }
  };

  const handleTrackEmergency = (req: EmergencyRequest) => {
  selectEmergencyForTracking(req);
  navigate('/public');
  };

  return (
    <div className="bg-[#151b34] border border-navy-700 rounded-xl p-5 shadow-card space-y-4">
      
      {/* Header & Filter */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-navy-700 pb-3">
        <div>
          <h3 className="text-base font-extrabold uppercase tracking-wider text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-red-500 animate-pulse" />
            <span>Emergency Request Monitoring</span>
          </h3>
          <p className="text-xs text-slate-400">
            Real-time lifecycle tracking of citizen calls & automated sensor dispatches
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Filter Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-navy-900 border border-navy-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
          >
            <option value="ALL">All Requests</option>
            <option value="DISPATCHED">Dispatched</option>
            <option value="EN_ROUTE">En Route</option>
            <option value="ARRIVED">Arrived</option>
            <option value="RESOLVED">Resolved</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-navy-700 bg-navy-900/80 text-slate-400 font-mono uppercase text-[10px]">
              <th className="py-2.5 px-3">Emergency ID</th>
              <th className="py-2.5 px-3">Requester</th>
              <th className="py-2.5 px-3">Incident Type</th>
              <th className="py-2.5 px-3">Location</th>
              <th className="py-2.5 px-3">Service</th>
              <th className="py-2.5 px-3">Vehicle Assigned</th>
              <th className="py-2.5 px-3">Time</th>
              <th className="py-2.5 px-3">ETA</th>
              <th className="py-2.5 px-3">Status</th>
              <th className="py-2.5 px-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-navy-800 text-slate-200 font-medium">
            {filteredRequests.map((req) => (
              <tr key={req.id} className="hover:bg-navy-800/60 transition-colors">
                <td className="py-2.5 px-3 font-mono font-bold text-cyan-400">
                  {req.id}
                </td>
                <td className="py-2.5 px-3">
                  <span className="bg-navy-900 px-2 py-0.5 rounded text-[10px] text-slate-300">
                    {req.requesterType}
                  </span>
                </td>
                <td className="py-2.5 px-3 font-semibold text-white">
                  {req.incidentType}
                </td>
                <td className="py-2.5 px-3 text-slate-300">
                  {req.location.name}
                </td>
                <td className="py-2.5 px-3">
                  {req.serviceType}
                </td>
                <td className="py-2.5 px-3 font-mono font-bold text-amber-300">
                  {req.assignedVehicleId}
                </td>
                <td className="py-2.5 px-3 font-mono text-slate-400">
                  {req.requestTime}
                </td>
                <td className="py-2.5 px-3 font-mono font-bold text-cyan-400">
                  {req.status === 'ARRIVED' ? '0 min (Arrived)' : req.status === 'RESOLVED' ? '-' : `${req.etaMinutes} min`}
                </td>
                <td className="py-2.5 px-3">
                  {getStatusBadge(req.status)}
                </td>
                <td className="py-2.5 px-3 text-right space-x-1.5">
                  {req.status !== 'RESOLVED' ? (
                    <>
                      <button
                        onClick={() => handleTrackEmergency(req)}
                        className="bg-cyan-600/30 hover:bg-cyan-600/50 text-cyan-200 border border-cyan-500/40 px-2 py-1 rounded text-[11px] font-semibold transition-colors"
                      >
                        Track
                      </button>
                      <button
                        onClick={() => resolveEmergency(req.id)}
                        className="bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-200 border border-emerald-500/40 px-2 py-1 rounded text-[11px] font-semibold transition-colors"
                      >
                        Resolve
                      </button>
                    </>
                  ) : (
                    <span className="text-slate-500 text-[11px]">Closed</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};

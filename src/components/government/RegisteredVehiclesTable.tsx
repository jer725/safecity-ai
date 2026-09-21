import React, { useState } from 'react';
import { useEmergency } from '../../context/EmergencyContext';
import { 
  Car, 
  Search, 
  Filter, 
  ShieldAlert, 
  Ambulance, 
  Flame, 
  Shield, 
  Sparkles,
  Info
} from 'lucide-react';
import { Vehicle, ServiceType, VehicleStatus } from '../../types';

export const RegisteredVehiclesTable: React.FC = () => {
  const { vehicles } = useEmergency();

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  const filteredVehicles = vehicles.filter(v => {
    const matchesSearch = 
      v.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.regNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.organization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.currentLocationName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = selectedType === 'ALL' || v.type === selectedType;
    const matchesStatus = selectedStatus === 'ALL' || v.status === selectedStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  const getStatusBadge = (status: VehicleStatus) => {
    switch (status) {
      case 'Available':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            🟢 Available
          </span>
        );
      case 'On Duty':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/40">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
            🟡 On Duty
          </span>
        );
      case 'Emergency Response':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
            🔴 Emergency Response
          </span>
        );
      case 'Offline':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-700/60 text-slate-400 border border-slate-600">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
            ⚫ Offline
          </span>
        );
    }
  };

  return (
    <div className="bg-[#151b34] border border-navy-700 rounded-xl p-5 shadow-card space-y-4">
      
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-navy-700 pb-3">
        <div>
          <h3 className="text-base font-extrabold uppercase tracking-wider text-white flex items-center gap-2">
            <Car className="w-5 h-5 text-cyan-400" />
            <span>Registered Emergency Vehicle Fleet (42 Units)</span>
          </h3>
          <p className="text-xs text-slate-400">
            Real-time telemetry, location tracking, and response readiness
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search ID, Reg, Org..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-navy-900 border border-navy-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 w-40 sm:w-48"
            />
          </div>

          {/* Type Filter */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="bg-navy-900 border border-navy-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
          >
            <option value="ALL">All Types</option>
            <option value="Ambulance">Ambulance</option>
            <option value="Police">Police</option>
            <option value="Fire Engine">Fire Engine</option>
            <option value="Emergency Jeep">Emergency Jeep</option>
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-navy-900 border border-navy-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
          >
            <option value="ALL">All Status</option>
            <option value="Available">🟢 Available</option>
            <option value="On Duty">🟡 On Duty</option>
            <option value="Emergency Response">🔴 Emergency</option>
            <option value="Offline">⚫ Offline</option>
          </select>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-navy-700 bg-navy-900/80 text-slate-400 font-mono uppercase text-[10px]">
              <th className="py-2.5 px-3">Vehicle ID</th>
              <th className="py-2.5 px-3">Type</th>
              <th className="py-2.5 px-3">Reg. Number</th>
              <th className="py-2.5 px-3">Assigned Organization</th>
              <th className="py-2.5 px-3">Current Status</th>
              <th className="py-2.5 px-3">Current Location</th>
              <th className="py-2.5 px-3 text-right">Equipment / Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-navy-800 text-slate-200 font-medium">
            {filteredVehicles.slice(0, 15).map((v) => (
              <tr 
                key={v.id}
                onClick={() => setSelectedVehicle(v)}
                className="hover:bg-navy-800/60 transition-colors cursor-pointer"
              >
                <td className="py-2.5 px-3 font-mono font-bold text-cyan-400">
                  {v.id}
                </td>
                <td className="py-2.5 px-3">
                  <span className="flex items-center gap-1.5">
                    <span>
                      {v.type === 'Ambulance' ? '🚑' : v.type === 'Police' ? '🚔' : v.type === 'Fire Engine' ? '🚒' : '🚙'}
                    </span>
                    <span>{v.type}</span>
                  </span>
                </td>
                <td className="py-2.5 px-3 font-mono text-slate-300">
                  {v.regNumber}
                </td>
                <td className="py-2.5 px-3 text-slate-300">
                  {v.organization}
                </td>
                <td className="py-2.5 px-3">
                  {getStatusBadge(v.status)}
                </td>
                <td className="py-2.5 px-3 text-slate-300">
                  {v.currentLocationName}
                </td>
                <td className="py-2.5 px-3 text-right">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedVehicle(v);
                    }}
                    className="bg-navy-900 hover:bg-navy-700 border border-navy-700 px-2 py-1 rounded text-[11px] text-cyan-300 transition-colors"
                  >
                    View Specs
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-navy-800">
        <span>Showing {Math.min(15, filteredVehicles.length)} of {vehicles.length} registered vehicles</span>
        <span className="font-mono">Live GPS Telemetry Active</span>
      </div>

      {/* Vehicle Specs Modal */}
      {selectedVehicle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 animate-fade-in">
          <div className="bg-[#151b34] border border-cyan-500 rounded-xl p-5 max-w-md w-full shadow-glow-cyan space-y-4">
            <div className="flex items-center justify-between border-b border-navy-700 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">
                  {selectedVehicle.type === 'Ambulance' ? '🚑' : selectedVehicle.type === 'Police' ? '🚔' : '🚒'}
                </span>
                <div>
                  <h4 className="font-mono font-bold text-white text-base">
                    {selectedVehicle.id} – {selectedVehicle.regNumber}
                  </h4>
                  <div className="text-xs text-cyan-400">{selectedVehicle.organization}</div>
                </div>
              </div>
              <button 
                onClick={() => setSelectedVehicle(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs text-slate-300">
              <div><strong>Driver:</strong> {selectedVehicle.driverName} ({selectedVehicle.contactNumber})</div>
              <div><strong>Current Sector:</strong> {selectedVehicle.currentLocationName}</div>
              <div><strong>Cruising Speed:</strong> ~{selectedVehicle.speedKmh} km/h</div>
              <div><strong>Status:</strong> {getStatusBadge(selectedVehicle.status)}</div>
              
              <div className="pt-2">
                <div className="font-bold text-white mb-1">Onboard Equipment:</div>
                <div className="flex flex-wrap gap-1.5">
                  {selectedVehicle.equipment.map((eq, i) => (
                    <span key={i} className="bg-navy-900 border border-navy-700 text-slate-300 px-2 py-0.5 rounded text-[11px]">
                      {eq}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => setSelectedVehicle(null)}
              className="w-full bg-cyan-600 hover:bg-cyan-500 text-black font-bold py-2 rounded-lg text-xs uppercase"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

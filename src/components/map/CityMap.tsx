import React, { useState } from 'react';
import { 
  Navigation, 
  MapPin, 
  ShieldAlert, 
  Car, 
  Crosshair, 
  Plus, 
  Minus, 
  Layers, 
  Compass,
  Radio,
  Hospital,
  AlertTriangle
} from 'lucide-react';
import { EmergencyRequest, TrafficCheckpoint } from '../../types';
import { CITY_LANDMARKS } from '../../data/mockData';

interface CityMapProps {
  emergency?: EmergencyRequest | null;
  checkpoints?: TrafficCheckpoint[];
  interactive?: boolean;
  heightClass?: string;
  showAllVehicles?: boolean;
}

export const CityMap: React.FC<CityMapProps> = ({
  emergency,
  checkpoints = [],
  interactive = true,
  heightClass = 'h-[460px]',
  showAllVehicles = false
}) => {
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [selectedNode, setSelectedNode] = useState<{ title: string; info: string; type: string } | null>(null);

  // Target Location and Current Vehicle position
  const targetLoc = emergency ? emergency.location : CITY_LANDMARKS['Main Road'];
  const vehiclePos = emergency?.currentVehiclePos || { x: 720, y: 210, lat: 10.8080, lng: 78.6910 };
  const routeStart = emergency?.routePoints?.[0] || CITY_LANDMARKS['City Hospital'];

  // Calculate polyline coordinates for cyan route
  const startX = routeStart.x;
  const startY = routeStart.y;
  const targetX = targetLoc.x;
  const targetY = targetLoc.y;

  // Intermediate waypoint to create a realistic urban turning path
  const midX = (startX + targetX) / 2 + 30;
  const midY = (startY + targetY) / 2 - 20;

  const routePath = `M ${startX} ${startY} Q ${midX} ${midY} ${targetX} ${targetY}`;

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.25, 2.2));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.25, 0.75));
  const handleResetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  return (
    <div className={`relative w-full ${heightClass} bg-[#0e1326] rounded-xl overflow-hidden border border-navy-700 shadow-2xl select-none group`}>
      
      {/* Map Control HUD Overlay */}
      <div className="absolute top-3 right-3 z-20 flex flex-col gap-1.5 bg-navy-900/90 backdrop-blur-md p-1.5 rounded-lg border border-navy-700 shadow-lg">
        <button
          onClick={handleZoomIn}
          className="p-1.5 rounded bg-navy-800 hover:bg-navy-700 text-slate-200 hover:text-cyan-400 transition-colors"
          title="Zoom In"
        >
          <Plus className="w-4 h-4" />
        </button>
        <button
          onClick={handleZoomOut}
          className="p-1.5 rounded bg-navy-800 hover:bg-navy-700 text-slate-200 hover:text-cyan-400 transition-colors"
          title="Zoom Out"
        >
          <Minus className="w-4 h-4" />
        </button>
        <button
          onClick={handleResetView}
          className="p-1.5 rounded bg-navy-800 hover:bg-navy-700 text-slate-200 hover:text-cyan-400 transition-colors"
          title="Recenter Map"
        >
          <Crosshair className="w-4 h-4" />
        </button>
      </div>

      {/* Top Left Status Watermark */}
      <div className="absolute top-3 left-3 z-20 bg-navy-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-navy-700 text-[11px] font-mono flex items-center gap-2">
        <Compass className="w-3.5 h-3.5 text-cyan-400 animate-spin" style={{ animationDuration: '12s' }} />
        <span className="text-slate-300 font-semibold">TRICHY METRO SECTOR 04</span>
        <span className="text-cyan-400 font-bold">● LIVE TELEMETRY</span>
      </div>

      {/* Interactive Detail Popup if node clicked */}
      {selectedNode && (
        <div className="absolute bottom-4 left-4 z-30 bg-navy-900/95 border border-cyan-500/50 p-3 rounded-lg shadow-glow-cyan text-xs max-w-xs animate-fade-in backdrop-blur-md">
          <div className="flex items-center justify-between font-bold text-white mb-1">
            <span>{selectedNode.title}</span>
            <button
              onClick={() => setSelectedNode(null)}
              className="text-slate-400 hover:text-red-400 font-mono ml-2"
            >
              ✕
            </button>
          </div>
          <p className="text-slate-300 text-[11px] leading-relaxed">{selectedNode.info}</p>
        </div>
      )}

      {/* Main SVG Vector Canvas */}
      <svg
        viewBox="0 0 1000 700"
        className="w-full h-full cursor-grab active:cursor-grabbing transition-transform duration-300"
        style={{
          transform: `scale(${zoom}) translate(${pan.x}px, ${pan.y}px)`
        }}
      >
        <defs>
          {/* Cyan Glow for Navigation Path */}
          <filter id="cyanGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Red Glow for Emergency Pin */}
          <filter id="redGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Grid background pattern */}
          <pattern id="mapGrid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255, 255, 255, 0.03)" strokeWidth="1" />
            <circle cx="20" cy="20" r="1" fill="rgba(0, 212, 255, 0.15)" />
          </pattern>

          {/* Linear gradient for water / river body */}
          <linearGradient id="riverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0b223d" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#08182b" stopOpacity="0.9" />
          </linearGradient>
        </defs>

        {/* Map Background Grid */}
        <rect width="1000" height="700" fill="#0d1224" />
        <rect width="1000" height="700" fill="url(#mapGrid)" />

        {/* River Cauvery Simulation */}
        <path
          d="M -50 140 Q 250 100 500 160 T 1050 120 L 1050 190 Q 750 230 500 210 T -50 180 Z"
          fill="url(#riverGrad)"
          stroke="#00d4ff"
          strokeWidth="0.5"
          strokeOpacity="0.3"
        />
        <text x="320" y="165" fill="#00d4ff" opacity="0.3" fontSize="12" fontFamily="monospace" letterSpacing="3">
          CAUVERY RIVER WATERWAY
        </text>

        {/* City Road Network Arterials */}
        {/* Express Highway NH-45 */}
        <path
          d="M 50 680 L 350 450 L 520 360 L 820 180 L 980 90"
          stroke="#1e293b"
          strokeWidth="18"
          strokeLinecap="round"
        />
        <path
          d="M 50 680 L 350 450 L 520 360 L 820 180 L 980 90"
          stroke="#334155"
          strokeWidth="10"
          strokeDasharray="12 6"
          strokeLinecap="round"
        />

        {/* Ring Road & Sector Links */}
        <path
          d="M 120 280 L 380 440 L 450 480 L 720 210 L 680 240 L 520 360"
          stroke="#1e293b"
          strokeWidth="12"
          strokeLinejoin="round"
        />
        <path
          d="M 120 280 L 380 440 L 450 480 L 720 210 L 680 240 L 520 360"
          stroke="#2d3748"
          strokeWidth="6"
          strokeLinejoin="round"
        />

        {/* Junction to Station Spur */}
        <path
          d="M 260 520 L 310 490 L 380 440"
          stroke="#334155"
          strokeWidth="8"
          strokeLinecap="round"
        />

        {/* Hospital link */}
        <path
          d="M 520 360 L 590 300 L 720 210"
          stroke="#1e293b"
          strokeWidth="10"
        />
        <path
          d="M 520 360 L 590 300 L 720 210"
          stroke="#2d3748"
          strokeWidth="5"
        />

        {/* Active Emergency Cyan Navigation Route */}
        {emergency && (
          <g>
            {/* Outer Cyan Glow Pulse */}
            <path
              d={routePath}
              fill="none"
              stroke="#00d4ff"
              strokeWidth="10"
              strokeOpacity="0.4"
              filter="url(#cyanGlow)"
            />
            {/* Main Navigation Line */}
            <path
              d={routePath}
              fill="none"
              stroke="#00d4ff"
              strokeWidth="4"
              strokeLinecap="round"
            />
            {/* Animated Flow Dash on the route */}
            <path
              d={routePath}
              fill="none"
              stroke="#ffffff"
              strokeWidth="2.5"
              strokeDasharray="10 20"
              strokeLinecap="round"
              className="animate-dash"
            >
              <animate
                attributeName="stroke-dashoffset"
                values="100;0"
                dur="1.5s"
                repeatCount="indefinite"
              />
            </path>
          </g>
        )}

        {/* Traffic Checkpoints Markers */}
        {checkpoints.map(cp => {
          const isAlert = cp.currentStatus === 'ALERT';
          const isCorridor = cp.currentStatus === 'GREEN_CORRIDOR' || cp.greenCorridorActive;
          const color = isCorridor ? '#10b981' : isAlert ? '#ff3333' : '#f59e0b';

          return (
            <g
              key={cp.id}
              className="cursor-pointer group/cp"
              onClick={() => setSelectedNode({
                title: cp.name,
                info: `Status: ${cp.currentStatus} | Action: ${cp.actionRequired} | Green Corridor: ${cp.greenCorridorActive ? 'ACTIVE' : 'STANDBY'}`,
                type: 'Checkpoint'
              })}
            >
              {/* Pulsing Beacon if alert or corridor */}
              {(isAlert || isCorridor) && (
                <circle
                  cx={cp.location.x}
                  cy={cp.location.y}
                  r="24"
                  fill="none"
                  stroke={color}
                  strokeWidth="2"
                  opacity="0.7"
                >
                  <animate
                    attributeName="r"
                    values="10;32"
                    dur="1.8s"
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    values="0.8;0"
                    dur="1.8s"
                    repeatCount="indefinite"
                  />
                </circle>
              )}

              <rect
                x={cp.location.x - 12}
                y={cp.location.y - 12}
                width="24"
                height="24"
                rx="6"
                fill="#11162b"
                stroke={color}
                strokeWidth="2"
              />
              <circle
                cx={cp.location.x}
                cy={cp.location.y}
                r="4"
                fill={color}
              />
              <text
                x={cp.location.x}
                y={cp.location.y + 24}
                fill={color}
                fontSize="10"
                fontFamily="sans-serif"
                fontWeight="bold"
                textAnchor="middle"
              >
                {cp.name.split(' ')[0]} BOOTH
              </text>
            </g>
          );
        })}

        {/* City Landmarks Nodes */}
        {Object.entries(CITY_LANDMARKS).map(([name, loc]) => {
          const isTarget = targetLoc.name === name;
          return (
            <g
              key={name}
              className="cursor-pointer"
              onClick={() => setSelectedNode({
                title: loc.name,
                info: `Address: ${loc.address || 'Central City Grid'} | Coordinates: ${loc.lat.toFixed(4)}°N, ${loc.lng.toFixed(4)}°E`,
                type: 'Landmark'
              })}
            >
              <circle
                cx={loc.x}
                cy={loc.y}
                r="7"
                fill="#1e293b"
                stroke={isTarget ? '#ff3333' : '#64748b'}
                strokeWidth="2"
              />
              <circle
                cx={loc.x}
                cy={loc.y}
                r="3"
                fill={isTarget ? '#ff3333' : '#94a3b8'}
              />
              <text
                x={loc.x}
                y={loc.y - 12}
                fill={isTarget ? '#ff6666' : '#cbd5e1'}
                fontSize="11"
                fontWeight={isTarget ? 'bold' : 'normal'}
                fontFamily="sans-serif"
                textAnchor="middle"
              >
                {name}
              </text>
            </g>
          );
        })}

        {/* Target Emergency Location Pin (Red pulsating beacon) */}
        {emergency && (
          <g
            className="cursor-pointer"
            onClick={() => setSelectedNode({
              title: `Emergency Incident #${emergency.id}`,
              info: `Type: ${emergency.incidentType} | Status: ${emergency.status} | ETA: ${emergency.etaMinutes} min | Distance: ${emergency.distanceKm} km`,
              type: 'Emergency'
            })}
          >
            {/* Animated Red Pulse Ring 1 */}
            <circle
              cx={targetLoc.x}
              cy={targetLoc.y}
              r="18"
              fill="#ff3333"
              fillOpacity="0.2"
            >
              <animate
                attributeName="r"
                values="14;40"
                dur="2s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="fill-opacity"
                values="0.4;0"
                dur="2s"
                repeatCount="indefinite"
              />
            </circle>

            {/* Pulsing Pin Head */}
            <circle
              cx={targetLoc.x}
              cy={targetLoc.y}
              r="12"
              fill="#ff3333"
              stroke="#ffffff"
              strokeWidth="2.5"
              filter="url(#redGlow)"
            />
            <circle
              cx={targetLoc.x}
              cy={targetLoc.y}
              r="5"
              fill="#ffffff"
            />
            
            {/* Flag / Label */}
            <rect
              x={targetLoc.x - 45}
              y={targetLoc.y - 38}
              width="90"
              height="20"
              rx="4"
              fill="#990000"
              stroke="#ff3333"
              strokeWidth="1.5"
            />
            <text
              x={targetLoc.x}
              y={targetLoc.y - 24}
              fill="#ffffff"
              fontSize="9"
              fontFamily="monospace"
              fontWeight="bold"
              textAnchor="middle"
            >
              📍 SOS INCIDENT
            </text>
          </g>
        )}

        {/* Assigned Moving Emergency Vehicle Marker */}
        {emergency && (
          <g
            transform={`translate(${vehiclePos.x}, ${vehiclePos.y})`}
            className="cursor-pointer"
            onClick={() => setSelectedNode({
              title: `${emergency.assignedVehicleType} ${emergency.assignedVehicleId}`,
              info: `Status: EN ROUTE | Speed: 48 km/h | ETA to Destination: ${emergency.etaMinutes} min | Priority Corridor Requested`,
              type: 'Vehicle'
            })}
          >
            {/* Flashing Blue/Red Siren Aura */}
            <circle
              r="22"
              fill="none"
              stroke="#00d4ff"
              strokeWidth="2"
              opacity="0.8"
            >
              <animate
                attributeName="r"
                values="16;36"
                dur="1.2s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0.9;0"
                dur="1.2s"
                repeatCount="indefinite"
              />
            </circle>

            {/* Vehicle Box */}
            <rect
              x="-18"
              y="-18"
              width="36"
              height="36"
              rx="10"
              fill="#11162b"
              stroke="#00d4ff"
              strokeWidth="2.5"
              filter="url(#cyanGlow)"
            />

            {/* Vehicle Icon Symbol */}
            <text
              x="0"
              y="6"
              fontSize="18"
              textAnchor="middle"
              dominantBaseline="middle"
            >
              {emergency.assignedVehicleType === 'Ambulance'
                ? '🚑'
                : emergency.assignedVehicleType === 'Police'
                ? '🚔'
                : emergency.assignedVehicleType === 'Fire Engine'
                ? '🚒'
                : '🚙'}
            </text>

            {/* Floating Vehicle Badge Label */}
            <rect
              x="-40"
              y="-38"
              width="80"
              height="18"
              rx="4"
              fill="#002b4d"
              stroke="#00d4ff"
              strokeWidth="1"
            />
            <text
              x="0"
              y="-26"
              fill="#00d4ff"
              fontSize="9"
              fontFamily="monospace"
              fontWeight="bold"
              textAnchor="middle"
            >
              {emergency.assignedVehicleId}
            </text>
          </g>
        )}
      </svg>

      {/* Map Legend Footer */}
      <div className="absolute bottom-3 right-3 z-20 bg-navy-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-navy-700 text-[10px] flex items-center gap-3 text-slate-300">
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-red-500"></span>
          <span>Emergency Location</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2.5 h-1 bg-cyan-400 rounded"></span>
          <span>Live Cyan Route</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded bg-amber-400"></span>
          <span>Traffic Booth</span>
        </div>
      </div>
    </div>
  );
};

export type Role = 'HOME' | 'PUBLIC' | 'POLICE' | 'GOVERNMENT';

export type ServiceType = 'Ambulance' | 'Police' | 'Fire Engine' | 'Emergency Jeep';

export type EmergencyStatus = 'REGISTERED' | 'DISPATCHED' | 'EN_ROUTE' | 'ARRIVED' | 'RESOLVED';

export type VehicleStatus = 'Available' | 'On Duty' | 'Emergency Response' | 'Offline';

export type CheckpointStatus = 'NORMAL' | 'ALERT' | 'GREEN_CORRIDOR';

export type SeverityLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface LocationPoint {
  name: string;
  nameTA?: string;
  lat: number;
  lng: number;
  x: number; // Normalized coordinate for 2D map view (0 - 1000)
  y: number; // Normalized coordinate for 2D map view (0 - 700)
  address?: string;
  addressTA?: string;
}

export interface EmergencyRequest {
  id: string; // EMG[4-digit] e.g. EMG2048
  source?: 'SOS' | 'AI_DETECTION';
  serviceType: ServiceType;
  incidentType: string;
  requesterType: 'Citizen' | 'System Alert' | 'CCTV AI';
  location: LocationPoint;
  assignedVehicleId: string;
  assignedVehicleType: ServiceType;
  requestTime: string;
  status: EmergencyStatus;
  etaMinutes: number;
  distanceKm: number;
  firstAidCondition?: string;
  triageNotes?: string;
  routeProgress: number; // 0 to 100%
  routePoints: LocationPoint[];
  currentVehiclePos: { x: number; y: number; lat: number; lng: number };
  checkpointAlertsSent: string[]; // IDs of checkpoints that were alerted
}

export interface Vehicle {
  id: string; // e.g. AMB102, POL045, FIR012, RES008
  type: ServiceType;
  regNumber: string; // e.g. TN-45-XX-1234
  organization: string;
  status: VehicleStatus;
  currentLocationName: string;
  coords: { x: number; y: number; lat: number; lng: number };
  speedKmh: number;
  equipment: string[];
  driverName: string;
  contactNumber: string;
  activeEmergencyId?: string;
}

export interface TrafficCheckpoint {
  id: string;
  name: string;
  location: LocationPoint;
  currentStatus: CheckpointStatus;
  approachingVehicleId?: string;
  approachingVehicleType?: ServiceType;
  alertEta?: number;
  actionRequired: string;
  isAcknowledged: boolean;
  greenCorridorActive: boolean;
  lastUpdated: string;
}

export interface CCTVCamera {
  id: string;
  number: string; // "Camera 01" to "Camera 08"
  name: string; // e.g. "Main Road"
  locationName: string;
  status: 'ONLINE' | 'OFFLINE';
  hasIncident: boolean;
  incidentType?: string;
  aiConfidence?: number;
  streamFps: number;
  resolution: string;
  detections: Array<{ label: string; box: [number, number, number, number]; confidence: number }>;
  suppressed?: boolean;
  suppressionReason?: string;
}

export interface AIIncident {
  id: string; // INC[4-digit]
  type: string; // e.g. 'Road Accident', 'Fire Detected', 'Crowd Surge', 'Road Blockage'
  location: string;
  locationCoords: LocationPoint;
  source: string; // e.g. 'CCTV Camera 07', 'Traffic Sensor Node 12'
  timestamp: string;
  severity: SeverityLevel;
  recommendedResponse: string;
  autoDispatched: boolean;
  status: 'DETECTED' | 'DISPATCHED' | 'RESOLVED';
  assignedVehicleId?: string;
    assignedPoliceEmergencyId?: string;
  confidenceScore: number;
}

export interface AIResourceRecommendation {
  emergencyId?: string;
  location: string;
  recommendedAmbulance: {
    id: string;
    type: string;
    distanceKm: number;
    etaMinutes: number;
    reason: string;
    score: number;
  };
  recommendedPolice: {
    id: string;
    type: string;
    distanceKm: number;
    etaMinutes: number;
    reason: string;
    score: number;
  };
  recommendedFire: {
    id: string;
    type: string;
    distanceKm: number;
    etaMinutes: number;
    reason: string;
    score: number;
  };
}

export interface AlertLog {
  id: string;
  timestamp: string;
  level: 'CRITICAL' | 'HIGH' | 'TRAFFIC' | 'RESOLVED' | 'INFO';
  message: string;
  relatedId?: string;
  category: 'DISPATCH' | 'POLICE' | 'AI_DETECTION' | 'STATUS_CHANGE' | 'SYSTEM';
}

export interface FirstAidTopic {
  id: string;
  title: string;
  icon: string;
  summary: string;
  steps: string[];
  doNots: string[];
  disclaimer: string;
}

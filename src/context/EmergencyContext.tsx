import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  Role,
  ServiceType,
  EmergencyRequest,
  Vehicle,
  TrafficCheckpoint,
  CCTVCamera,
  AIIncident,
  AlertLog,
  LocationPoint
} from '../types';
import {
  CITY_LANDMARKS,
  INITIAL_CHECKPOINTS,
  INITIAL_CCTV_CAMERAS,
  INITIAL_VEHICLES,
  INITIAL_AI_INCIDENTS,
  INITIAL_ALERT_LOGS
} from '../data/mockData';
import { playAlertTone, setSoundMuted, getSoundMuted } from '../utils/audio';

interface EmergencyContextType {
  activeRole: Role;
  setActiveRole: (role: Role) => void;
  currentEmergency: EmergencyRequest | null;
  emergencyRequests: EmergencyRequest[];
  vehicles: Vehicle[];
  checkpoints: TrafficCheckpoint[];
  cctvCameras: CCTVCamera[];
  aiIncidents: AIIncident[];
  alertLogs: AlertLog[];
  soundMuted: boolean;
  toggleSound: () => void;
  simulationSpeed: number;
  setSimulationSpeed: (speed: number) => void;
  activeTrafficAlert: TrafficCheckpoint | null;

  // Actions
  dispatchEmergency: (serviceType: ServiceType, landmarkName: string, incidentType?: string, source?: 'SOS' | 'AI_DETECTION') => string;
  updateFirstAidCondition: (conditionName: string, notes?: string) => void;
  acknowledgeTrafficAlert: (checkpointId: string) => void;
  toggleGreenCorridor: (checkpointId: string) => void;
  resolveEmergency: (emergencyId: string) => void;
  triggerMockAIIncident: (type?: string, cameraName?: string) => void;
  setCameraSuppression: (cameraLocationName: string, suppressed: boolean, reason?: string) => void;
  fastForwardEmergency: (emergencyId?: string, targetMinutes?: number) => void;
  resetSimulationState: () => void;
  selectEmergencyForTracking: (emergency: EmergencyRequest) => void;
  autoDispatchAIIncident: (incidentId: string) => void;
}

const EmergencyContext = createContext<EmergencyContextType | undefined>(undefined);

export const EmergencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeRole, setActiveRoleState] = useState<Role>('HOME');
  const [vehicles, setVehicles] = useState<Vehicle[]>(INITIAL_VEHICLES);
  const [checkpoints, setCheckpoints] = useState<TrafficCheckpoint[]>(INITIAL_CHECKPOINTS);
  const [cctvCameras, setCctvCameras] = useState<CCTVCamera[]>(INITIAL_CCTV_CAMERAS);
  const [aiIncidents, setAiIncidents] = useState<AIIncident[]>([]);
  const [alertLogs, setAlertLogs] = useState<AlertLog[]>(INITIAL_ALERT_LOGS);
  const [soundMuted, setSoundMutedState] = useState<boolean>(false);
  const [simulationSpeed, setSimulationSpeed] = useState<number>(1);
  const [activeTrafficAlert, setActiveTrafficAlert] = useState<TrafficCheckpoint | null>(null);

  // Initial demo emergency
  const defaultEmergency: EmergencyRequest = {
    id: 'EMG2048',
    serviceType: 'Ambulance',
    incidentType: 'Road Accident',
    requesterType: 'Citizen',
    location: CITY_LANDMARKS['Main Road'],
    assignedVehicleId: 'AMB102',
    assignedVehicleType: 'Ambulance',
    requestTime: '19:44:50',
    status: 'EN_ROUTE',
    etaMinutes: 8,
    distanceKm: 4.2,
    firstAidCondition: 'Bone Injury',
    triageNotes: 'Citizen reported suspected leg fracture, bleeding controlled.',
    routeProgress: 45,
    routePoints: [
      CITY_LANDMARKS['City Hospital'],
      CITY_LANDMARKS['Hospital Road'],
      CITY_LANDMARKS['Main Road']
    ],
    currentVehiclePos: {
      x: 600,
      y: 285,
      lat: 10.8010,
      lng: 78.6990
    },
    checkpointAlertsSent: []
  };

    const [emergencyRequests, setEmergencyRequests] = useState<EmergencyRequest[]>([]);

  const [currentEmergency, setCurrentEmergency] = useState<EmergencyRequest | null>(null);
  const setActiveRole = (role: Role) => {
    setActiveRoleState(role);
    playAlertTone('CLICK');
  };

  const toggleSound = () => {
    const next = !soundMuted;
    setSoundMutedState(next);
    setSoundMuted(next);
    if (!next) {
      playAlertTone('CLICK');
    }
  };

  const addAlertLog = useCallback((
    level: 'CRITICAL' | 'HIGH' | 'TRAFFIC' | 'RESOLVED' | 'INFO',
    message: string,
    category: 'DISPATCH' | 'POLICE' | 'AI_DETECTION' | 'STATUS_CHANGE' | 'SYSTEM',
    relatedId?: string
  ) => {
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];
    const newLog: AlertLog = {
      id: `LOG${Date.now().toString().slice(-4)}`,
      timestamp: timeStr,
      level,
      message,
      category,
      relatedId
    };
    setAlertLogs(prev => [newLog, ...prev.slice(0, 49)]);
  }, []);

  // Instant Dispatch Function
  const dispatchEmergency = (
    serviceType: ServiceType,
    landmarkName: string,
    incidentType: string = 'Emergency Assistance',
    source: 'SOS' | 'AI_DETECTION' = 'SOS'
  ): string => {
    const emgNumber = Math.floor(1000 + Math.random() * 9000);
    const emgId = `EMG${emgNumber}`;
    const targetLandmark = CITY_LANDMARKS[landmarkName] || CITY_LANDMARKS['Main Road'];

    // 1. Find available matching vehicle (randomized among eligible)
    const matchingVehicles = vehicles.filter(
      v => v.type === serviceType && (v.status === 'Available' || v.status === 'On Duty')
    );
    const fallbackVehicles = vehicles.filter(v => v.type === serviceType);
    const pool = matchingVehicles.length > 0 ? matchingVehicles : fallbackVehicles;
    const availableVehicle = pool.length > 0
      ? pool[Math.floor(Math.random() * pool.length)]
      : vehicles[0];

    const assignedId = availableVehicle.id;

    // 2. Mark vehicle status
    setVehicles(prev =>
      prev.map(v =>
        v.id === assignedId
          ? {
              ...v,
              status: 'Emergency Response' as const,
              activeEmergencyId: emgId,
              currentLocationName: `En Route to ${targetLandmark.name}`
            }
          : v
      )
    );

    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];

    // Calculate approximate ETA & Distance
    const dx = targetLandmark.x - availableVehicle.coords.x;
    const dy = targetLandmark.y - availableVehicle.coords.y;
    const distPx = Math.sqrt(dx * dx + dy * dy);
    const distKm = parseFloat(((distPx / 100) * 1.5).toFixed(1)) || 3.8;
    const initialEta = Math.max(5, Math.min(22, Math.round(distKm * 3.5)));

    // Create route points
    const routePoints: LocationPoint[] = [
      {
        name: availableVehicle.currentLocationName,
        lat: availableVehicle.coords.lat,
        lng: availableVehicle.coords.lng,
        x: availableVehicle.coords.x,
        y: availableVehicle.coords.y
      },
      targetLandmark
    ];

    const newEmergency: EmergencyRequest = {
      id: emgId,
      source,
      serviceType,
      incidentType,
      requesterType: source === 'AI_DETECTION' ? 'CCTV AI' : 'Citizen',
      location: targetLandmark,
      assignedVehicleId: assignedId,
      assignedVehicleType: serviceType,
      requestTime: timeStr,
      status: 'DISPATCHED',
      etaMinutes: initialEta,
      distanceKm: distKm,
      routeProgress: 0,
      routePoints,
      currentVehiclePos: {
        x: availableVehicle.coords.x,
        y: availableVehicle.coords.y,
        lat: availableVehicle.coords.lat,
        lng: availableVehicle.coords.lng
      },
      checkpointAlertsSent: []
    };

    setEmergencyRequests(prev => [newEmergency, ...prev]);
    setCurrentEmergency(newEmergency);

    // Logs & Sounds
    playAlertTone('DISPATCH');
    addAlertLog(
      'HIGH',
      `🚨 ${serviceType.toUpperCase()} ${assignedId} auto-assigned and DISPATCHED to ${targetLandmark.name} (${emgId}). ETA: ${initialEta} min.`,
      'DISPATCH',
      emgId
    );

    return emgId;
  };

  // First Aid update
  const updateFirstAidCondition = (conditionName: string, notes?: string) => {
    if (!currentEmergency) return;
    const updated: EmergencyRequest = {
      ...currentEmergency,
      firstAidCondition: conditionName,
      triageNotes: notes || currentEmergency.triageNotes
    };
    setCurrentEmergency(updated);
    setEmergencyRequests(prev =>
      prev.map(e => (e.id === updated.id ? updated : e))
    );
    addAlertLog(
      'INFO',
      `Citizen medical guidance updated for ${updated.id}: ${conditionName}`,
      'SYSTEM',
      updated.id
    );
  };

  // Acknowledge Traffic Alert
  const acknowledgeTrafficAlert = (checkpointId: string) => {
    setCheckpoints(prev =>
      prev.map(cp =>
        cp.id === checkpointId
          ? {
              ...cp,
              isAcknowledged: true,
              currentStatus: 'NORMAL',
              actionRequired: 'Traffic cleared for emergency transit'
            }
          : cp
      )
    );
    setActiveTrafficAlert(null);
    playAlertTone('SUCCESS');
    addAlertLog(
      'TRAFFIC',
      `Traffic Police acknowledged alert at checkpoint ${checkpointId}. Priority lane opened.`,
      'POLICE',
      checkpointId
    );
  };

  // Toggle Green Corridor
  const toggleGreenCorridor = (checkpointId: string) => {
    setCheckpoints(prev =>
      prev.map(cp => {
        if (cp.id === checkpointId) {
          const nextCorridor = !cp.greenCorridorActive;
          return {
            ...cp,
            greenCorridorActive: nextCorridor,
            currentStatus: nextCorridor ? 'GREEN_CORRIDOR' : 'NORMAL',
            actionRequired: nextCorridor
              ? '🟢 GREEN CORRIDOR ACTIVE – Priority Signal Override'
              : 'Maintain regular signal cycle'
          };
        }
        return cp;
      })
    );
    playAlertTone('CORRIDOR');
    addAlertLog(
      'TRAFFIC',
      `GREEN CORRIDOR override toggled at checkpoint ${checkpointId}. Signals synchronized.`,
      'POLICE',
      checkpointId
    );
  };

  // Resolve Emergency
  // NOTE: This is called from setTimeout callbacks (both the main simulation loop and
  // fastForwardEmergency's "Instant Arrival" path). Because of that, it must NEVER read
  // aiIncidents/emergencyRequests to make cross-unit decisions here — those closures can
  // be stale by the time the timeout fires. Any logic that depends on "have BOTH linked
  // units resolved yet" lives in the separate useEffect below instead, which always sees
  // fresh state.
  const resolveEmergency = (emergencyId: string) => {
    let resolvedVehicleId = '';
    setEmergencyRequests(prev =>
      prev.map(e => {
        if (e.id === emergencyId) {
          resolvedVehicleId = e.assignedVehicleId;
          return {
            ...e,
            status: 'RESOLVED',
            etaMinutes: 0,
            distanceKm: 0,
            routeProgress: 100
          };
        }
        return e;
      })
    );

    if (currentEmergency && currentEmergency.id === emergencyId) {
      setCurrentEmergency(prev =>
        prev ? { ...prev, status: 'RESOLVED', etaMinutes: 0, distanceKm: 0, routeProgress: 100 } : null
      );
    }

    if (resolvedVehicleId) {
      setVehicles(prev =>
        prev.map(v =>
          v.id === resolvedVehicleId
            ? {
                ...v,
                status: 'Available',
                activeEmergencyId: undefined,
                currentLocationName: v.currentLocationName.replace('En Route to ', '') + ' Hub'
              }
            : v
        )
      );
    }

    playAlertTone('SUCCESS');
    addAlertLog(
      'RESOLVED',
      `Emergency ${emergencyId} marked as RESOLVED. Unit ${resolvedVehicleId} returned to service.`,
      'STATUS_CHANGE',
      emergencyId
    );
  };

  // Trigger Mock AI Incident
  const triggerMockAIIncident = (type = 'Road Blockage / Collision', cameraName?: string) => {
    const incNumber = Math.floor(5000 + Math.random() * 900);
    const incId = `INC${incNumber}`;
    const eligibleCameras = cctvCameras.filter(c => !c.suppressed);
    const cameraPool = eligibleCameras.length > 0 ? eligibleCameras : cctvCameras;
    const targetCamera = cameraName
      ? cameraPool.find(c => c.number === cameraName || c.name.includes(cameraName)) || cameraPool[Math.floor(Math.random() * cameraPool.length)]
      : cameraPool[Math.floor(Math.random() * cameraPool.length)];
    const loc = CITY_LANDMARKS[targetCamera.locationName] || CITY_LANDMARKS['Highway'];

    const newInc: AIIncident = {
      id: incId,
      cameraId: targetCamera.id,
      type,
      location: `${targetCamera.locationName} Cross`,
      locationCoords: loc,
      source: `${targetCamera.number} (${targetCamera.name})`,
      timestamp: new Date().toTimeString().split(' ')[0],
      severity: 'HIGH',
      recommendedResponse: 'Ambulance + Police Unit',
      autoDispatched: false,
      status: 'DETECTED',
      confidenceScore: 0.95
    };

    setAiIncidents(prev => [newInc, ...prev]);

    // Highlight Camera
    setCctvCameras(prev =>
      prev.map(c =>
        c.id === targetCamera.id
          ? { ...c, hasIncident: true, incidentType: type, aiConfidence: 0.95 }
          : c
      )
    );

    playAlertTone('CRITICAL');
    addAlertLog(
      'CRITICAL',
      `🔴 AI INCIDENT DETECTED by ${targetCamera.number}: ${type} at ${loc.name}. Confidence: 95%.`,
      'AI_DETECTION',
      incId
    );

    // Auto-dispatch immediately since suppression already filters false positives
    const emgId = dispatchEmergency('Ambulance', loc.name, type, 'AI_DETECTION');
    const policeEmgId = dispatchEmergency('Police', loc.name, type, 'AI_DETECTION');
    setAiIncidents(prev =>
      prev.map(i =>
        i.id === incId
          ? {
              ...i,
              status: 'DISPATCHED',
              autoDispatched: true,
              assignedVehicleId: emgId,
              assignedPoliceEmergencyId: policeEmgId
            }
          : i
      )
    );
  };

  // Suppress or resume a camera's AI detection
  const setCameraSuppression = (cameraLocationName: string, suppressed: boolean, reason?: string) => {
    setCctvCameras(prev =>
      prev.map(c =>
        c.locationName === cameraLocationName
          ? { ...c, suppressed, suppressionReason: suppressed ? reason : undefined }
          : c
      )
    );

    addAlertLog(
      'INFO',
      suppressed
        ? `🎥 AI monitoring paused on camera at ${cameraLocationName}. Reason: ${reason}`
        : `✅ AI monitoring resumed on camera at ${cameraLocationName}.`,
      'SYSTEM'
    );
  };

  // Auto Dispatch AI Incident
  const autoDispatchAIIncident = (incidentId: string) => {
    const inc = aiIncidents.find(i => i.id === incidentId);
    if (!inc) return;

    const emgId = dispatchEmergency('Ambulance', inc.locationCoords.name, inc.type);

    setAiIncidents(prev =>
      prev.map(i =>
        i.id === incidentId
          ? {
              ...i,
              status: 'DISPATCHED',
              autoDispatched: true,
              assignedVehicleId: emgId
            }
          : i
      )
    );

    addAlertLog(
      'HIGH',
      `Auto-dispatch initiated for AI Incident ${incidentId}. Emergency ${emgId} generated.`,
      'DISPATCH',
      incidentId
    );
  };

  // Fast forward emergency ETA for judges / testing
  const fastForwardEmergency = (emergencyId?: string, targetMinutes?: number) => {
    const targetId = emergencyId || currentEmergency?.id;
    if (!targetId) return;

    setEmergencyRequests(prev =>
      prev.map(e => {
        if (e.id === targetId) {
          const nextEta = targetMinutes !== undefined ? targetMinutes : Math.max(0, e.etaMinutes - 5);
          const nextProgress = nextEta === 0 ? 100 : Math.min(95, 100 - (nextEta / 22) * 100);
          const nextStatus = nextEta === 0 ? 'ARRIVED' : 'EN_ROUTE';

          // Auto-resolve 15 seconds after instant arrival too
          if (nextStatus === 'ARRIVED') {
            setTimeout(() => {
              resolveEmergency(e.id);
            }, 15000);
          }

          // Move coordinates
          const startX = e.routePoints[0]?.x || 500;
          const startY = e.routePoints[0]?.y || 300;
          const endX = e.location.x;
          const endY = e.location.y;
          const currentX = startX + (endX - startX) * (nextProgress / 100);
          const currentY = startY + (endY - startY) * (nextProgress / 100);

          return {
            ...e,
            etaMinutes: nextEta,
            distanceKm: parseFloat(((nextEta / 22) * 5).toFixed(1)),
            routeProgress: nextProgress,
            status: nextStatus,
            currentVehiclePos: {
              ...e.currentVehiclePos,
              x: currentX,
              y: currentY
            }
          };
        }
        return e;
      })
    );

    if (currentEmergency && currentEmergency.id === targetId) {
      setCurrentEmergency(prev => {
        if (!prev) return null;
        const nextEta = targetMinutes !== undefined ? targetMinutes : Math.max(0, prev.etaMinutes - 5);
        const nextProgress = nextEta === 0 ? 100 : Math.min(95, 100 - (nextEta / 22) * 100);
        return {
          ...prev,
          etaMinutes: nextEta,
          distanceKm: parseFloat(((nextEta / 22) * 5).toFixed(1)),
          routeProgress: nextProgress,
          status: nextEta === 0 ? 'ARRIVED' : 'EN_ROUTE'
        };
      });
    }

    playAlertTone('CLICK');
  };

  const selectEmergencyForTracking = (emergency: EmergencyRequest) => {
    setCurrentEmergency(emergency);
  };

  const resetSimulationState = () => {
    setVehicles(INITIAL_VEHICLES);
    setCheckpoints(INITIAL_CHECKPOINTS);
    setCctvCameras(INITIAL_CCTV_CAMERAS);
    setAiIncidents([]);
    setAlertLogs(INITIAL_ALERT_LOGS);
    setEmergencyRequests([defaultEmergency]);
    setCurrentEmergency(defaultEmergency);
    setActiveTrafficAlert(null);
    playAlertTone('SUCCESS');
  };

  // Watches for AI incidents whose linked units (ambulance + police, if both exist) have
  // ALL resolved, then clears the incident status and resets its camera back to normal.
  // Runs on every emergencyRequests/aiIncidents change, so it always sees current state —
  // this avoids the stale-closure timing bug that setTimeout-based checks can hit.
  useEffect(() => {
    aiIncidents.forEach(inc => {
      if (inc.status === 'RESOLVED') return;
      if (!inc.assignedVehicleId && !inc.assignedPoliceEmergencyId) return;

      const ambulanceResolved =
        !inc.assignedVehicleId ||
        emergencyRequests.find(e => e.id === inc.assignedVehicleId)?.status === 'RESOLVED';

      const policeResolved =
        !inc.assignedPoliceEmergencyId ||
        emergencyRequests.find(e => e.id === inc.assignedPoliceEmergencyId)?.status === 'RESOLVED';

      if (ambulanceResolved && policeResolved) {
        setAiIncidents(prev =>
          prev.map(i => (i.id === inc.id ? { ...i, status: 'RESOLVED' } : i))
        );

        if (inc.cameraId) {
          setCctvCameras(prev =>
            prev.map(c =>
              c.id === inc.cameraId
                ? { ...c, hasIncident: false, incidentType: undefined, aiConfidence: undefined }
                : c
            )
          );
        }
      }
    });
  }, [emergencyRequests, aiIncidents]);

  // Main Real-time Simulation Engine
  useEffect(() => {
    const interval = setInterval(() => {
      setEmergencyRequests(prevRequests => {
        let updated = false;

        const nextList = prevRequests.map(req => {
          if (req.status === 'DISPATCHED') {
            updated = true;
            return {
              ...req,
              status: 'EN_ROUTE' as const
            };
          }

          if (req.status === 'EN_ROUTE' && req.etaMinutes > 0) {
            updated = true;
            const etaStep = simulationSpeed >= 5 ? 2 : 1;
            const nextEta = Math.max(0, req.etaMinutes - etaStep);
            const nextProgress = Math.min(100, Math.round(100 - (nextEta / 22) * 100));
            const nextDist = parseFloat(((nextEta / 22) * 4.8).toFixed(1));

            // Interpolate position
            const startX = req.routePoints[0]?.x || 700;
            const startY = req.routePoints[0]?.y || 220;
            const endX = req.location.x;
            const endY = req.location.y;
            const curX = startX + (endX - startX) * (nextProgress / 100);
            const curY = startY + (endY - startY) * (nextProgress / 100);

            // Check if vehicle reaches <= 2 minutes for Checkpoint alert
            if (nextEta <= 2 && req.etaMinutes > 2) {
              const matchedCheckpoint = checkpoints[0]; // Main road booth or nearest
              if (matchedCheckpoint) {
                setActiveTrafficAlert(matchedCheckpoint);
                playAlertTone('WARNING');
                addAlertLog(
                  'CRITICAL',
                  `🚨 EMERGENCY VEHICLE APPROACHING – ${req.assignedVehicleType.toUpperCase()} ${req.assignedVehicleId} is 2 MINUTES from ${matchedCheckpoint.name}. Priority passage required.`,
                  'POLICE',
                  matchedCheckpoint.id
                );
                setCheckpoints(cps =>
                  cps.map(c =>
                    c.id === matchedCheckpoint.id
                      ? {
                          ...c,
                          currentStatus: 'ALERT',
                          approachingVehicleId: req.assignedVehicleId,
                          approachingVehicleType: req.assignedVehicleType,
                          alertEta: 2,
                          actionRequired: 'Clear traffic and provide priority passage'
                        }
                      : c
                  )
                );
              }
            }

            // Arrival check
            if (nextEta === 0) {
              playAlertTone('SUCCESS');
              addAlertLog(
                'RESOLVED',
                `🟢 ${req.assignedVehicleType} ${req.assignedVehicleId} HAS ARRIVED at ${req.location.name} (${req.id}).`,
                'STATUS_CHANGE',
                req.id
              );

              // Auto-resolve 15 seconds after arrival
              setTimeout(() => {
                resolveEmergency(req.id);
              }, 15000);

              return {
                ...req,
                status: 'ARRIVED' as const,
                etaMinutes: 0,
                distanceKm: 0,
                routeProgress: 100,
                currentVehiclePos: { ...req.currentVehiclePos, x: endX, y: endY }
              };
            }

            return {
              ...req,
              etaMinutes: nextEta,
              distanceKm: nextDist,
              routeProgress: nextProgress,
              currentVehiclePos: { ...req.currentVehiclePos, x: curX, y: curY }
            };
          }

          return req;
        });

        if (updated) {
          // Sync currentEmergency if active
          if (currentEmergency) {
            const matched = nextList.find(e => e.id === currentEmergency.id);
            if (matched) {
              setCurrentEmergency(matched);
            }
          }
        }

        return nextList;
      });
    }, 6000 / simulationSpeed);

    return () => clearInterval(interval);
  }, [simulationSpeed, currentEmergency, checkpoints, addAlertLog]);

  return (
    <EmergencyContext.Provider
      value={{
        activeRole,
        setActiveRole,
        setCameraSuppression,
        currentEmergency,
        emergencyRequests,
        vehicles,
        checkpoints,
        cctvCameras,
        aiIncidents,
        alertLogs,
        soundMuted,
        toggleSound,
        simulationSpeed,
        setSimulationSpeed,
        activeTrafficAlert,
        dispatchEmergency,
        updateFirstAidCondition,
        acknowledgeTrafficAlert,
        toggleGreenCorridor,
        resolveEmergency,
        triggerMockAIIncident,
        fastForwardEmergency,
        resetSimulationState,
        selectEmergencyForTracking,
        autoDispatchAIIncident
      }}
    >
      {children}
    </EmergencyContext.Provider>
  );
};

export const useEmergency = () => {
  const context = useContext(EmergencyContext);
  if (!context) {
    throw new Error('useEmergency must be used within an EmergencyProvider');
  }
  return context;
};

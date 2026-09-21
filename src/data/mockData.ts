import { Vehicle, CCTVCamera, TrafficCheckpoint, LocationPoint, AIIncident, AlertLog, FirstAidTopic } from '../types';

export const CITY_LANDMARKS: Record<string, LocationPoint> = {
  'Main Road': {
    name: 'Main Road',
    nameTA: 'மெயின் ரோடு',
    lat: 10.7905,
    lng: 78.7047,
    x: 520,
    y: 360,
    address: 'Trichy Main Road, Commercial Corridor',
    addressTA: 'திருச்சி மெயின் ரோடு, வணிக பகுதி'
  },
  'Bus Stand': {
    name: 'Bus Stand',
    nameTA: 'பேருந்து நிலையம்',
    lat: 10.7995,
    lng: 78.6923,
    x: 380,
    y: 440,
    address: 'Central Bus Terminal, Sector 4',
    addressTA: 'மத்திய பேருந்து முனையம், பிரிவு 4'
  },
  'Junction': {
    name: 'Junction',
    nameTA: 'ஜங்ஷன்',
    lat: 10.7932,
    lng: 78.6854,
    x: 310,
    y: 490,
    address: 'Trichy Railway Junction Cross',
    addressTA: 'திருச்சி ரயில்வே ஜங்ஷன் குறுக்கு வீதி'
  },
  'Hospital Road': {
    name: 'Hospital Road',
    nameTA: 'மருத்துவமனை சாலை',
    lat: 10.8120,
    lng: 78.6950,
    x: 680,
    y: 240,
    address: 'Govt Medical College Hospital Road',
    addressTA: 'அரசு மருத்துவக் கல்லூரி மருத்துவமனை சாலை'
  },
  'Railway Station': {
    name: 'Railway Station',
    nameTA: 'ரயில் நிலையம்',
    lat: 10.7915,
    lng: 78.6810,
    x: 260,
    y: 520,
    address: 'Main Terminal Concourse & West Gate',
    addressTA: 'முதன்மை முனைய மண்டபம் மற்றும் மேற்கு வாயில்'
  },
  'Market Area': {
    name: 'Market Area',
    nameTA: 'சந்தை பகுதி',
    lat: 10.8020,
    lng: 78.6750,
    x: 450,
    y: 480,
    address: 'Gandhi Wholesale Market Plaza',
    addressTA: 'காந்தி மொத்த விற்பனை சந்தை வளாகம்'
  },
  'Highway': {
    name: 'Highway',
    nameTA: 'நெடுஞ்சாலை',
    lat: 10.8250,
    lng: 78.7180,
    x: 820,
    y: 180,
    address: 'NH-45 Express Highway Bypass',
    addressTA: 'NH-45 விரைவு நெடுஞ்சாலை பைபாஸ்'
  },
  'Residential Area': {
    name: 'Residential Area',
    nameTA: 'குடியிருப்பு பகுதி',
    lat: 10.7850,
    lng: 78.6700,
    x: 200,
    y: 280,
    address: 'Thillai Nagar West Ext Colony',
    addressTA: 'தில்லை நகர் மேற்கு விரிவாக்க காலனி'
  },
  'City Hospital': {
    name: 'City Hospital',
    nameTA: 'நகர மருத்துவமனை',
    lat: 10.8080,
    lng: 78.6910,
    x: 720,
    y: 210,
    address: 'Govt District Headquarters Hospital',
    addressTA: 'அரசு மாவட்ட தலைமையக மருத்துவமனை'
  },
  'Apollo Hub': {
    name: 'Apollo Hub',
    nameTA: 'அப்பல்லோ மையம்',
    lat: 10.8010,
    lng: 78.6990,
    x: 590,
    y: 300,
    address: 'Apollo Speciality Emergency Trauma Center',
    addressTA: 'அப்பல்லோ சிறப்பு அவசர அதிர்ச்சி மையம்'
  }
};

export const INITIAL_CHECKPOINTS: TrafficCheckpoint[] = [
  {
    id: 'CP01',
    name: 'Trichy Main Road Traffic Booth',
    location: CITY_LANDMARKS['Main Road'],
    currentStatus: 'NORMAL',
    actionRequired: 'Maintain regular signal cycle',
    isAcknowledged: false,
    greenCorridorActive: false,
    lastUpdated: '19:45:00'
  },
  {
    id: 'CP02',
    name: 'Junction Traffic Checkpoint',
    location: CITY_LANDMARKS['Junction'],
    currentStatus: 'NORMAL',
    actionRequired: 'Maintain regular signal cycle',
    isAcknowledged: false,
    greenCorridorActive: false,
    lastUpdated: '19:45:00'
  },
  {
    id: 'CP03',
    name: 'Bus Stand Roundabout Booth',
    location: CITY_LANDMARKS['Bus Stand'],
    currentStatus: 'NORMAL',
    actionRequired: 'Maintain regular signal cycle',
    isAcknowledged: false,
    greenCorridorActive: false,
    lastUpdated: '19:45:00'
  },
  {
    id: 'CP04',
    name: 'Highway Bypass Toll & Cross',
    location: CITY_LANDMARKS['Highway'],
    currentStatus: 'NORMAL',
    actionRequired: 'Maintain regular signal cycle',
    isAcknowledged: false,
    greenCorridorActive: false,
    lastUpdated: '19:45:00'
  }
];

export const INITIAL_CCTV_CAMERAS: CCTVCamera[] = [
  {
    id: 'CAM01',
    number: 'Camera 01',
    name: 'Main Road',
    locationName: 'Main Road',
    status: 'ONLINE',
    hasIncident: false,
    streamFps: 30,
    resolution: '4K Ultra HD',
    detections: [
      { label: 'Vehicle', box: [120, 80, 80, 50], confidence: 0.94 },
      { label: 'Pedestrian', box: [240, 160, 30, 60], confidence: 0.89 }
    ]
  },
  {
    id: 'CAM02',
    number: 'Camera 02',
    name: 'Bus Stand',
    locationName: 'Bus Stand',
    status: 'ONLINE',
    hasIncident: false,
    streamFps: 30,
    resolution: '1080p 60fps',
    detections: [
      { label: 'Bus', box: [80, 60, 180, 90], confidence: 0.97 },
      { label: 'Crowd (Normal)', box: [300, 120, 120, 80], confidence: 0.91 }
    ]
  },
  {
    id: 'CAM03',
    number: 'Camera 03',
    name: 'Junction',
    locationName: 'Junction',
    status: 'ONLINE',
    hasIncident: false,
    streamFps: 30,
    resolution: '4K Ultra HD',
    detections: [
      { label: 'Traffic Flow', box: [150, 100, 140, 70], confidence: 0.93 }
    ]
  },
  {
    id: 'CAM04',
    number: 'Camera 04',
    name: 'Hospital Road',
    locationName: 'Hospital Road',
    status: 'ONLINE',
    hasIncident: false,
    streamFps: 30,
    resolution: '1080p 60fps',
    detections: [
      { label: 'Ambulance Entry', box: [100, 90, 110, 60], confidence: 0.98 }
    ]
  },
  {
    id: 'CAM05',
    number: 'Camera 05',
    name: 'Railway Station',
    locationName: 'Railway Station',
    status: 'ONLINE',
    hasIncident: false,
    streamFps: 30,
    resolution: '4K Ultra HD',
    detections: [
      { label: 'Terminal Entry', box: [90, 70, 130, 80], confidence: 0.92 }
    ]
  },
  {
    id: 'CAM06',
    number: 'Camera 06',
    name: 'Market Area',
    locationName: 'Market Area',
    status: 'ONLINE',
    hasIncident: false,
    streamFps: 30,
    resolution: '1080p 60fps',
    detections: [
      { label: 'Vendor Density', box: [140, 110, 150, 70], confidence: 0.88 }
    ]
  },
  {
    id: 'CAM07',
    number: 'Camera 07',
    name: 'Highway',
    locationName: 'Highway',
    status: 'ONLINE',
    hasIncident: false,
    incidentType: 'Road Collision / Obstruction',
    aiConfidence: 0.96,
    streamFps: 30,
    resolution: '4K Ultra HD',
    detections: [
      { label: 'CRASH HAZARD', box: [160, 90, 120, 80], confidence: 0.96 },
      { label: 'Debris Field', box: [290, 130, 60, 40], confidence: 0.91 }
    ]
  },
  {
    id: 'CAM08',
    number: 'Camera 08',
    name: 'Residential Area',
    locationName: 'Residential Area',
    status: 'ONLINE',
    hasIncident: false,
    streamFps: 30,
    resolution: '1080p 60fps',
    detections: [
      { label: 'Clear Sector', box: [100, 100, 100, 60], confidence: 0.95 }
    ]
  }
];

// 42 Registered fleet vehicles
export const INITIAL_VEHICLES: Vehicle[] = [
  {
    id: 'AMB102',
    type: 'Ambulance',
    regNumber: 'TN-45-XX-1234',
    organization: 'City Hospital',
    status: 'Available',
    currentLocationName: 'City Hospital Hub',
    coords: { x: 720, y: 210, lat: 10.8080, lng: 78.6910 },
    speedKmh: 45,
    equipment: ['Advanced Life Support (ALS)', 'Defibrillator', 'Ventilator', 'ECG Monitor', 'Oxygen Kit'],
    driverName: 'K. Senthil Nathan',
    contactNumber: '+91 98421-55012'
  },
  {
    id: 'AMB105',
    type: 'Ambulance',
    regNumber: 'TN-45-AB-5678',
    organization: 'Apollo Emergency Trauma',
    status: 'Available',
    currentLocationName: 'Apollo Hub',
    coords: { x: 590, y: 300, lat: 10.8010, lng: 78.6990 },
    speedKmh: 48,
    equipment: ['Critical Care ICU Kit', 'Telemetry Monitor', 'Suction Unit', 'Spine Board'],
    driverName: 'M. Vignesh Kumar',
    contactNumber: '+91 94432-88190'
  },
  {
    id: 'AMB108',
    type: 'Ambulance',
    regNumber: 'TN-45-CD-9012',
    organization: 'Govt Medical College',
    status: 'Available',
    currentLocationName: 'Govt Medical College',
    coords: { x: 810, y: 190, lat: 10.8240, lng: 78.7170 },
    speedKmh: 52,
    equipment: ['Trauma Responder Unit', 'Stretcher Lift', 'ALS Monitor'],
    driverName: 'R. Baskaran',
    contactNumber: '+91 97891-23450'
  },
  {
    id: 'AMB112',
    type: 'Ambulance',
    regNumber: 'TN-45-EF-3456',
    organization: 'Kauvery Emergency Unit',
    status: 'On Duty',
    currentLocationName: 'Cantonment Patrol',
    coords: { x: 420, y: 460, lat: 10.8010, lng: 78.6790 },
    speedKmh: 40,
    equipment: ['Basic Life Support (BLS)', 'Automated Defibrillator'],
    driverName: 'S. Anthony Raj',
    contactNumber: '+91 98940-11223'
  },
  {
    id: 'POL045',
    type: 'Police',
    regNumber: 'TN-45-G-0100',
    organization: 'Trichy Central Police Station',
    status: 'Available',
    currentLocationName: 'Main Road Cross',
    coords: { x: 500, y: 380, lat: 10.7890, lng: 78.7020 },
    speedKmh: 55,
    equipment: ['First Responder Tactical Kit', 'Breathalyzer', 'Traffic Cones', 'Crowd Barrier'],
    driverName: 'SI R. Prakash',
    contactNumber: '+91 94440-99881'
  },
  {
    id: 'POL052',
    type: 'Police',
    regNumber: 'TN-45-G-0214',
    organization: 'Junction Traffic Division',
    status: 'On Duty',
    currentLocationName: 'Junction Booth',
    coords: { x: 310, y: 490, lat: 10.7932, lng: 78.6854 },
    speedKmh: 50,
    equipment: ['Radar Gun', 'Emergency Light Bar', 'Public Address Siren'],
    driverName: 'HC T. Murugan',
    contactNumber: '+91 94440-99882'
  },
  {
    id: 'FIR012',
    type: 'Fire Engine',
    regNumber: 'TN-45-F-0012',
    organization: 'Trichy Central Fire HQ',
    status: 'Available',
    currentLocationName: 'Cantonment Fire Station',
    coords: { x: 440, y: 410, lat: 10.8050, lng: 78.6820 },
    speedKmh: 42,
    equipment: ['High-Pressure Water Cannon (4500L)', 'Hydraulic Cutter', 'Foam Extinguisher', 'Thermal Imager'],
    driverName: 'Chief Officer G. Natarajan',
    contactNumber: '+91 94421-00101'
  },
  {
    id: 'FIR018',
    type: 'Fire Engine',
    regNumber: 'TN-45-F-0018',
    organization: 'Ponmalai Fire Substation',
    status: 'On Duty',
    currentLocationName: 'Industrial Sector',
    coords: { x: 760, y: 320, lat: 10.7820, lng: 78.7250 },
    speedKmh: 38,
    equipment: ['Ladder Tender (32m)', 'Breathing Apparatus (SCBA)', 'Chemical Hazmat Gear'],
    driverName: 'S. Veeramani',
    contactNumber: '+91 94421-00102'
  },
  {
    id: 'RES008',
    type: 'Emergency Jeep',
    regNumber: 'TN-45-RJ-0008',
    organization: 'State Disaster Response Force (SDRF)',
    status: 'Available',
    currentLocationName: 'Bus Stand Outpost',
    coords: { x: 370, y: 430, lat: 10.7980, lng: 78.6910 },
    speedKmh: 60,
    equipment: ['4x4 Offroad Winch', 'Inflatable Boat', 'Heavy Duty Chainsaw', 'Flood Lights'],
    driverName: 'J. Daniel',
    contactNumber: '+91 96001-44332'
  },
  {
    id: 'RES014',
    type: 'Emergency Jeep',
    regNumber: 'TN-45-RJ-0014',
    organization: 'Quick Disaster Rescue Team',
    status: 'On Duty',
    currentLocationName: 'Bypass Patrol',
    coords: { x: 620, y: 220, lat: 10.8140, lng: 78.7080 },
    speedKmh: 58,
    equipment: ['High-Terrain Suspension', 'Search Satellite Beacon', 'Triage Medical Kit'],
    driverName: 'M. Anand',
    contactNumber: '+91 96001-44333'
  },
  // Fleet expansion to total 42 vehicles
  ...Array.from({ length: 32 }, (_, i) => {
    const idx = i + 1;
    const types: ('Ambulance' | 'Police' | 'Fire Engine' | 'Emergency Jeep')[] = [
      'Ambulance', 'Ambulance', 'Police', 'Police', 'Fire Engine', 'Emergency Jeep', 'Ambulance', 'Police'
    ];
    const type = types[i % types.length];
    const prefixes = {
      'Ambulance': 'AMB',
      'Police': 'POL',
      'Fire Engine': 'FIR',
      'Emergency Jeep': 'RES'
    };
    const prefix = prefixes[type];
    const num = 120 + idx;
    const statuses: ('Available' | 'On Duty' | 'Emergency Response' | 'Offline')[] = [
      'Available', 'Available', 'On Duty', 'Available', 'On Duty', 'Emergency Response', 'Available', 'Offline'
    ];
    const status = statuses[i % statuses.length];
    
    return {
      id: `${prefix}${num}`,
      type,
      regNumber: `TN-45-${String.fromCharCode(65 + (i % 26))}${String.fromCharCode(65 + ((i + 3) % 26))}-${1000 + idx}`,
      organization: type === 'Ambulance' ? 'District Medical Fleet' : type === 'Police' ? 'City Traffic & Patrol' : type === 'Fire Engine' ? 'Fire & Rescue Dept' : 'Disaster Management Unit',
      status,
      currentLocationName: Object.keys(CITY_LANDMARKS)[i % Object.keys(CITY_LANDMARKS).length],
      coords: {
        x: 200 + ((i * 55) % 650),
        y: 150 + ((i * 45) % 450),
        lat: 10.7800 + ((i * 0.003) % 0.045),
        lng: 78.6700 + ((i * 0.003) % 0.045)
      },
      speedKmh: 45 + (i % 15),
      equipment: ['Standard Emergency Kit', 'GPS Telemetry Node', 'Wireless VHF Comms'],
      driverName: `Officer Unit #${num}`,
      contactNumber: `+91 98400-${20000 + num}`
    } as Vehicle;
  })
];

export const INITIAL_AI_INCIDENTS: AIIncident[] = [
  {
    id: 'INC5021',
    type: 'Road Accident',
    location: 'Highway Junction (NH-45)',
    locationCoords: CITY_LANDMARKS['Highway'],
    source: 'CCTV Camera 07',
    timestamp: '19:42:15',
    severity: 'HIGH',
    recommendedResponse: 'Ambulance + Police',
    autoDispatched: true,
    status: 'DISPATCHED',
    assignedVehicleId: 'AMB108',
    confidenceScore: 0.96
  },
  {
    id: 'INC5022',
    type: 'Fire Smoke Detected',
    location: 'Gandhi Market Area',
    locationCoords: CITY_LANDMARKS['Market Area'],
    source: 'Thermal Sensor Hub 03',
    timestamp: '19:35:40',
    severity: 'CRITICAL',
    recommendedResponse: 'Fire Engine + Rescue Jeep',
    autoDispatched: true,
    status: 'DISPATCHED',
    assignedVehicleId: 'FIR012',
    confidenceScore: 0.98
  },
  {
    id: 'INC5023',
    type: 'Road Blockage / Congestion',
    location: 'Railway Junction Cross',
    locationCoords: CITY_LANDMARKS['Junction'],
    source: 'CCTV Camera 03',
    timestamp: '19:28:10',
    severity: 'MEDIUM',
    recommendedResponse: 'Traffic Police Unit',
    autoDispatched: false,
    status: 'DETECTED',
    confidenceScore: 0.89
  },
  {
    id: 'INC5024',
    type: 'Crowd Surge Alert',
    location: 'Central Bus Stand Concourse',
    locationCoords: CITY_LANDMARKS['Bus Stand'],
    source: 'CCTV Camera 02 AI Stream',
    timestamp: '19:15:22',
    severity: 'LOW',
    recommendedResponse: 'Patrol Police Notification',
    autoDispatched: false,
    status: 'RESOLVED',
    confidenceScore: 0.84
  }
];

export const INITIAL_ALERT_LOGS: AlertLog[] = [
  {
    id: 'LOG101',
    timestamp: '19:45:12',
    level: 'CRITICAL',
    message: 'Road accident detected by AI at Highway Junction (NH-45). Automatic response triggered.',
    relatedId: 'INC5021',
    category: 'AI_DETECTION'
  },
  {
    id: 'LOG102',
    timestamp: '19:44:58',
    level: 'HIGH',
    message: 'Ambulance AMB102 auto-assigned and dispatched to Main Road sector.',
    relatedId: 'EMG2048',
    category: 'DISPATCH'
  },
  {
    id: 'LOG103',
    timestamp: '19:44:55',
    level: 'TRAFFIC',
    message: 'Traffic police notified – Trichy Main Road Traffic Booth priority green corridor requested.',
    relatedId: 'CP01',
    category: 'POLICE'
  },
  {
    id: 'LOG104',
    timestamp: '19:40:22',
    level: 'RESOLVED',
    message: 'Emergency EMG2040 completed – Patient successfully delivered to City Hospital.',
    relatedId: 'EMG2040',
    category: 'STATUS_CHANGE'
  },
  {
    id: 'LOG105',
    timestamp: '19:35:10',
    level: 'INFO',
    message: 'All 8 CCTV camera feeds operating at optimal 4K/1080p AI streaming state.',
    category: 'SYSTEM'
  }
];

export const FIRST_AID_GUIDES_EN: Record<string, FirstAidTopic> = {
  'Bone Injury': {
    id: 'bone_injury',
    title: 'Possible Bone Injury',
    icon: '🦴',
    summary: 'Suspected bone fracture or joint dislocation',
    steps: [
      'Keep the injured area as still as possible.',
      'Do not unnecessarily move the injured person.',
      'If safe and appropriate, support the injured area with a suitable rigid object or folded cloth.',
      'Apply an ice pack wrapped in a cloth to reduce swelling if available (do not place ice directly on bare skin).',
      'Wait for medical professionals and keep the patient calm and warm.',
      'Follow emergency-service instructions provided on this screen.'
    ],
    doNots: [
      'DO NOT try to straighten or push a deformed bone back into place.',
      'DO NOT move the person if a spinal or neck injury is suspected.',
      'DO NOT give food or drink if surgery may be required.'
    ],
    disclaimer: 'This information is basic emergency guidance and does not replace professional medical care.'
  },
  'Road Accident': {
    id: 'road_accident',
    title: 'Road Accident Trauma',
    icon: '🚗',
    summary: 'Vehicular collision or pedestrian injury',
    steps: [
      'Ensure scene safety before approaching—watch for oncoming traffic, fuel leaks, or electrical hazards.',
      'Turn on hazard lights and alert surrounding motorists.',
      'Check if the victim is conscious and breathing.',
      'If bleeding, apply firm direct pressure using a clean cloth or sterile bandage.',
      'Do not move the victim unless there is an immediate danger of explosion or fire.',
      'Keep the patient still and reassure them that ambulance dispatch is in progress.'
    ],
    doNots: [
      'DO NOT remove a motorcyclist’s helmet unless they cannot breathe.',
      'DO NOT move the neck or back.',
      'DO NOT give liquids or medications to an unconscious person.'
    ],
    disclaimer: 'This information is basic emergency guidance and does not replace professional medical care.'
  },
  'Chest Pain': {
    id: 'chest_pain',
    title: 'Chest Pain / Possible Cardiac Event',
    icon: '❤️',
    summary: 'Crushing chest tightness, pain radiating to left arm/jaw, shortness of breath',
    steps: [
      'Have the person sit down immediately in a comfortable semi-upright position (knees bent, back supported).',
      'Loosen any tight clothing around the neck, chest, and waist.',
      'Encourage slow, calm breaths to reduce oxygen demand.',
      'If the patient has prescribed emergency medication (such as Nitroglycerin / Sorbitrate), help them take it as prescribed.',
      'Stay with the person continuously until the ambulance arrives.',
      'If the person loses consciousness and stops breathing, be prepared to begin CPR (chest compressions).'
    ],
    doNots: [
      'DO NOT allow the person to walk, drive, or exert themselves.',
      'DO NOT ignore mild or intermittent chest pain.',
      'DO NOT delay calling for emergency assistance.'
    ],
    disclaimer: 'This information is basic emergency guidance and does not replace professional medical care.'
  },
  'Breathing Difficulty': {
    id: 'breathing_difficulty',
    title: 'Severe Breathing Difficulty / Asthma / Choking',
    icon: '🫁',
    summary: 'Struggling to breathe, wheezing, choking, or blue lips/fingertips',
    steps: [
      'Help the person sit upright and lean slightly forward to ease chest expansion.',
      'Ensure open airflow—clear crowded areas and open nearby windows.',
      'If the person has an asthma inhaler or prescribed spacer, help them use it immediately.',
      'If choking (unable to speak/cough), perform 5 back blows followed by 5 abdominal thrusts (Heimlich maneuver).',
      'Reassure the person and guide them to take slow, controlled breaths.',
      'Monitor consciousness until the paramedics arrive.'
    ],
    doNots: [
      'DO NOT make the person lie flat on their back.',
      'DO NOT put fingers blindly into the mouth if choking unless an object is clearly visible.'
    ],
    disclaimer: 'This information is basic emergency guidance and does not replace professional medical care.'
  },
  'Burn': {
    id: 'burn',
    title: 'Thermal / Chemical Burn',
    icon: '🔥',
    summary: 'Heat burns, scalds, or chemical exposure',
    steps: [
      'Immediately cool the burn under gentle running tap water for at least 10–20 minutes.',
      'Gently remove rings, watches, or loose clothing near the burn before swelling starts.',
      'Cover the burned area loosely with clean, non-stick cling film or a sterile dressing.',
      'Keep the person warm with a blanket on uninjured areas to prevent shock.',
      'Sit or elevate the burned area above heart level if possible to reduce swelling.'
    ],
    doNots: [
      'DO NOT apply ice, ice water, butter, oil, or toothpaste to burns.',
      'DO NOT pop or puncture blisters.',
      'DO NOT forcefully pull away clothing stuck to charred skin.'
    ],
    disclaimer: 'This information is basic emergency guidance and does not replace professional medical care.'
  },
  'Bleeding': {
    id: 'bleeding',
    title: 'Severe Bleeding / Deep Laceration',
    icon: '🩸',
    summary: 'Heavy continuous blood flow or arterial spurting',
    steps: [
      'Apply firm, continuous direct pressure on the wound using a clean cloth, towel, or sterile pad.',
      'Maintain continuous pressure for at least 5–10 minutes without lifting the cloth to peek.',
      'If blood soaks through, add another cloth on top without removing the first one.',
      'Elevate the injured limb above heart level if there are no suspected fractures.',
      'Keep the person lying down and covered to prevent shock.',
      'Paramedics are equipped with pressure dressings and hemostatic agents.'
    ],
    doNots: [
      'DO NOT remove embedded objects (like glass or knives)—apply pressure around the object instead.',
      'DO NOT apply a makeshift tourniquet unless you are professionally trained.'
    ],
    disclaimer: 'This information is basic emergency guidance and does not replace professional medical care.'
  },
  'Fall / Injury': {
    id: 'fall_injury',
    title: 'Fall from Height / Blunt Head Trauma',
    icon: '⚠️',
    summary: 'High-impact fall, dizziness, confusion, or contusions',
    steps: [
      'Do not move the injured person unless they are in immediate hazard.',
      'Keep their head, neck, and spine aligned in a neutral straight position.',
      'Check for responsiveness, pupil equality, and any fluid coming from the ears/nose.',
      'If bleeding from a scalp wound, apply gentle pressure with a clean cloth.',
      'Reassure the person and instruct them not to twist their neck.',
      'Wait for paramedics who will apply a rigid cervical collar and spinal backboard.'
    ],
    doNots: [
      'DO NOT move or shake the person.',
      'DO NOT let the person fall asleep if they are experiencing concussion symptoms.'
    ],
    disclaimer: 'This information is basic emergency guidance and does not replace professional medical care.'
  },
  'Other Emergency': {
    id: 'other_emergency',
    title: 'General Acute Emergency Guidance',
    icon: '🚨',
    summary: 'Unspecified trauma, fainting, or acute medical distress',
    steps: [
      'Ensure the surrounding area is safe for both you and the victim.',
      'Keep the patient calm, resting comfortably, and conscious.',
      'Check airway, breathing, and pulse continually.',
      'If the person is unconscious but breathing normally, place them in the recovery position on their side.',
      'Note any symptoms, allergies, or medications to tell the responding medical crew.',
      'Stay on this screen to track the real-time arrival of your assigned emergency vehicle.'
    ],
    doNots: [
      'DO NOT administer food, drinks, or oral medications to an incapacitated person.',
      'DO NOT leave the victim unattended.'
    ],
    disclaimer: 'This information is basic emergency guidance and does not replace professional medical care.'
  }
};

export const FIRST_AID_GUIDES_TA: Record<string, FirstAidTopic> = {
  'Bone Injury': {
    id: 'bone_injury',
    title: 'சாத்தியமான எலும்பு காயம்',
    icon: '🦴',
    summary: 'எலும்பு முறிவு அல்லது மூட்டு நெகிழ்வு சந்தேகிக்கப்படுகிறது',
    steps: [
      'காயமடைந்த பகுதியை முடிந்தவரை அசையாமல் வையுங்கள்.',
      'காயமடைந்த நபரை தேவையின்றி நகர்த்த வேண்டாம்.',
      'பாதுகாப்பாகவும் பொருத்தமாகவும் இருந்தால், திடமான பொருள் அல்லது மடிந்த துணியால் காயமடைந்த பகுதியை ஆதரிக்கவும்.',
      'கிடைத்தால் வீக்கத்தைக் குறைக்க துணியில் சுற்றிய பனிக்கட்டியை பயன்படுத்தவும் (பனிக்கட்டியை நேரடியாக தோலில் வைக்க வேண்டாம்).',
      'மருத்துவ நிபுணர்களுக்காக காத்திருங்கள் மற்றும் நோயாளியை அமைதியாகவும் சூடாகவும் வையுங்கள்.',
      'இந்த திரையில் வழங்கப்பட்ட அவசர சேவை வழிமுறைகளைப் பின்பற்றவும்.'
    ],
    doNots: [
      'உருமாறிய எலும்பை நேராக்க அல்லது இடத்திற்குத் தள்ள முயற்சிக்க வேண்டாம்.',
      'முதுகெலும்பு அல்லது கழுத்து காயம் சந்தேகிக்கப்பட்டால் நபரை நகர்த்த வேண்டாம்.',
      'அறுவை சிகிச்சை தேவைப்படலாம் என்றால் உணவு அல்லது பானம் கொடுக்க வேண்டாம்.'
    ],
    disclaimer: 'இந்த தகவல் அடிப்படை அவசர வழிகாட்டுதல் மற்றும் தொழில்முறை மருத்துவ பராமரிப்பிற்கு மாற்றாக இல்லை.'
  },
  'Road Accident': {
    id: 'road_accident',
    title: 'சாலை விபத்து அதிர்ச்சி',
    icon: '🚗',
    summary: 'வாகன மோதல் அல்லது பாதசாரி காயம்',
    steps: [
      'நெருங்குவதற்கு முன் இடத்தின் பாதுகாப்பை உறுதி செய்யவும்—வரும் போக்குவரத்து, எரிபொருள் கசிவு அல்லது மின் ஆபத்துகளை கவனியுங்கள்.',
      'அபாய விளக்குகளை இயக்கி சுற்றியுள்ள வாகன ஓட்டிகளை எச்சரிக்கவும்.',
      'பாதிக்கப்பட்டவர் நினைவுடன் இருக்கிறாரா, சுவாசிக்கிறாரா எனச் சரிபார்க்கவும்.',
      'இரத்தப்போக்கு இருந்தால், சுத்தமான துணி அல்லது கிருமிநீக்கம் செய்யப்பட்ட கட்டுத்துணியால் உறுதியான நேரடி அழுத்தம் கொடுங்கள்.',
      'வெடிப்பு அல்லது தீ ஆபத்து உடனடியாக இல்லாவிட்டால் பாதிக்கப்பட்டவரை நகர்த்த வேண்டாம்.',
      'நோயாளியை அசையாமல் வைத்து, ஆம்புலன்ஸ் அனுப்பப்படுகிறது என்று உறுதியளியுங்கள்.'
    ],
    doNots: [
      'மோட்டார் சைக்கிள் ஓட்டுநரின் ஹெல்மெட்டை அவர் சுவாசிக்க முடியாத நிலையிலன்றி அகற்ற வேண்டாம்.',
      'கழுத்து அல்லது முதுகை நகர்த்த வேண்டாம்.',
      'நினைவற்ற நபருக்கு திரவங்கள் அல்லது மருந்துகள் கொடுக்க வேண்டாம்.'
    ],
    disclaimer: 'இந்த தகவல் அடிப்படை அவசர வழிகாட்டுதல் மற்றும் தொழில்முறை மருத்துவ பராமரிப்பிற்கு மாற்றாக இல்லை.'
  },
  'Chest Pain': {
    id: 'chest_pain',
    title: 'மார்பு வலி / சாத்தியமான இதய நிகழ்வு',
    icon: '❤️',
    summary: 'இறுக்கமான மார்பு வலி, இடது கை/தாடைக்கு பரவும் வலி, மூச்சுத் திணறல்',
    steps: [
      'நபரை உடனடியாக வசதியான அரை-நிமிர்ந்த நிலையில் (முழங்கால்கள் மடிந்து, முதுகுக்கு ஆதரவுடன்) உட்காரச் செய்யுங்கள்.',
      'கழுத்து, மார்பு மற்றும் இடுப்பைச் சுற்றியுள்ள இறுக்கமான ஆடைகளை தளர்த்துங்கள்.',
      'ஆக்ஸிஜன் தேவையைக் குறைக்க மெதுவான, அமைதியான சுவாசத்தை ஊக்குவிக்கவும்.',
      'நோயாளியிடம் பரிந்துரைக்கப்பட்ட அவசர மருந்து (நைட்ரோகிளிசரின் / சார்பிட்ரேட் போன்றவை) இருந்தால், பரிந்துரைக்கப்பட்டபடி எடுக்க உதவுங்கள்.',
      'ஆம்புலன்ஸ் வரும் வரை நபருடன் தொடர்ந்து இருங்கள்.',
      'நபர் நினைவிழந்து சுவாசிப்பதை நிறுத்தினால், CPR (மார்பு அழுத்தங்கள்) தொடங்க தயாராக இருங்கள்.'
    ],
    doNots: [
      'நபரை நடக்கவோ, ஓட்டவோ, உடல் உழைப்பு செய்யவோ அனுமதிக்க வேண்டாம்.',
      'லேசான அல்லது இடைவிடாத மார்பு வலியை புறக்கணிக்க வேண்டாம்.',
      'அவசர உதவிக்கு அழைப்பதை தாமதப்படுத்த வேண்டாம்.'
    ],
    disclaimer: 'இந்த தகவல் அடிப்படை அவசர வழிகாட்டுதல் மற்றும் தொழில்முறை மருத்துவ பராமரிப்பிற்கு மாற்றாக இல்லை.'
  },
  'Breathing Difficulty': {
    id: 'breathing_difficulty',
    title: 'கடுமையான சுவாசச் சிரமம் / ஆஸ்துமா / மூச்சுத் திணறல்',
    icon: '🫁',
    summary: 'சுவாசிக்க சிரமம், விசில் சப்தம், மூச்சுத் திணறல், அல்லது நீல உதடுகள்/விரல் நுனிகள்',
    steps: [
      'நபரை நிமிர்ந்து உட்கார வைத்து, மார்பு விரிவாக்கத்திற்கு உதவ சற்று முன்னோக்கி சாய்க்கச் செய்யுங்கள்.',
      'திறந்த காற்றோட்டத்தை உறுதி செய்யுங்கள்—கூட்டமான இடங்களை காலி செய்து அருகிலுள்ள ஜன்னல்களைத் திறக்கவும்.',
      'நபரிடம் ஆஸ்துமா இன்ஹேலர் அல்லது பரிந்துரைக்கப்பட்ட ஸ்பேசர் இருந்தால், உடனடியாக அதைப் பயன்படுத்த உதவுங்கள்.',
      'மூச்சுத் திணறல் (பேச/இருமல் முடியாதவர்) இருந்தால், 5 முதுகு அடிகள் தொடர்ந்து 5 வயிற்று அழுத்தங்கள் (ஹெய்ம்லிக் நடவடிக்கை) செய்யுங்கள்.',
      'நபருக்கு உறுதியளித்து மெதுவான, கட்டுப்படுத்தப்பட்ட சுவாசத்தை எடுக்க வழிகாட்டுங்கள்.',
      'பராமெடிக்குகள் வரும் வரை நினைவுநிலையை கண்காணிக்கவும்.'
    ],
    doNots: [
      'நபரை முதுகில் நிமிர்ந்து படுக்க வைக்க வேண்டாம்.',
      'ஒரு பொருள் தெளிவாகத் தெரியாத வரை மூச்சுத் திணறலில் விரல்களை வாயில் குருடாக செருக வேண்டாம்.'
    ],
    disclaimer: 'இந்த தகவல் அடிப்படை அவசர வழிகாட்டுதல் மற்றும் தொழில்முறை மருத்துவ பராமரிப்பிற்கு மாற்றாக இல்லை.'
  },
  'Burn': {
    id: 'burn',
    title: 'வெப்ப / இரசாயன தீக்காயம்',
    icon: '🔥',
    summary: 'வெப்ப தீக்காயங்கள், கொதிநீர் காயங்கள் அல்லது இரசாயன வெளிப்பாடு',
    steps: [
      'தீக்காயத்தை குறைந்தது 10–20 நிமிடங்களுக்கு மெதுவாக ஓடும் குழாய் நீரில் உடனடியாக குளிர்விக்கவும்.',
      'வீக்கம் தொடங்குவதற்கு முன் தீக்காயத்திற்கு அருகில் உள்ள மோதிரங்கள், கடிகாரங்கள் அல்லது தளர்வான ஆடைகளை மெதுவாக அகற்றவும்.',
      'தீக்காயமடைந்த பகுதியை சுத்தமான, ஒட்டாத க்ளிங் ஃபிலிம் அல்லது கிருமிநீக்கம் செய்யப்பட்ட கட்டுத்துணியால் தளர்வாக மூடுங்கள்.',
      'அதிர்ச்சியைத் தடுக்க காயமடையாத பகுதிகளில் போர்வையுடன் நபரை சூடாக வையுங்கள்.',
      'வீக்கத்தைக் குறைக்க முடிந்தால் தீக்காயமடைந்த பகுதியை இதயத்திற்கு மேல் உயர்த்தி வையுங்கள்.'
    ],
    doNots: [
      'தீக்காயங்களுக்கு பனிக்கட்டி, பனிக்கட்டி நீர், வெண்ணெய், எண்ணெய் அல்லது பற்பசை தடவ வேண்டாம்.',
      'கொப்புளங்களை உடைக்க அல்லது குத்த வேண்டாம்.',
      'கருகிய தோலில் ஒட்டிய ஆடையை பலவந்தமாக இழுக்க வேண்டாம்.'
    ],
    disclaimer: 'இந்த தகவல் அடிப்படை அவசர வழிகாட்டுதல் மற்றும் தொழில்முறை மருத்துவ பராமரிப்பிற்கு மாற்றாக இல்லை.'
  },
  'Bleeding': {
    id: 'bleeding',
    title: 'கடுமையான இரத்தப்போக்கு / ஆழமான காயம்',
    icon: '🩸',
    summary: 'அதிக தொடர்ச்சியான இரத்த ஓட்டம் அல்லது தமனி பீச்சுதல்',
    steps: [
      'சுத்தமான துணி, துண்டு அல்லது கிருமிநீக்கம் செய்யப்பட்ட திண்டு பயன்படுத்தி காயத்தின் மீது உறுதியான, தொடர்ச்சியான நேரடி அழுத்தம் கொடுங்கள்.',
      'துணியைத் தூக்கி பார்க்காமல் குறைந்தது 5–10 நிமிடங்களுக்கு தொடர்ச்சியான அழுத்தத்தை பராமரிக்கவும்.',
      'இரத்தம் ஊடுருவினால், முதல் துணியை அகற்றாமல் அதன் மேல் மற்றொரு துணியைச் சேர்க்கவும்.',
      'எலும்பு முறிவு சந்தேகிக்கப்படவில்லை எனில், காயமடைந்த உறுப்பை இதயத்திற்கு மேல் உயர்த்தவும்.',
      'அதிர்ச்சியைத் தடுக்க நபரை படுக்க வைத்து மூடுங்கள்.',
      'பராமெடிக்குகள் அழுத்த கட்டுகள் மற்றும் ஹீமோஸ்டேடிக் முகவர்களுடன் தயாராக உள்ளனர்.'
    ],
    doNots: [
      'உட்பொதிந்த பொருட்களை (கண்ணாடி அல்லது கத்தி போன்றவை) அகற்ற வேண்டாம்—அதற்கு பதிலாக பொருளைச் சுற்றி அழுத்தம் கொடுங்கள்.',
      'தொழில்முறை பயிற்சி இல்லாவிட்டால் தற்காலிக டோர்னிக்கெட் பயன்படுத்த வேண்டாம்.'
    ],
    disclaimer: 'இந்த தகவல் அடிப்படை அவசர வழிகாட்டுதல் மற்றும் தொழில்முறை மருத்துவ பராமரிப்பிற்கு மாற்றாக இல்லை.'
  },
  'Fall / Injury': {
    id: 'fall_injury',
    title: 'உயரத்திலிருந்து விழுதல் / மொத்த தலை காயம்',
    icon: '⚠️',
    summary: 'அதிக தாக்க விழுதல், தலைச்சுற்றல், குழப்பம் அல்லது காயங்கள்',
    steps: [
      'காயமடைந்த நபருக்கு உடனடி ஆபத்து இல்லாவிட்டால் அவரை நகர்த்த வேண்டாம்.',
      'அவர்களின் தலை, கழுத்து மற்றும் முதுகெலும்பை நடுநிலையான நேர் நிலையில் சீரமைத்து வையுங்கள்.',
      'பதிலளிக்கும் தன்மை, கண் பாவை சமநிலை மற்றும் காது/மூக்கிலிருந்து திரவம் வருகிறதா எனச் சரிபார்க்கவும்.',
      'தலைப் புற்றுக் காயத்திலிருந்து இரத்தப்போக்கு இருந்தால், சுத்தமான துணியால் மெதுவான அழுத்தம் கொடுங்கள்.',
      'நபருக்கு உறுதியளித்து, கழுத்தை திருப்ப வேண்டாம் என அறிவுறுத்துங்கள்.',
      'திடமான கழுத்து காலர் மற்றும் முதுகெலும்பு பலகையை பயன்படுத்தும் பராமெடிக்குகளுக்காக காத்திருங்கள்.'
    ],
    doNots: [
      'நபரை நகர்த்தவோ அசைக்கவோ வேண்டாம்.',
      'மூளையதிர்ச்சி அறிகுறிகள் இருந்தால் நபரை தூங்க அனுமதிக்க வேண்டாம்.'
    ],
    disclaimer: 'இந்த தகவல் அடிப்படை அவசர வழிகாட்டுதல் மற்றும் தொழில்முறை மருத்துவ பராமரிப்பிற்கு மாற்றாக இல்லை.'
  },
  'Other Emergency': {
    id: 'other_emergency',
    title: 'பொதுவான கடுமையான அவசர வழிகாட்டுதல்',
    icon: '🚨',
    summary: 'குறிப்பிடப்படாத காயம், மயக்கம் அல்லது கடுமையான மருத்துவ சிக்கல்',
    steps: [
      'உங்களுக்கும் பாதிக்கப்பட்டவருக்கும் சுற்றியுள்ள இடம் பாதுகாப்பானது என்பதை உறுதி செய்யுங்கள்.',
      'நோயாளியை அமைதியாக, வசதியாக ஓய்வெடுக்க வைத்து, நினைவுடன் வையுங்கள்.',
      'சுவாசப்பாதை, சுவாசம் மற்றும் நாடித்துடிப்பை தொடர்ந்து சரிபார்க்கவும்.',
      'நபர் நினைவற்ற நிலையில் இருந்தாலும் இயல்பாக சுவாசித்தால், அவரை பக்கவாட்டில் மீட்பு நிலையில் வையுங்கள்.',
      'பதிலளிக்கும் மருத்துவக் குழுவிடம் சொல்ல ஏதேனும் அறிகுறிகள், ஒவ்வாமைகள் அல்லது மருந்துகளைக் குறித்து வையுங்கள்.',
      'உங்களுக்கு ஒதுக்கப்பட்ட அவசர வாகனத்தின் நிகழ்நேர வருகையைக் கண்காணிக்க இந்த திரையில் இருங்கள்.'
    ],
    doNots: [
      'இயலாத நிலையில் உள்ள நபருக்கு உணவு, பானம் அல்லது வாய்வழி மருந்துகளை கொடுக்க வேண்டாம்.',
      'பாதிக்கப்பட்டவரை கவனிக்காமல் விட்டுவிட வேண்டாம்.'
    ],
    disclaimer: 'இந்த தகவல் அடிப்படை அவசர வழிகாட்டுதல் மற்றும் தொழில்முறை மருத்துவ பராமரிப்பிற்கு மாற்றாக இல்லை.'
  }
};

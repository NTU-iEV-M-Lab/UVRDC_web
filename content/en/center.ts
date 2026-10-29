import type {CenterTranslation} from '../localization';
import {englishAdvisory} from './advisory';

export const englishCenter:CenterTranslation={
 advisoryMembers:englishAdvisory,
 institution:{
  name:'Unmanned Vehicles Research and Development Center, NTU',
  shortName:'NTU Unmanned Vehicles R&D Center',
  intro:'Integrating interdisciplinary research to advance unmanned vehicle development, professional education, and international collaboration.',
  description:'Established jointly by the College of Engineering, the College of Bioresources and Agriculture, and the College of Electrical Engineering and Computer Science, the Center promotes unmanned vehicle systems research, education and training, industry–academia collaboration, and international exchange through interdisciplinary cooperation.',
 },
 director:{
  name:'Kang Li',englishName:'Kang Li',role:'Director, Unmanned Vehicles Research and Development Center',
  affiliation:'Department of Mechanical Engineering, National Taiwan University',
  education:'Ph.D. in Mechanical Engineering, University of California, Berkeley (2009)',
  background:'Kang Li is an associate professor in the Aerospace and Control System Group of NTU’s Department of Mechanical Engineering and leads the Intelligent Vehicle and Mechatronics Laboratory. He graduated from NTU Mechanical Engineering in 2000, earned his master’s degree in mechanical engineering at the University of California, Berkeley in 2005, and completed his Ph.D. there in 2009. He then conducted postdoctoral research at California PATH, connecting intelligent transportation, vehicle technology, and international academic exchange.',
  interests:['Vehicle Dynamics and Control','Autonomous Driving Perception and Environmental Understanding','Integrated Inertial and Satellite Navigation','UAV Systems and Multi-Vehicle Coordination','Mechatronic Systems Integration and Electric Vehicle Technology'],
  highlight:'In 2023, he took part in the iAuto team, which placed third in the World Autonomous Bus Competition in Dubai. Integrating and testing sensing, localization, planning, and vehicle control in a full-size vehicle connects autonomous driving research with concrete operating conditions and system requirements.',
  experience:[
   {title:'Academic career and international research',paragraphs:['He has taught in NTU’s Department of Mechanical Engineering and led the laboratory since August 2010. Since 2023, he has served as a co-principal investigator of Berkeley DeepDrive at the University of California, Berkeley, participating in international research and exchange on autonomous driving and intelligent vehicles.']},
   {title:'Transportation safety and professional service',paragraphs:['He served as a full-time member of the Taiwan Transportation Safety Board (2019–2023) and an advisory committee member for the NSTC/Ministry of Science and Technology autonomous vehicle program (2019–2023). His experience also includes advisory participation at TTSB and membership of the Ministry of Transportation and Communications’ Autonomous Vehicle Development Strategy Committee.','He served as a board director and chair of the Regulations and Standards Committee at ITS-Taiwan (2021–2023), and as a board director and supervisor of the Taiwan Autonomous Vehicle Association (2020–2022), connecting engineering research, transportation safety, and professional communities.']},
  ],
  resourceLabels:['Laboratory | Complete Director Profile','Department of Mechanical Engineering | Faculty Profile and Career','NTU Scholars | Researcher Profile','College of Engineering | Academic Year 2026–27 Leadership Directory','Department of Mechanical Engineering | 2023 Team Competition Record'],
 },
 facilities:{provider:'Intelligent Vehicle and Mechatronics Laboratory',description:'Most of the Center’s physical equipment currently comes from the Intelligent Vehicle and Mechatronics Laboratory in NTU’s Department of Mechanical Engineering, where it supports vehicle development, system integration, and experimental validation.',areas:['Vehicle Perception and Localization','Flight and Motion Control','Mechatronics and Systems Integration','Simulation and Experimental Validation']},
 colleges:['College of Engineering','College of Bioresources and Agriculture','College of Electrical Engineering and Computer Science'],
 missions:[
  {
    "title": "Applied Research",
    "english": "APPLIED RESEARCH",
    "text": "Integrate research in environmental perception, localization and navigation, motion control, and mechatronic systems to address unmanned vehicle applications. Interdisciplinary collaboration examines the integration of sensor information, decision algorithms, and vehicle dynamics, connecting fundamental research with engineering applications."
  },
  {
    "title": "Education and Training",
    "english": "EDUCATION",
    "text": "Develop complementary piloting and engineering pathways founded on flight principles, operational safety, and systems architecture. Topics include mission operation, vehicle design, and flight control and sensing integration, supported by operational records, measurements, and test reports."
  },
  {
    "title": "Industry–Academia Collaboration",
    "english": "INDUSTRY COLLABORATION",
    "text": "Connect academic expertise with industry requirements to assess collaboration in unmanned vehicle development, systems integration, and validation. Application scenarios and existing system conditions inform research questions, technical scope, milestones, evaluation metrics, and possible applications of research outputs."
  },
  {
    "title": "International Exchange",
    "english": "GLOBAL CONNECTIONS",
    "text": "Support technical exchange through forums, supply-chain workshops, international engineering activities, and academic visits. Existing records cover Taiwan–U.S. technical discussions, Taiwan–Europe collaboration, and exchange with Guam, addressing validation, industry connections, and professional education."
  }
],
 courses:[
  {
    "title": "Common Foundations",
    "text": "Establish foundations in unmanned vehicle flight principles, systems architecture, and mission requirements analysis. Topics cover the functions, data flows, and control interfaces of airframes, propulsion, flight controllers, sensors, and ground stations, alongside operating limits, risk assessment, and preflight checks.",
    "focus": [
      "Functions and connections of the airframe, propulsion, flight controller, sensors, and ground station",
      "Breaking down mission scope, payload, endurance needs, and operating conditions",
      "Regulatory awareness, preflight checks, risk identification, and mission abort conditions"
    ],
    "exercise": "For an inspection scenario, prepare a system block diagram, a requirements table, and a preflight checklist. Explain how each constraint affects design or operational decisions."
  },
  {
    "title": "Piloting and Applications",
    "text": "Develop mission operation, flight-state interpretation, and abnormal-event response skills. Simulation links takeoff, landing, route tracking, waypoint missions, and manual takeover with preflight and postflight checks. Operational records support analysis of route deviations, communications faults, and mission abort decisions.",
    "focus": [
      "Simulated attitude control, takeoff, landing, route following, and manual takeover",
      "Mission settings and operational judgment for waypoints, return, and communications faults",
      "Preflight and postflight checks, operation logs, and incident reporting"
    ],
    "exercise": "Compare repeated simulated flights along one route. Mark deviations, manual interventions, and mission aborts, then identify improvements for the next attempt."
  },
  {
    "title": "Vehicle Design and Mechatronics Integration",
    "text": "Examine the integrated design of mission payloads, structures, propulsion, and power systems. Weight, balance, installation space, and endurance requirements inform design tradeoffs. Component layout, prototype assembly, wiring, and interface testing develop systems integration skills.",
    "focus": [
      "Relationships between payload, weight distribution, center of gravity, and airframe layout",
      "Tradeoffs in propulsion, battery, structure, and sensor selection",
      "Prototype assembly, wiring, power supply, and signal interface checks"
    ],
    "exercise": "Propose a component layout and wiring diagram for a mission. Record assembly checks and interface tests, explaining design choices and limitations that still require validation."
  },
  {
    "title": "Flight Control and Mission Planning",
    "text": "Study attitude, velocity, and position control architectures and mission planning methods. Sensor calibration, flight controller parameters, and waypoint configuration are evaluated using simulated and recorded flight data, including tracking errors, response delays, and oscillation.",
    "focus": [
      "Relationships between attitude, velocity, and position control loops",
      "The logic of sensor calibration, flight controller parameters, and waypoint settings",
      "Interpreting tracking errors, response delays, and oscillation"
    ],
    "exercise": "Compare responses along the same simulated route with different parameter settings. Plot trajectories and errors, and explain both the improvements and tradeoffs."
  },
  {
    "title": "Sensing, Communications, and Ground Stations",
    "text": "Integrate data flows for localization, inertial sensing, imaging, telemetry, and ground station monitoring. Analysis addresses coordinate frames, time synchronization, update rates, and communications quality. Test records support the identification of latency, packet loss, and sensor faults.",
    "focus": [
      "Coordinate frames, timestamps, and update rates in positioning, inertial, and imaging data",
      "Data flows and status monitoring across the vehicle, communications modules, and ground station",
      "Logging and investigating communications loss, data delays, and sensor faults"
    ],
    "exercise": "Draw the data flow from sensors to the ground station. Reproduce a delay or interruption using test data, preserve status logs, and explain the investigation sequence."
  },
  {
    "title": "Application Software and Autonomy",
    "text": "Study software integration for sensor processing, mission-state management, and vehicle control interfaces. Image recognition, mission automation, and autonomous functions are examined through offline data replay, simulation, and repeatable tests for normal and abnormal inputs.",
    "focus": [
      "Connecting sensor processing and recognition outputs with mission decisions",
      "Integrating mission states, software interfaces, and vehicle commands",
      "Offline data replay, simulation, and testing of abnormal scenarios"
    ],
    "exercise": "Build a repeatable mission software module with interface documentation and test data. Compare its responses to normal, missing, and abnormal inputs."
  }
],
 collaborations:[
  {
    "title": "Joint Research and Technology Development",
    "text": "Identify research topics in perception, localization, navigation, and motion control according to application requirements. Technical assessment combines modeling, algorithm development, and experimental data. Positioning reliability in obstructed environments can be examined through sensor quality, synchronization, and estimation methods; tracking errors through vehicle dynamics and control logs. Scope discussions establish research questions, data requirements, baselines, and evaluation metrics.",
    "areas": [
      "Autonomous Vehicles",
      "Perception and Localization",
      "Smart Sensing",
      "Flight and Motion Control"
    ]
  },
  {
    "title": "System Integration and Validation",
    "text": "Examine the integration of sensors, flight controllers, communications, ground stations, and vehicle interfaces, including formats, coordinate transformations, synchronization, and command feedback. System architectures and fault records inform staged validation through replay, simulation, ground integration, and vehicle testing. Possible work includes interface specifications, test procedures, fault tracking, and validation reports, subject to the agreed project scope.",
    "areas": [
      "Mechatronics Integration",
      "Simulation and Field Testing",
      "Test Methods",
      "Prototype Evaluation"
    ]
  },
  {
    "title": "Talent Development and Exchange",
    "text": "Connect engineering projects, technical presentations, and expert review to support exchange among students, researchers, and industry practitioners. Topics may include inspection, localization and navigation, vehicle integration, and test-data analysis. Requirements, configurations, and experimental records support engineering analysis. International activities are developed around shared research interests, complementary expertise, and intended academic and educational outcomes.",
    "areas": [
      "Hands-on Engineering",
      "Industry Needs Exchange",
      "Technical Workshops",
      "International Collaboration"
    ]
  }
],
 media:{
  'assets/center-icon.png':{caption:'Center icon, refined from the user-provided artwork; the wordmark is rendered as HTML text.',alt:'Blue diamond Center icon with sensing arcs.'},
  'assets/platform-amr-concept.webp':{caption:'AMR model illustration | Laboratory introduction, 2024.',alt:'Rendered model of an autonomous mobile robot with a blue-and-white upper body and a wheeled mobile base.'},
  'assets/platform-autonomous-bus.webp':{caption:'Autonomous bus photograph | Laboratory introduction, 2024.',alt:'Photograph of a white autonomous bus with sensors mounted on the roof and front of the vehicle.'},
  'assets/platform-uav-concept.webp':{caption:'UAV type illustration | Laboratory introduction, 2024.',alt:'Illustration of a quadrotor aircraft with four propellers, landing gear, and a camera mounted below the body.'},
  'assets/director-kang-li.webp':{caption:'Photograph of Director Kang Li, provided by the Center.',alt:'Director Kang Li wearing a green jacket outdoors in a snowy landscape.'},
  'assets/facility-avl-front.webp':{"caption":"Front view of the AVL equipment mounting interface and torque transducer arrangement.","alt":"Front view of the AVL test setup, showing the metal mounting plate, central shaft opening, and HBM torque transducer behind it."},
  'assets/facility-avl-side.webp':{"caption":"Side view of the AVL equipment support fixture and measurement interface.","alt":"Side view of the AVL setup, showing the blue equipment body, angle bracket, and measurement interface."},
  'assets/event-pqc-2024-poster.webp':{caption:'Original poster for the November 7, 2024 PQC automotive cybersecurity exchange. The QR code and registration information are historical and do not indicate current registration.',alt:'Historical poster for the PQC automotive cybersecurity exchange, listing November 7, 09:30–12:15, four featured experts, and the Center among the organizers.'},
  'assets/center-logo.png':{caption:'Official logo of the NTU Unmanned Vehicles Research and Development Center.',alt:'NTU Unmanned Vehicles Research and Development Center, Unmanned Vehicles Research and Development Center, NTU.'},
  'assets/facility-uav.webp':{caption:'Indoor quadrotor wind-disturbance control experiment | Intelligent Vehicle and Mechatronics Laboratory research presentation.',alt:'Indoor quadrotor research vehicle and fan setup for control research under wind disturbances and model uncertainty.'},
  'assets/event-ai.webp':{caption:'Group photo at the Taiwan–U.S. AI and semiconductor roundtable, July 30, 2026.',alt:'Participants at the Taiwan–U.S. AI and semiconductor roundtable pose for a group photo on July 30, 2026.'},
  'assets/event-tdth.webp':{caption:'Group photo at the 2026 Taiwan Defense Tech Hackathon.',alt:'Participants at the 2026 Taiwan Defense Tech Hackathon pose at the venue, with the event banner and Center logo displayed in front.'},
  'assets/event-forum-2024-main.webp':{caption:'Venue of the 2024 Taiwan–U.S. International Forum on Unmanned Vehicle Technologies and Applications.',alt:'Proceedings at the 2024 Taiwan–U.S. International Forum on Unmanned Vehicle Technologies and Applications, with attendees facing the speaker and projected event title.'},
  'assets/event-forum-2024-visit.webp':{caption:'Exhibition visit and technical exchange at the 2024 forum.',alt:'Guests at the 2024 forum listen to a technical presentation in an exhibition area displaying unmanned vehicles and systems.'},
  'assets/event-forum-2024-exhibition.webp':{caption:'Unmanned aircraft and technology exhibits by participating organizations at the 2024 forum.',alt:'Forum attendees view a drone, sensors, and technical posters at a company exhibition booth.'},
  'assets/event-forum-2024-vehicles.webp':{caption:'Uncrewed boat and drones displayed by an exhibitor at the 2024 forum.',alt:'An uncrewed boat and several drones on display at Thunder Tiger’s booth at the 2024 forum; these are exhibitor displays.'},
  'assets/event-forum-2024-networking.webp':{caption:'Forum attendees networking at the venue.',alt:'Taiwanese and U.S. academic and industry participants talk in the venue lobby during a break at the 2024 forum.'},
  'assets/event-guam-2026-uog.webp':{caption:'Exchange visit group photo at the University of Guam.',alt:'The Taiwan visiting delegation and University of Guam representatives pose in front of the university emblem.'},
  'assets/event-guam-2026-geda.webp':{caption:'Exchange visit group photo at the Guam Economic Development Authority.',alt:'The visiting delegation and Guam Economic Development Authority representatives pose in front of a Guam Economic Development Authority backdrop.'},
 },
};

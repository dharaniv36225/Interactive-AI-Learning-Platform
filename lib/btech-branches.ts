export type BtechBranchId =
  | "cse"
  | "aiml"
  | "it"
  | "ece"
  | "eee"
  | "mechanical"
  | "civil"
  | "data-science"
  | "cyber-security"
  | "robotics";

export type BtechBranch = {
  id: BtechBranchId;
  shortName: string;
  name: string;
  description: string;
  careerTracks: string[];
};

export const btechBranches: BtechBranch[] = [
  {
    id: "cse",
    shortName: "CSE",
    name: "Computer Science Engineering",
    description: "Programming, systems, data structures, algorithms, software, cloud, and computing theory.",
    careerTracks: ["Software Engineer", "Systems Engineer", "Backend Developer"],
  },
  {
    id: "aiml",
    shortName: "AIML",
    name: "Artificial Intelligence and Machine Learning",
    description: "AI, ML, deep learning, NLP, computer vision, generative AI, and intelligent systems.",
    careerTracks: ["AI Engineer", "ML Engineer", "Applied Scientist"],
  },
  {
    id: "it",
    shortName: "IT",
    name: "Information Technology",
    description: "Web systems, enterprise applications, networking, DevOps, cloud, and platform engineering.",
    careerTracks: ["Full Stack Developer", "Cloud Engineer", "DevOps Engineer"],
  },
  {
    id: "ece",
    shortName: "ECE",
    name: "Electronics and Communication Engineering",
    description: "Electronics, signals, embedded systems, communication, digital logic, and VLSI foundations.",
    careerTracks: ["Embedded Engineer", "Electronics Engineer", "Communication Engineer"],
  },
  {
    id: "eee",
    shortName: "EEE",
    name: "Electrical and Electronics Engineering",
    description: "Electrical circuits, machines, power systems, control systems, transformers, and drives.",
    careerTracks: ["Electrical Engineer", "Power Systems Engineer", "Controls Engineer"],
  },
  {
    id: "mechanical",
    shortName: "ME",
    name: "Mechanical Engineering",
    description: "Mechanics, strength of materials, fluids, thermodynamics, machines, and manufacturing systems.",
    careerTracks: ["Mechanical Design Engineer", "Thermal Engineer", "Manufacturing Engineer"],
  },
  {
    id: "civil",
    shortName: "CE",
    name: "Civil Engineering",
    description: "Surveying, structures, materials, water, transportation, and environmental engineering.",
    careerTracks: ["Structural Engineer", "Site Engineer", "Environmental Engineer"],
  },
  {
    id: "data-science",
    shortName: "DS",
    name: "Data Science",
    description: "Statistics, probability, data analytics, visualization, big data, and decision intelligence.",
    careerTracks: ["Data Scientist", "Analytics Engineer", "BI Developer"],
  },
  {
    id: "cyber-security",
    shortName: "Cyber",
    name: "Cyber Security",
    description: "Security engineering, cryptography, secure networks, threat modeling, and incident response.",
    careerTracks: ["Security Analyst", "Security Engineer", "Cryptography Engineer"],
  },
  {
    id: "robotics",
    shortName: "Robotics",
    name: "Robotics Engineering",
    description: "Sensors, actuators, control, embedded systems, autonomy, perception, and robot motion.",
    careerTracks: ["Robotics Engineer", "Automation Engineer", "Controls Engineer"],
  },
];

const branchById = new Map(btechBranches.map((branch) => [branch.id, branch]));

export function getBtechBranch(branchId: string) {
  return branchById.get(branchId as BtechBranchId);
}

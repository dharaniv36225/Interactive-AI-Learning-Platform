import type { Subject } from "@/types";

export type SubjectLessonMeta = {
  id: string;
  title: string;
};

export type SubjectMeta = {
  id: string;
  name: string;
  accent: Subject["accent"];
  lessonIds: string[];
  lessonCount: number;
  lessons: SubjectLessonMeta[];
};

export const subjectsMeta: SubjectMeta[] = [
  {
    "id": "physics",
    "name": "Physics",
    "accent": "cyan",
    "lessonCount": 5,
    "lessonIds": [
      "physics-gravity-motion",
      "physics-newtons-laws",
      "physics-electricity-circuits",
      "physics-waves-sound",
      "physics-light-optics"
    ],
    "lessons": [
      {
        "id": "physics-gravity-motion",
        "title": "Gravity and Motion"
      },
      {
        "id": "physics-newtons-laws",
        "title": "Newton's Laws"
      },
      {
        "id": "physics-electricity-circuits",
        "title": "Electricity and Circuits"
      },
      {
        "id": "physics-waves-sound",
        "title": "Waves and Sound"
      },
      {
        "id": "physics-light-optics",
        "title": "Light and Optics"
      }
    ]
  },
  {
    "id": "chemistry",
    "name": "Chemistry",
    "accent": "violet",
    "lessonCount": 5,
    "lessonIds": [
      "chemistry-atoms-molecules",
      "chemistry-periodic-table",
      "chemistry-reactions",
      "chemistry-acids-bases",
      "chemistry-organic-basics"
    ],
    "lessons": [
      {
        "id": "chemistry-atoms-molecules",
        "title": "Atoms and Molecules"
      },
      {
        "id": "chemistry-periodic-table",
        "title": "Periodic Table"
      },
      {
        "id": "chemistry-reactions",
        "title": "Chemical Reactions"
      },
      {
        "id": "chemistry-acids-bases",
        "title": "Acids and Bases"
      },
      {
        "id": "chemistry-organic-basics",
        "title": "Organic Chemistry Basics"
      }
    ]
  },
  {
    "id": "biology",
    "name": "Biology",
    "accent": "emerald",
    "lessonCount": 5,
    "lessonIds": [
      "biology-cell-structure",
      "biology-human-systems",
      "biology-genetics",
      "biology-photosynthesis",
      "biology-ecosystems"
    ],
    "lessons": [
      {
        "id": "biology-cell-structure",
        "title": "Cell Structure"
      },
      {
        "id": "biology-human-systems",
        "title": "Human Body Systems"
      },
      {
        "id": "biology-genetics",
        "title": "Genetics"
      },
      {
        "id": "biology-photosynthesis",
        "title": "Photosynthesis"
      },
      {
        "id": "biology-ecosystems",
        "title": "Ecosystems"
      }
    ]
  },
  {
    "id": "mathematics",
    "name": "Mathematics",
    "accent": "amber",
    "lessonCount": 5,
    "lessonIds": [
      "math-algebra",
      "math-geometry",
      "math-trigonometry",
      "math-calculus",
      "math-probability"
    ],
    "lessons": [
      {
        "id": "math-algebra",
        "title": "Algebra"
      },
      {
        "id": "math-geometry",
        "title": "Geometry"
      },
      {
        "id": "math-trigonometry",
        "title": "Trigonometry"
      },
      {
        "id": "math-calculus",
        "title": "Calculus Basics"
      },
      {
        "id": "math-probability",
        "title": "Probability"
      }
    ]
  },
  {
    "id": "computer-science",
    "name": "Computer Science",
    "accent": "cyan",
    "lessonCount": 5,
    "lessonIds": [
      "cs-algorithms",
      "cs-data-structures",
      "cs-databases",
      "cs-operating-systems",
      "cs-networks"
    ],
    "lessons": [
      {
        "id": "cs-algorithms",
        "title": "Algorithms"
      },
      {
        "id": "cs-data-structures",
        "title": "Data Structures"
      },
      {
        "id": "cs-databases",
        "title": "Databases"
      },
      {
        "id": "cs-operating-systems",
        "title": "Operating Systems"
      },
      {
        "id": "cs-networks",
        "title": "Computer Networks"
      }
    ]
  },
  {
    "id": "artificial-intelligence",
    "name": "Artificial Intelligence",
    "accent": "violet",
    "lessonCount": 5,
    "lessonIds": [
      "ai-intelligent-agents",
      "ai-search-planning",
      "ai-knowledge-reasoning",
      "ai-computer-vision",
      "ai-language"
    ],
    "lessons": [
      {
        "id": "ai-intelligent-agents",
        "title": "Intelligent Agents"
      },
      {
        "id": "ai-search-planning",
        "title": "Search and Planning"
      },
      {
        "id": "ai-knowledge-reasoning",
        "title": "Knowledge and Reasoning"
      },
      {
        "id": "ai-computer-vision",
        "title": "Computer Vision"
      },
      {
        "id": "ai-language",
        "title": "Natural Language AI"
      }
    ]
  },
  {
    "id": "machine-learning",
    "name": "Machine Learning",
    "accent": "emerald",
    "lessonCount": 5,
    "lessonIds": [
      "ml-data-features",
      "ml-supervised-learning",
      "ml-neural-networks",
      "ml-evaluation",
      "ml-responsible"
    ],
    "lessons": [
      {
        "id": "ml-data-features",
        "title": "Data and Features"
      },
      {
        "id": "ml-supervised-learning",
        "title": "Supervised Learning"
      },
      {
        "id": "ml-neural-networks",
        "title": "Neural Networks"
      },
      {
        "id": "ml-evaluation",
        "title": "Model Evaluation"
      },
      {
        "id": "ml-responsible",
        "title": "Responsible Machine Learning"
      }
    ]
  },
  {
    "id": "robotics",
    "name": "Robotics",
    "accent": "rose",
    "lessonCount": 5,
    "lessonIds": [
      "robotics-sensors",
      "robotics-actuators",
      "robotics-movement",
      "robotics-control",
      "robotics-autonomous"
    ],
    "lessons": [
      {
        "id": "robotics-sensors",
        "title": "Sensors"
      },
      {
        "id": "robotics-actuators",
        "title": "Actuators"
      },
      {
        "id": "robotics-movement",
        "title": "Robot Movement"
      },
      {
        "id": "robotics-control",
        "title": "Control Systems"
      },
      {
        "id": "robotics-autonomous",
        "title": "Autonomous Robots"
      }
    ]
  },
  {
    "id": "electronics",
    "name": "Electronics",
    "accent": "amber",
    "lessonCount": 5,
    "lessonIds": [
      "electronics-voltage-current",
      "electronics-resistors",
      "electronics-capacitors",
      "electronics-diodes",
      "electronics-transistors"
    ],
    "lessons": [
      {
        "id": "electronics-voltage-current",
        "title": "Voltage and Current"
      },
      {
        "id": "electronics-resistors",
        "title": "Resistors"
      },
      {
        "id": "electronics-capacitors",
        "title": "Capacitors"
      },
      {
        "id": "electronics-diodes",
        "title": "Diodes"
      },
      {
        "id": "electronics-transistors",
        "title": "Transistors"
      }
    ]
  },
  {
    "id": "environmental-science",
    "name": "Environmental Science",
    "accent": "emerald",
    "lessonCount": 5,
    "lessonIds": [
      "environment-climate-change",
      "environment-pollution",
      "environment-renewable-energy",
      "environment-water",
      "environment-biodiversity"
    ],
    "lessons": [
      {
        "id": "environment-climate-change",
        "title": "Climate Change"
      },
      {
        "id": "environment-pollution",
        "title": "Pollution"
      },
      {
        "id": "environment-renewable-energy",
        "title": "Renewable Energy"
      },
      {
        "id": "environment-water",
        "title": "Water Conservation"
      },
      {
        "id": "environment-biodiversity",
        "title": "Biodiversity"
      }
    ]
  },
  {
    "id": "finance",
    "name": "Finance",
    "accent": "violet",
    "lessonCount": 5,
    "lessonIds": [
      "finance-budgeting",
      "finance-saving",
      "finance-investing",
      "finance-interest",
      "finance-risk"
    ],
    "lessons": [
      {
        "id": "finance-budgeting",
        "title": "Budgeting"
      },
      {
        "id": "finance-saving",
        "title": "Saving"
      },
      {
        "id": "finance-investing",
        "title": "Investing Basics"
      },
      {
        "id": "finance-interest",
        "title": "Interest"
      },
      {
        "id": "finance-risk",
        "title": "Risk Management"
      }
    ]
  },
  {
    "id": "agriculture",
    "name": "Agriculture",
    "accent": "rose",
    "lessonCount": 5,
    "lessonIds": [
      "agriculture-soil",
      "agriculture-irrigation",
      "agriculture-rotation",
      "agriculture-fertilizers",
      "agriculture-smart-farming"
    ],
    "lessons": [
      {
        "id": "agriculture-soil",
        "title": "Soil Health"
      },
      {
        "id": "agriculture-irrigation",
        "title": "Irrigation"
      },
      {
        "id": "agriculture-rotation",
        "title": "Crop Rotation"
      },
      {
        "id": "agriculture-fertilizers",
        "title": "Fertilizers"
      },
      {
        "id": "agriculture-smart-farming",
        "title": "Smart Farming"
      }
    ]
  }
];

export const subjectNames = subjectsMeta.map((item) => item.name);

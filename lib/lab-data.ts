import type { LabDefinition } from "@/types";

function lab(
  id: string,
  subjectId: string,
  title: string,
  description: string,
  category: LabDefinition["category"],
  controls: [string, string, string],
  formula?: string,
): LabDefinition {
  return {
    id,
    subjectId,
    title,
    description,
    category,
    xpReward: category === "calculator" ? 60 : 80,
    primaryControl: controls[0],
    secondaryControl: controls[1],
    outputLabel: controls[2],
    formula,
  };
}

export const labs: LabDefinition[] = [
  lab("solar-system-explorer", "physics", "Solar System Explorer", "Explore a live canvas model of all eight planets, inspect orbital scale, and compare planetary facts.", "explorer", ["Planet selection", "Animation speed", "Planet facts"], "T^2 is proportional to r^3"),
  lab("projectile-motion", "physics", "Projectile Motion", "Launch an animated projectile and compare its range, peak height, and flight time on Earth, the Moon, and Mars.", "simulation", ["Launch velocity", "Launch angle", "Horizontal range"], "R = v^2 sin(2 theta) / g"),
  lab("electric-circuit", "physics", "Electric Circuit", "Adjust a battery and resistor in a live circuit to observe current flow, electrical power, and bulb brightness.", "builder", ["Voltage", "Resistance", "Circuit current"], "I = V / R; P = VI"),
  lab("wave-simulator", "physics", "Wave Simulator", "Tune frequency and amplitude to see wavelength, energy, and wave shape.", "simulation", ["Frequency", "Amplitude", "Wavelength"], "v = f lambda"),
  lab("optics-lab", "physics", "Optics Lab", "Move an object relative to a lens and inspect image formation.", "simulation", ["Object distance", "Focal length", "Image distance"], "1/f = 1/do + 1/di"),

  lab("periodic-table", "chemistry", "Interactive Periodic Table", "Explore periodic trends by atomic number, group, and electron structure.", "explorer", ["Atomic number", "Period", "Relative atomic size"]),
  lab("atom-builder", "chemistry", "Atom Builder", "Combine protons, neutrons, and electrons to create atoms and ions.", "builder", ["Protons", "Electrons", "Net charge"], "charge = protons - electrons"),
  lab("molecule-builder", "chemistry", "Molecule Builder", "Connect atoms with bonds and compare molecular composition.", "builder", ["Carbon atoms", "Hydrogen atoms", "Molar mass"]),
  lab("reaction-simulator", "chemistry", "Reaction Simulator", "Change reactant amounts and compare limiting reagents and product yield.", "simulation", ["Reactant A", "Reactant B", "Product yield"]),
  lab("ph-simulator", "chemistry", "pH Simulator", "Adjust hydrogen ion concentration and observe acidity and alkalinity.", "simulation", ["Hydrogen ions", "Dilution", "pH"], "pH = -log10[H+]"),

  lab("cell-explorer", "biology", "Cell Explorer", "Inspect organelles and compare plant and animal cell functions.", "explorer", ["Cell size", "Organelle activity", "Energy demand"]),
  lab("human-body-explorer", "biology", "Human Body Explorer", "Connect heart rate and oxygen demand across body systems.", "explorer", ["Heart rate", "Activity level", "Cardiac output"]),
  lab("photosynthesis-simulator", "biology", "Photosynthesis Simulator", "Explore how light and carbon dioxide affect photosynthesis.", "simulation", ["Light intensity", "Carbon dioxide", "Photosynthesis rate"]),
  lab("plant-growth", "biology", "Plant Growth", "Grow a seed into a young plant and compare how water, light, and soil nutrients affect its development.", "simulation", ["Water level", "Light level", "Growth progress"]),
  lab("food-chain-builder", "biology", "Food Chain Builder", "Arrange trophic levels and observe energy transfer through an ecosystem.", "builder", ["Producer energy", "Trophic levels", "Top-level energy"], "next level is about previous x 0.10"),
  lab("dna-explorer", "biology", "DNA Explorer", "Build base pairs and investigate sequence length and mutation rate.", "explorer", ["Sequence length", "Mutation rate", "Expected mutations"]),

  lab("graph-plotter", "mathematics", "Graph Plotter", "Change slope and intercept to visualize a linear function.", "visualizer", ["Slope", "Intercept", "Value at x = 5"], "y = mx + b"),
  lab("geometry-explorer", "mathematics", "Geometry Explorer", "Resize geometric shapes and compare perimeter, area, and scale.", "explorer", ["Width", "Height", "Rectangle area"], "A = wh"),
  lab("probability-simulator", "mathematics", "Probability Simulator", "Run repeated trials and compare experimental and theoretical probability.", "simulation", ["Success chance", "Trials", "Expected successes"], "E = np"),
  lab("trigonometry-visualizer", "mathematics", "Trigonometry Visualizer", "Rotate an angle on the unit circle and inspect sine and cosine.", "visualizer", ["Angle", "Radius", "Vertical component"], "y = r sin(theta)"),
  lab("statistics-lab", "mathematics", "Statistics Lab", "Change sample spread and size to compare center and variability.", "calculator", ["Sample size", "Spread", "Standard error"], "SE = sigma / sqrt(n)"),

  lab("data-structures-visualizer", "computer-science", "Data Structures Visualizer", "Compare access and update behavior across common data structures.", "visualizer", ["Items", "Operation cost", "Estimated steps"]),
  lab("sorting-visualizer", "computer-science", "Sorting Visualizer", "Change input size and compare sorting algorithm work.", "visualizer", ["Array size", "Disorder", "Comparisons"], "efficient sort: O(n log n)"),
  lab("searching-visualizer", "computer-science", "Searching Visualizer", "Compare linear and binary search as the dataset grows.", "visualizer", ["Items", "Target position", "Search steps"], "binary search: O(log n)"),
  lab("network-simulator", "computer-science", "Network Simulator", "Adjust bandwidth and latency to estimate transfer time.", "simulation", ["Payload size", "Bandwidth", "Transfer time"], "time ~= size / bandwidth + latency"),
  lab("database-explorer", "computer-science", "Database Explorer", "Explore indexes, rows, and query selectivity.", "explorer", ["Table rows", "Selectivity", "Rows scanned"]),

  lab("neural-network-visualizer", "artificial-intelligence", "Neural Network Visualizer", "Change layers and neurons to inspect model capacity.", "visualizer", ["Hidden layers", "Neurons per layer", "Connection count"]),
  lab("ai-training-simulator", "artificial-intelligence", "AI Training Simulator", "Tune iterations and learning rate to observe training progress.", "simulation", ["Training steps", "Learning rate", "Estimated loss"]),
  lab("computer-vision-demo", "artificial-intelligence", "Computer Vision Demo", "Adjust confidence thresholds and inspect classification decisions.", "explorer", ["Confidence threshold", "Signal quality", "Accepted detections"]),
  lab("nlp-explorer", "artificial-intelligence", "NLP Explorer", "Explore token count, context, and text classification confidence.", "explorer", ["Token count", "Context quality", "Confidence"]),
  lab("ml-playground", "machine-learning", "ML Playground", "Balance training data and model complexity to explore generalization.", "simulation", ["Training examples", "Model complexity", "Validation score"]),

  lab("robot-movement", "robotics", "Robot Movement Simulator", "Control wheel speed and duration to estimate robot displacement.", "simulation", ["Wheel speed", "Run time", "Distance"]),
  lab("sensor-simulator", "robotics", "Sensor Simulator", "Change distance and noise to inspect sensor reliability.", "simulation", ["Target distance", "Noise", "Measured distance"]),
  lab("line-following-robot", "robotics", "Line Following Robot", "Tune steering gain and speed to maintain a path.", "simulation", ["Motor speed", "Steering gain", "Tracking score"]),
  lab("obstacle-avoidance", "robotics", "Obstacle Avoidance", "Adjust detection range and reaction speed to avoid collisions.", "simulation", ["Detection range", "Robot speed", "Safety margin"]),

  lab("logic-gate-simulator", "electronics", "Logic Gate Simulator", "Combine digital inputs and compare common gate outputs.", "simulation", ["Input A", "Input B", "Logic output"]),
  lab("led-circuit", "electronics", "LED Circuit Simulator", "Select voltage and resistance to estimate safe LED current.", "simulation", ["Supply voltage", "Resistance", "LED current"], "I = (Vs - Vf) / R"),
  lab("resistor-tool", "electronics", "Resistor Tool", "Calculate resistance, current, and power for a component.", "calculator", ["Voltage", "Current", "Resistance"], "R = V / I"),
  lab("digital-circuit-builder", "electronics", "Digital Circuit Builder", "Adjust gates and signal frequency to inspect circuit load.", "builder", ["Gate count", "Clock frequency", "Relative power"]),

  lab("water-cycle", "environmental-science", "Water Cycle Simulator", "Balance evaporation and precipitation across a simplified water cycle.", "simulation", ["Temperature", "Humidity", "Evaporation rate"]),
  lab("climate-change", "environmental-science", "Climate Change Visualizer", "Explore how emissions and time influence warming scenarios.", "visualizer", ["Annual emissions", "Years", "Relative warming"]),
  lab("carbon-footprint", "environmental-science", "Carbon Footprint Calculator", "Estimate emissions from travel and household energy choices.", "calculator", ["Travel distance", "Energy use", "Estimated CO2"]),
  lab("renewable-energy", "environmental-science", "Renewable Energy Explorer", "Compare solar resource, panel area, and expected energy.", "explorer", ["Sun hours", "Panel area", "Daily energy"]),

  lab("compound-interest", "finance", "Compound Interest Calculator", "Explore how principal, rate, and time affect long-term growth.", "calculator", ["Starting amount", "Annual rate", "Future value"], "A = P(1 + r)^t"),
  lab("investment-simulator", "finance", "Investment Simulator", "Compare contribution levels and expected return over time.", "simulation", ["Monthly contribution", "Expected return", "Projected balance"]),
  lab("budget-planner", "finance", "Budget Planner", "Balance monthly income and expenses to estimate savings.", "planner", ["Monthly income", "Expenses", "Monthly surplus"]),
  lab("risk-return", "finance", "Risk vs Return Visualizer", "Compare volatility and expected return across simplified portfolios.", "visualizer", ["Risk level", "Time horizon", "Expected return"]),

  lab("smart-farming", "agriculture", "Smart Farming Dashboard", "Combine field sensors into a practical crop health score.", "explorer", ["Soil moisture", "Canopy health", "Field score"]),
  lab("irrigation-simulator", "agriculture", "Irrigation Simulator", "Balance field size and water rate to estimate irrigation demand.", "simulation", ["Field area", "Water rate", "Water required"]),
  lab("crop-rotation", "agriculture", "Crop Rotation Planner", "Compare crop diversity and rotation length for soil resilience.", "planner", ["Crop diversity", "Rotation years", "Soil benefit"]),
  lab("soil-health", "agriculture", "Soil Health Analyzer", "Combine organic matter and pH into a simplified soil score.", "calculator", ["Organic matter", "Soil pH", "Soil health score"]),
];

export const labIds = new Set(labs.map((item) => item.id));
const labById = new Map(labs.map((item) => [item.id, item] as const));
const labsBySubject = new Map<string, LabDefinition[]>();

for (const item of labs) {
  const subjectLabs = labsBySubject.get(item.subjectId) ?? [];
  subjectLabs.push(item);
  labsBySubject.set(item.subjectId, subjectLabs);
}

export function getLabById(labId: string) {
  return labById.get(labId);
}

export function getLabsBySubject(subjectId: string) {
  return labsBySubject.get(subjectId) ?? [];
}

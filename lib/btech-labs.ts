import type { BtechBranchId } from "@/lib/btech-branches";

export type BtechLabConceptType =
  | "programming"
  | "data-structures"
  | "algorithms"
  | "operating-systems"
  | "networks"
  | "dbms"
  | "ai-ml"
  | "nlp"
  | "computer-vision"
  | "chemistry"
  | "biology"
  | "agriculture"
  | "finance"
  | "environmental"
  | "civil"
  | "mechanical"
  | "robotics"
  | "electrical"
  | "electronics"
  | "physics"
  | "mathematics";

export type BtechLabDefinition = {
  id: string;
  title: string;
  branchId: BtechBranchId;
  conceptType: BtechLabConceptType;
  description: string;
  controls: string[];
  formula?: string;
  visualizationMode: "svg" | "canvas" | "three";
};

export const btechLabCatalog: BtechLabDefinition[] = [
  { id: "c-memory-allocation-lab", title: "C Memory Allocation Visualization", branchId: "cse", conceptType: "programming", description: "Watch stack and heap blocks allocate, update, and release after Run Lab.", controls: ["Variables", "Pointer hops", "Memory blocks"], visualizationMode: "svg" },
  { id: "java-oop-class-object-lab", title: "Java Class-Object Visualization", branchId: "cse", conceptType: "programming", description: "Instantiate objects from classes and inspect inheritance links.", controls: ["Classes", "Objects", "Method calls"], visualizationMode: "svg" },
  { id: "python-execution-flow-lab", title: "Python Execution Flow", branchId: "cse", conceptType: "programming", description: "Trace interpreter steps, variables, branches, and function calls.", controls: ["Statements", "Branch depth", "Call frames"], visualizationMode: "svg" },
  { id: "recursion-call-stack-lab", title: "Recursion Call Stack", branchId: "cse", conceptType: "programming", description: "Push recursive calls and unwind return values.", controls: ["Depth", "Base case", "Return value"], visualizationMode: "svg" },
  { id: "stack-push-pop-lab", title: "Stack Push/Pop Animation", branchId: "cse", conceptType: "data-structures", description: "Animate LIFO operations with highlighted top pointer.", controls: ["Push count", "Pop count", "Stack height"], visualizationMode: "svg" },
  { id: "queue-enqueue-dequeue-lab", title: "Queue Enqueue/Dequeue Animation", branchId: "cse", conceptType: "data-structures", description: "Animate FIFO movement with front and rear pointers.", controls: ["Enqueues", "Dequeues", "Queue size"], visualizationMode: "svg" },
  { id: "linked-list-node-lab", title: "Linked List Node Connection", branchId: "cse", conceptType: "data-structures", description: "Create nodes and form pointer links visually.", controls: ["Nodes", "Insert index", "Pointer changes"], visualizationMode: "svg" },
  { id: "tree-traversal-lab", title: "Tree Traversal Animation", branchId: "cse", conceptType: "data-structures", description: "Run preorder, inorder, and breadth-first traversal paths.", controls: ["Depth", "Traversal", "Visited nodes"], visualizationMode: "three" },
  { id: "graph-bfs-dfs-lab", title: "Graph BFS/DFS Animation", branchId: "cse", conceptType: "data-structures", description: "Explore graph nodes using queue and stack strategies.", controls: ["Nodes", "Edges", "Traversal order"], visualizationMode: "three" },
  { id: "sorting-animation-lab", title: "Sorting Animation", branchId: "cse", conceptType: "algorithms", description: "Compare and swap bars while counting comparisons.", controls: ["Array size", "Disorder", "Comparisons"], formula: "O(n log n) for efficient comparison sorts", visualizationMode: "canvas" },
  { id: "binary-search-lab", title: "Binary Search Animation", branchId: "cse", conceptType: "algorithms", description: "Narrow a sorted array with low, mid, and high markers.", controls: ["Array size", "Target", "Steps"], formula: "O(log n)", visualizationMode: "svg" },
  { id: "dijkstra-lab", title: "Dijkstra Shortest Path", branchId: "cse", conceptType: "algorithms", description: "Relax weighted edges until the shortest route is found.", controls: ["Nodes", "Edge weight", "Distance table"], visualizationMode: "svg" },
  { id: "dp-table-fill-lab", title: "Dynamic Programming Table Fill", branchId: "cse", conceptType: "algorithms", description: "Fill a DP table from base cases to final answer.", controls: ["Rows", "Columns", "State value"], visualizationMode: "svg" },
  { id: "process-scheduling-lab", title: "Process Scheduling", branchId: "cse", conceptType: "operating-systems", description: "Animate ready queue, CPU slot, and Gantt chart timeline.", controls: ["Processes", "Quantum", "Waiting time"], visualizationMode: "svg" },
  { id: "memory-paging-lab", title: "Memory Paging", branchId: "cse", conceptType: "operating-systems", description: "Translate virtual pages into physical frames and page faults.", controls: ["Pages", "Frames", "Faults"], visualizationMode: "svg" },
  { id: "deadlock-resource-graph-lab", title: "Deadlock Resource Graph", branchId: "cse", conceptType: "operating-systems", description: "Animate process-resource requests and circular wait detection.", controls: ["Processes", "Resources", "Cycles"], visualizationMode: "svg" },
  { id: "packet-transfer-lab", title: "Packet Transfer", branchId: "it", conceptType: "networks", description: "Move packets through client, router, server, and acknowledgement path.", controls: ["Payload", "Bandwidth", "Latency"], formula: "time ~= size / bandwidth + latency", visualizationMode: "canvas" },
  { id: "tcp-handshake-lab", title: "TCP Handshake", branchId: "it", conceptType: "networks", description: "Animate SYN, SYN-ACK, and ACK packets.", controls: ["Latency", "Packet loss", "Handshake state"], visualizationMode: "svg" },
  { id: "routing-lab", title: "Routing Animation", branchId: "it", conceptType: "networks", description: "Update route costs and choose the next hop.", controls: ["Routers", "Cost", "Path"], visualizationMode: "svg" },
  { id: "db-relationship-lab", title: "Table Relationship Animation", branchId: "data-science", conceptType: "dbms", description: "Link primary keys, foreign keys, and relationship cardinality.", controls: ["Tables", "Keys", "Relationships"], visualizationMode: "svg" },
  { id: "sql-query-execution-lab", title: "SQL Query Execution", branchId: "data-science", conceptType: "dbms", description: "Animate scan, filter, join, sort, and aggregate stages.", controls: ["Rows", "Selectivity", "Query cost"], visualizationMode: "svg" },
  { id: "index-search-lab", title: "Index Search Animation", branchId: "data-science", conceptType: "dbms", description: "Traverse a simplified B-tree index to find target records.", controls: ["Rows", "Index depth", "Disk reads"], visualizationMode: "svg" },
  { id: "neural-forward-lab", title: "Neural Network Forward Propagation", branchId: "aiml", conceptType: "ai-ml", description: "Send activations through layers and watch output confidence update.", controls: ["Layers", "Neurons", "Confidence"], visualizationMode: "three" },
  { id: "gradient-descent-lab", title: "Gradient Descent Animation", branchId: "aiml", conceptType: "ai-ml", description: "Move along a loss curve as learning rate changes.", controls: ["Learning rate", "Iterations", "Loss"], visualizationMode: "canvas" },
  { id: "cnn-filter-lab", title: "CNN Filter Animation", branchId: "aiml", conceptType: "ai-ml", description: "Slide filters over image patches and build feature maps.", controls: ["Filter size", "Stride", "Activation"], visualizationMode: "three" },
  { id: "rnn-sequence-lab", title: "RNN Sequence Animation", branchId: "aiml", conceptType: "ai-ml", description: "Pass hidden state across a token sequence.", controls: ["Tokens", "Hidden size", "State"], visualizationMode: "three" },
  { id: "transformer-attention-lab", title: "Transformer Attention", branchId: "aiml", conceptType: "nlp", description: "Animate attention weights between tokens.", controls: ["Tokens", "Heads", "Attention score"], visualizationMode: "three" },
  { id: "tokenization-lab", title: "Tokenization Animation", branchId: "aiml", conceptType: "nlp", description: "Split text into tokens, IDs, and embeddings.", controls: ["Text length", "Vocabulary", "Token count"], visualizationMode: "svg" },
  { id: "image-classification-lab", title: "Image Classification Pipeline", branchId: "aiml", conceptType: "computer-vision", description: "Show preprocess, features, logits, and class confidence.", controls: ["Resolution", "Threshold", "Confidence"], visualizationMode: "svg" },
  { id: "object-detection-lab", title: "Object Detection Boxes", branchId: "aiml", conceptType: "computer-vision", description: "Animate proposals and bounding boxes with confidence scores.", controls: ["Objects", "Threshold", "Boxes"], visualizationMode: "svg" },
  { id: "neural-network-animation-lab", title: "Neural Network Animation", branchId: "aiml", conceptType: "ai-ml", description: "Animate inputs, weights, activations, and confidence across neural layers.", controls: ["Layers", "Weights", "Confidence"], formula: "a = activation(Wx + b)", visualizationMode: "svg" },
  { id: "transformer-attention-visualizer-lab", title: "Transformer Attention Visualizer", branchId: "aiml", conceptType: "nlp", description: "Visualize query-key attention links and token influence after Run Lab.", controls: ["Tokens", "Heads", "Attention"], formula: "attention = softmax(QK^T / sqrt(d))V", visualizationMode: "svg" },
  { id: "gradient-descent-simulator-lab", title: "Gradient Descent Simulator", branchId: "aiml", conceptType: "ai-ml", description: "Step downhill on a loss surface while tracking learning rate and loss.", controls: ["Learning rate", "Step size", "Loss"], formula: "theta = theta - alpha * gradient", visualizationMode: "canvas" },
  { id: "graph-algorithm-visualizer-lab", title: "Graph Algorithm Visualizer", branchId: "cse", conceptType: "algorithms", description: "Animate frontier expansion, visited nodes, and path discovery.", controls: ["Frontier", "Visited", "Path cost"], visualizationMode: "svg" },
  { id: "cpu-scheduling-visualizer-lab", title: "CPU Scheduling Visualizer", branchId: "cse", conceptType: "operating-systems", description: "Animate ready queue selection, CPU execution, and Gantt chart slots.", controls: ["Quantum", "Waiting time", "Turnaround"], visualizationMode: "svg" },
  { id: "molecule-formation-lab", title: "Molecule Formation", branchId: "ece", conceptType: "chemistry", description: "Atoms combine and bonds form only after Run Lab.", controls: ["Atoms", "Bond energy", "Molecule mass"], visualizationMode: "svg" },
  { id: "reaction-animation-lab", title: "Chemical Reaction Animation", branchId: "ece", conceptType: "chemistry", description: "Reactants collide, rearrange bonds, and form products.", controls: ["Reactants", "Temperature", "Yield"], visualizationMode: "svg" },
  { id: "periodic-table-grid-lab", title: "Periodic Table Grid", branchId: "ece", conceptType: "chemistry", description: "Highlight groups, periods, valence electrons, and element trends.", controls: ["Atomic number", "Group", "Valence"], visualizationMode: "svg" },
  { id: "atom-builder-lab", title: "Atom Builder", branchId: "ece", conceptType: "chemistry", description: "Assemble protons, neutrons, and electrons into a stable atom.", controls: ["Protons", "Neutrons", "Electrons"], visualizationMode: "svg" },
  { id: "ph-scale-lab", title: "pH Color Scale", branchId: "civil", conceptType: "chemistry", description: "Move across acidic, neutral, and basic pH colors with examples.", controls: ["pH", "Hydrogen ions", "Color"], formula: "pH = -log10[H+]", visualizationMode: "svg" },
  { id: "cell-organelle-selector-lab", title: "Cell Organelle Selector", branchId: "aiml", conceptType: "biology", description: "Select organelles and watch energy, transport, and control pathways.", controls: ["Nucleus", "Mitochondria", "Membrane"], visualizationMode: "svg" },
  { id: "dna-base-pairs-lab", title: "DNA Base Pair Animation", branchId: "aiml", conceptType: "biology", description: "Animate A-T and C-G pairing with replication direction labels.", controls: ["Bases", "Pairs", "Replication"], formula: "A pairs with T, C pairs with G", visualizationMode: "svg" },
  { id: "photosynthesis-flow-lab", title: "Photosynthesis Flow", branchId: "civil", conceptType: "biology", description: "Show sunlight, water, carbon dioxide, glucose, and oxygen flow.", controls: ["Light", "CO2", "Glucose"], formula: "6CO2 + 6H2O -> C6H12O6 + 6O2", visualizationMode: "svg" },
  { id: "seed-growth-lab", title: "Seed-to-Plant Growth", branchId: "civil", conceptType: "agriculture", description: "Animate roots, stem, leaves, water, and sunlight response.", controls: ["Water", "Light", "Growth"], visualizationMode: "canvas" },
  { id: "irrigation-flow-lab", title: "Irrigation Flow", branchId: "civil", conceptType: "agriculture", description: "Show water flow across field zones and soil absorption.", controls: ["Flow rate", "Field area", "Moisture"], visualizationMode: "canvas" },
  { id: "soil-health-lab", title: "Soil Health Dashboard", branchId: "civil", conceptType: "agriculture", description: "Combine pH, organic matter, and moisture into soil score.", controls: ["pH", "Organic matter", "Score"], visualizationMode: "svg" },
  { id: "smart-farming-dashboard-lab", title: "Smart Farming Dashboard", branchId: "civil", conceptType: "agriculture", description: "Animate sensor readings for soil moisture, weather, crop growth, and alerts.", controls: ["Moisture", "Temperature", "Yield"], visualizationMode: "svg" },
  { id: "soil-health-analyzer-lab", title: "Soil Health Analyzer", branchId: "civil", conceptType: "agriculture", description: "Calculate health from pH, nitrogen, organic matter, and moisture.", controls: ["pH", "Nitrogen", "Health score"], formula: "score = nutrient balance + moisture + pH fit", visualizationMode: "svg" },
  { id: "crop-rotation-planner-lab", title: "Crop Rotation Planner", branchId: "civil", conceptType: "agriculture", description: "Animate seasonal crop choices and soil nutrient recovery.", controls: ["Season", "Crop family", "Nutrients"], visualizationMode: "svg" },
  { id: "irrigation-simulator-lab", title: "Irrigation Simulator", branchId: "civil", conceptType: "agriculture", description: "Run water through field zones and compare absorption against demand.", controls: ["Flow rate", "Coverage", "Water saved"], formula: "water need = area * crop coefficient * evapotranspiration", visualizationMode: "canvas" },
  { id: "risk-return-visualizer-lab", title: "Risk vs Return Visualizer", branchId: "data-science", conceptType: "finance", description: "Plot investments by volatility and expected return after Run Lab.", controls: ["Risk", "Return", "Sharpe score"], formula: "Sharpe = (return - risk-free rate) / volatility", visualizationMode: "svg" },
  { id: "budget-planner-lab", title: "Budget Planner", branchId: "data-science", conceptType: "finance", description: "Animate income allocation across needs, wants, savings, and debt.", controls: ["Income", "Savings", "Expenses"], visualizationMode: "svg" },
  { id: "investment-simulator-lab", title: "Investment Simulator", branchId: "data-science", conceptType: "finance", description: "Simulate portfolio growth under monthly contribution and return assumptions.", controls: ["Contribution", "Return", "Portfolio"], formula: "future value = contribution stream + compounded principal", visualizationMode: "svg" },
  { id: "compound-interest-calculator-lab", title: "Compound Interest Calculator", branchId: "data-science", conceptType: "finance", description: "Animate principal growing through compounding intervals.", controls: ["Principal", "Rate", "Years"], formula: "A = P(1 + r/n)^(nt)", visualizationMode: "svg" },
  { id: "carbon-footprint-calculator-lab", title: "Carbon Footprint Calculator", branchId: "civil", conceptType: "environmental", description: "Estimate emissions from transport, electricity, food, and waste inputs.", controls: ["Transport", "Energy", "CO2e"], formula: "CO2e = activity * emission factor", visualizationMode: "svg" },
  { id: "climate-change-visualizer-lab", title: "Climate Change Visualizer", branchId: "civil", conceptType: "environmental", description: "Animate temperature anomaly, sea level, and emissions pathways.", controls: ["Emissions", "Temperature", "Sea level"], visualizationMode: "svg" },
  { id: "water-cycle-simulator-lab", title: "Water Cycle Simulator", branchId: "civil", conceptType: "environmental", description: "Run evaporation, condensation, precipitation, runoff, and groundwater flow.", controls: ["Heat", "Clouds", "Runoff"], visualizationMode: "svg" },
  { id: "renewable-energy-explorer-lab", title: "Renewable Energy Explorer", branchId: "eee", conceptType: "environmental", description: "Compare solar, wind, hydro, and storage output under changing conditions.", controls: ["Sunlight", "Wind", "Output"], formula: "energy = power * time", visualizationMode: "svg" },
  { id: "bridge-load-lab", title: "Bridge Load Simulation", branchId: "civil", conceptType: "civil", description: "Animate load distribution through bridge members.", controls: ["Load", "Span", "Deflection"], formula: "stress = force / area", visualizationMode: "three" },
  { id: "beam-stress-lab", title: "Beam Stress Visualization", branchId: "civil", conceptType: "civil", description: "Show compression, tension, and bending stress zones.", controls: ["Load", "Length", "Stress"], visualizationMode: "svg" },
  { id: "surveying-measurement-lab", title: "Surveying Measurement", branchId: "civil", conceptType: "civil", description: "Animate angle, distance, and elevation readings.", controls: ["Baseline", "Angle", "Elevation"], visualizationMode: "svg" },
  { id: "gear-motion-lab", title: "Gear Motion", branchId: "mechanical", conceptType: "mechanical", description: "Interlock gears and animate angular velocity ratios.", controls: ["Teeth", "Input RPM", "Output RPM"], formula: "N1 * omega1 = N2 * omega2", visualizationMode: "svg" },
  { id: "piston-engine-lab", title: "Piston Engine Animation", branchId: "mechanical", conceptType: "mechanical", description: "Animate intake, compression, power, and exhaust strokes.", controls: ["RPM", "Stroke", "Power"], visualizationMode: "svg" },
  { id: "thermo-cycle-lab", title: "Thermodynamics Cycle", branchId: "mechanical", conceptType: "mechanical", description: "Trace heat, work, pressure, and volume around a cycle.", controls: ["Temperature", "Pressure", "Efficiency"], visualizationMode: "svg" },
  { id: "circuit-current-lab", title: "Circuit Current Flow", branchId: "eee", conceptType: "electrical", description: "Animate electron flow, current, resistance, and bulb brightness.", controls: ["Voltage", "Resistance", "Current"], formula: "I = V / R", visualizationMode: "svg" },
  { id: "logic-gate-flow-lab", title: "Logic Gate Signal Flow", branchId: "ece", conceptType: "electronics", description: "Animate digital signals through gates.", controls: ["Input A", "Input B", "Output"], visualizationMode: "svg" },
  { id: "logic-gate-signal-flow-lab", title: "Logic Gate Signal Flow", branchId: "ece", conceptType: "electronics", description: "Run binary pulses through AND, OR, and XOR gates with live output.", controls: ["Input A", "Input B", "Gate output"], formula: "Y = A AND B / A OR B / A XOR B", visualizationMode: "svg" },
  { id: "motor-rotation-lab", title: "Motor Rotation", branchId: "eee", conceptType: "electrical", description: "Animate torque and rotating magnetic field.", controls: ["Voltage", "Load", "RPM"], visualizationMode: "three" },
  { id: "motor-control-animation-lab", title: "Motor Control Animation", branchId: "eee", conceptType: "electrical", description: "Animate PWM duty cycle, torque, load, and speed feedback.", controls: ["PWM duty", "Load", "RPM"], formula: "speed ~= duty cycle - load loss", visualizationMode: "svg" },
  { id: "transformer-flux-lab", title: "Transformer Magnetic Flux", branchId: "eee", conceptType: "electrical", description: "Animate alternating flux linking primary and secondary coils.", controls: ["Turns ratio", "Frequency", "Output voltage"], visualizationMode: "svg" },
  { id: "unit-circle-lab", title: "Unit Circle Explorer", branchId: "data-science", conceptType: "mathematics", description: "Animate sine, cosine, angle, and coordinates around the unit circle.", controls: ["Angle", "Sine", "Cosine"], formula: "sin^2(theta) + cos^2(theta) = 1", visualizationMode: "svg" },
  { id: "statistics-chart-lab", title: "Statistics Chart Lab", branchId: "data-science", conceptType: "mathematics", description: "Animate distribution bars, mean, median, spread, and outliers.", controls: ["Mean", "Spread", "Outliers"], visualizationMode: "svg" },
  { id: "robot-path-planning-lab", title: "Robot Path Planning", branchId: "robotics", conceptType: "robotics", description: "Plan a robot path around obstacles using waypoints and cost fields.", controls: ["Waypoints", "Obstacles", "Path cost"], visualizationMode: "svg" },
  { id: "sensor-simulation-lab", title: "Sensor Simulation", branchId: "robotics", conceptType: "robotics", description: "Animate range sensing, noise, thresholding, and obstacle detection.", controls: ["Range", "Noise", "Detection"], visualizationMode: "svg" },
  { id: "solar-system-3d-lab", title: "Solar System", branchId: "eee", conceptType: "physics", description: "Run orbital motion around the Sun with planet highlights.", controls: ["Planet", "Speed", "Orbit radius"], visualizationMode: "canvas" },
  { id: "projectile-3d-lab", title: "Projectile Motion", branchId: "eee", conceptType: "physics", description: "Launch a projectile and calculate range, height, and time.", controls: ["Angle", "Velocity", "Gravity"], formula: "R = v^2 sin(2 theta) / g", visualizationMode: "svg" },
  { id: "wave-optics-lab", title: "Waves and Optics", branchId: "ece", conceptType: "physics", description: "Animate wave propagation and ray bending through a lens.", controls: ["Frequency", "Amplitude", "Focal length"], visualizationMode: "canvas" },
];

const labById = new Map(btechLabCatalog.map((lab) => [lab.id, lab]));

export function getBtechLab(labId: string) {
  return labById.get(labId);
}

export function getBtechLabsByConcept(conceptType: BtechLabConceptType) {
  return btechLabCatalog.filter((lab) => lab.conceptType === conceptType);
}

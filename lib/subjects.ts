import type { Lesson, Subject } from "@/types";

type LessonSeed = {
  id: string;
  title: string;
  description: string;
  concepts: string[];
  formulas?: string[];
  example: string;
  application: string;
  labs: string[];
  minutes?: number;
};

function createLesson(subjectName: string, seed: LessonSeed): Lesson {
  const concepts = seed.concepts.join(", ");

  return {
    id: seed.id,
    title: seed.title,
    description: seed.description,
    durationMinutes: seed.minutes ?? 22,
    xpReward: 80 + (seed.minutes ?? 22),
    overview: `${seed.description} This lesson builds a usable mental model, connects evidence to the underlying mechanism, and then applies the idea through calculations, examples, and real systems.`,
    content: [
      `${seed.title} starts with a central question: how can we describe, predict, or design the behavior in this topic? In ${subjectName}, a strong explanation connects observable evidence to a clear model.`,
      `The core ideas are ${concepts}. Treat these as a connected system rather than isolated vocabulary: identify which quantities or conditions are inputs, what mechanism links them, and which result can be observed or measured.`,
      `When conditions change, separate cause from correlation. Hold important variables constant, compare the new outcome with a baseline, and explain the result using the lesson model. This turns a description into a testable prediction.`,
      `A reliable problem-solving process is to state what is known, choose the matching concept or formula, reason through one step at a time, and check whether the result makes sense in context.`,
      `Finally, communicate the conclusion with evidence. Include units for numerical results, define assumptions, describe uncertainty, and explain how the same idea transfers to a different ${subjectName.toLowerCase()} situation.`,
    ],
    keyConcepts: seed.concepts,
    examples: [
      seed.example,
      `Try a second case by changing one important input while keeping the others fixed. Predict the direction of change first, then calculate or reason through the outcome and compare it with the original case.`,
    ],
    formulas:
      seed.formulas ?? [
        "predicted outcome = model(inputs, conditions, constraints)",
      ],
    applications: [
      seed.application,
      `The same reasoning supports practical decisions in education, public systems, research, and technology whenever people need to compare evidence, evaluate tradeoffs, or predict consequences.`,
    ],
    summary: `${seed.title} connects ${seed.concepts.slice(0, 3).join(", ")}. You should now be able to explain the mechanism, identify inputs and outcomes, use the relevant formula or conceptual model, test a representative example, and recognize where the idea appears in real life.`,
    relatedLabIds: seed.labs,
  };
}

function subject(
  id: string,
  name: string,
  description: string,
  overview: string,
  accent: Subject["accent"],
  seeds: LessonSeed[],
): Subject {
  return {
    id,
    name,
    description,
    overview,
    accent,
    lessons: seeds.map((seed) => createLesson(name, seed)),
  };
}

export const subjects: Subject[] = [
  subject(
    "physics",
    "Physics",
    "Understand motion, forces, energy, fields, waves, and light.",
    "Physics builds mathematical models of the natural world, from falling objects and circuits to sound, lenses, and planetary orbits.",
    "cyan",
    [
      { id: "physics-gravity-motion", title: "Gravity and Motion", description: "Explore falling objects, orbits, velocity, and acceleration.", concepts: ["position", "velocity", "acceleration", "gravity"], formulas: ["v = Δx/Δt", "a = Δv/Δt", "Fg = Gm₁m₂/r²"], example: "Compare a dropped ball with a ball thrown horizontally and explain why both accelerate downward at the same rate.", application: "Satellite navigation and spacecraft mission planning depend on accurate models of gravity and motion.", labs: ["solar-system-explorer", "projectile-motion"] },
      { id: "physics-newtons-laws", title: "Newton's Laws", description: "Connect forces to changes in motion through Newton's three laws.", concepts: ["inertia", "net force", "mass", "action-reaction pairs"], formulas: ["Fnet = ma", "F₁₂ = -F₂₁"], example: "A loaded shopping cart needs more force than an empty cart to achieve the same acceleration.", application: "Vehicle safety systems, sports technique, and machine design all use Newton's laws.", labs: ["projectile-motion"] },
      { id: "physics-electricity-circuits", title: "Electricity and Circuits", description: "Learn charge, current, voltage, resistance, and simple circuits.", concepts: ["electric charge", "current", "voltage", "resistance"], formulas: ["I = Q/t", "V = IR", "P = VI"], example: "Calculate the current through a 6 Ω resistor connected to a 12 V source.", application: "Circuit models guide the design of chargers, lighting, sensors, and household electronics.", labs: ["electric-circuit", "led-circuit"] },
      { id: "physics-waves-sound", title: "Waves and Sound", description: "Study frequency, wavelength, resonance, and sound propagation.", concepts: ["amplitude", "frequency", "wavelength", "resonance"], formulas: ["v = fλ", "T = 1/f"], example: "A 170 Hz sound traveling at 340 m/s has a wavelength of 2 m.", application: "Audio engineering, ultrasound imaging, wireless communication, and musical instruments use wave behavior.", labs: ["wave-simulator"] },
      { id: "physics-light-optics", title: "Light and Optics", description: "Investigate reflection, refraction, lenses, and image formation.", concepts: ["reflection", "refraction", "focal length", "image formation"], formulas: ["n₁sinθ₁ = n₂sinθ₂", "1/f = 1/do + 1/di"], example: "Trace rays through a converging lens to locate a real inverted image.", application: "Cameras, microscopes, glasses, telescopes, and fiber-optic networks control light.", labs: ["optics-lab"] },
    ],
  ),
  subject(
    "chemistry",
    "Chemistry",
    "Discover atoms, periodic patterns, reactions, acids, and carbon compounds.",
    "Chemistry explains how matter is structured and transformed, linking microscopic particles to materials, medicines, energy, and environmental processes.",
    "violet",
    [
      { id: "chemistry-atoms-molecules", title: "Atoms and Molecules", description: "Meet the particles that make up elements and compounds.", concepts: ["protons", "neutrons", "electrons", "chemical bonds"], formulas: ["mass number = protons + neutrons", "charge = protons - electrons"], example: "Build a neutral carbon atom with six protons and six electrons, then compare its isotopes.", application: "Atomic structure explains material properties, medical imaging, and semiconductor behavior.", labs: ["atom-builder", "molecule-builder"] },
      { id: "chemistry-periodic-table", title: "Periodic Table", description: "Read groups, periods, and recurring patterns in element properties.", concepts: ["groups", "periods", "valence electrons", "periodic trends"], example: "Compare sodium and chlorine to predict why they readily form an ionic compound.", application: "Scientists use periodic trends to select catalysts, battery materials, and useful alloys.", labs: ["periodic-table"] },
      { id: "chemistry-reactions", title: "Chemical Reactions", description: "Identify reactants, products, energy changes, and balanced equations.", concepts: ["conservation of atoms", "stoichiometry", "reaction rate", "energy change"], formulas: ["moles = mass/molar mass"], example: "Balance hydrogen reacting with oxygen to form water, then compare mole ratios.", application: "Reaction control matters in manufacturing, cooking, combustion, medicine, and waste treatment.", labs: ["reaction-simulator"] },
      { id: "chemistry-acids-bases", title: "Acids and Bases", description: "Understand pH, indicators, neutralization, and common examples.", concepts: ["hydrogen ions", "hydroxide ions", "pH", "neutralization"], formulas: ["pH = -log₁₀[H⁺]"], example: "Explain how adding water changes the pH of an acidic solution without changing the acid identity.", application: "pH control is essential in agriculture, water treatment, digestion, and product formulation.", labs: ["ph-simulator"] },
      { id: "chemistry-organic-basics", title: "Organic Chemistry Basics", description: "Explore carbon bonding, hydrocarbons, and functional groups.", concepts: ["carbon skeletons", "covalent bonds", "functional groups", "isomers"], example: "Compare ethanol and ethanoic acid to see how functional groups change properties.", application: "Organic chemistry supports pharmaceuticals, polymers, fuels, food science, and biotechnology.", labs: ["molecule-builder"] },
    ],
  ),
  subject(
    "biology",
    "Biology",
    "Study cells, body systems, inheritance, photosynthesis, and ecosystems.",
    "Biology connects molecular processes to organisms and ecosystems, showing how living systems obtain energy, reproduce, regulate themselves, and evolve.",
    "emerald",
    [
      { id: "biology-cell-structure", title: "Cell Structure", description: "Compare cell types and learn the jobs of major organelles.", concepts: ["cell membrane", "nucleus", "mitochondria", "chloroplasts"], example: "Compare a leaf cell with a muscle cell and connect their organelles to their jobs.", application: "Cell biology guides disease diagnosis, drug development, tissue engineering, and agriculture.", labs: ["cell-explorer"] },
      { id: "biology-human-systems", title: "Human Body Systems", description: "See how organ systems cooperate to maintain life.", concepts: ["circulation", "respiration", "digestion", "homeostasis"], formulas: ["cardiac output = heart rate × stroke volume"], example: "Trace oxygen from an inhaled breath to a working muscle cell.", application: "Understanding body systems supports medicine, fitness, public health, and emergency care.", labs: ["human-body-explorer"] },
      { id: "biology-genetics", title: "Genetics", description: "Learn DNA, genes, inheritance, and variation.", concepts: ["DNA", "genes", "alleles", "inheritance"], formulas: ["probability of independent traits = P(A) × P(B)"], example: "Use a Punnett square to model the possible alleles inherited from two heterozygous parents.", application: "Genetics informs medicine, ancestry, crop breeding, conservation, and forensic science.", labs: ["dna-explorer"] },
      { id: "biology-photosynthesis", title: "Photosynthesis", description: "Follow how plants turn light energy into stored chemical energy.", concepts: ["chlorophyll", "light reactions", "carbon fixation", "glucose"], formulas: ["6CO₂ + 6H₂O + light → C₆H₁₂O₆ + 6O₂"], example: "Predict how low light or limited carbon dioxide changes a plant's photosynthesis rate.", application: "Photosynthesis underpins food production, carbon cycling, forestry, and bioenergy.", labs: ["photosynthesis-simulator", "plant-growth"] },
      { id: "biology-ecosystems", title: "Ecosystems", description: "Trace energy flow, food webs, populations, and ecological balance.", concepts: ["producers", "consumers", "decomposers", "biodiversity"], formulas: ["energy at next trophic level ≈ current energy × 0.10"], example: "Track how removing a predator can change several populations in a food web.", application: "Ecology guides conservation, fisheries, land management, and climate resilience.", labs: ["food-chain-builder"] },
    ],
  ),
  subject(
    "mathematics",
    "Mathematics",
    "Build reasoning with algebra, geometry, trigonometry, calculus, and probability.",
    "Mathematics provides a precise language for patterns, structure, quantity, space, uncertainty, and change across science, technology, and daily decisions.",
    "amber",
    [
      { id: "math-algebra", title: "Algebra", description: "Use variables, equations, and functions to model relationships.", concepts: ["variables", "equations", "functions", "graphs"], formulas: ["y = mx + b", "x = (-b ± √(b² - 4ac))/2a"], example: "Model a taxi fare using a fixed starting fee and a cost per kilometer.", application: "Algebra supports budgeting, engineering models, programming, data analysis, and forecasting.", labs: ["graph-plotter"] },
      { id: "math-geometry", title: "Geometry", description: "Reason about angles, shapes, area, volume, and spatial structure.", concepts: ["congruence", "similarity", "area", "volume"], formulas: ["Atriangle = ½bh", "Acircle = πr²", "a² + b² = c²"], example: "Use similar triangles to estimate the height of a tree from its shadow.", application: "Geometry is central to architecture, mapping, manufacturing, graphics, and design.", labs: ["geometry-explorer"] },
      { id: "math-trigonometry", title: "Trigonometry", description: "Connect angles and side lengths with sine, cosine, and tangent.", concepts: ["unit circle", "sine", "cosine", "tangent"], formulas: ["sinθ = opposite/hypotenuse", "cosθ = adjacent/hypotenuse", "tanθ = opposite/adjacent"], example: "Find the height reached by a ladder using its length and angle with the ground.", application: "Trigonometry supports surveying, navigation, signal processing, robotics, and astronomy.", labs: ["trigonometry-visualizer"] },
      { id: "math-calculus", title: "Calculus Basics", description: "Introduce limits, derivatives, integrals, and rates of change.", concepts: ["limits", "derivatives", "integrals", "accumulation"], formulas: ["d(xⁿ)/dx = nxⁿ⁻¹", "∫xⁿdx = xⁿ⁺¹/(n+1) + C"], example: "Interpret the derivative of position as instantaneous velocity.", application: "Calculus models optimization, motion, growth, economics, control systems, and machine learning.", labs: ["graph-plotter", "statistics-lab"] },
      { id: "math-probability", title: "Probability", description: "Measure uncertainty using outcomes, events, and expected values.", concepts: ["sample spaces", "independence", "conditional probability", "expected value"], formulas: ["P(A) = favorable outcomes/total outcomes", "E(X) = ΣxP(x)"], example: "Compare the theoretical probability of a coin toss with results from hundreds of trials.", application: "Probability informs insurance, medicine, quality control, games, finance, and AI.", labs: ["probability-simulator", "statistics-lab"] },
    ],
  ),
  subject(
    "computer-science",
    "Computer Science",
    "Learn algorithms, data structures, databases, operating systems, and networks.",
    "Computer science studies information and computation, combining rigorous problem solving with systems that store, transform, communicate, and protect data.",
    "cyan",
    [
      { id: "cs-algorithms", title: "Algorithms", description: "Design precise steps for solving computational problems.", concepts: ["correctness", "efficiency", "decomposition", "complexity"], formulas: ["linear scan: O(n)", "binary search: O(log n)"], example: "Compare checking every name in a sorted list with repeatedly halving the search range.", application: "Algorithms power routing, recommendations, scheduling, search engines, and scientific computing.", labs: ["sorting-visualizer", "searching-visualizer"] },
      { id: "cs-data-structures", title: "Data Structures", description: "Organize data with arrays, stacks, queues, trees, and graphs.", concepts: ["arrays", "stacks", "queues", "graphs"], example: "Model browser back navigation with a stack and customer service with a queue.", application: "Choosing a data structure affects the speed and clarity of nearly every software system.", labs: ["data-structures-visualizer"] },
      { id: "cs-databases", title: "Databases", description: "Store, query, relate, and protect structured information.", concepts: ["tables", "keys", "relationships", "indexes"], example: "Link students to course enrollments using primary and foreign keys.", application: "Databases support banking, health records, commerce, logistics, and social platforms.", labs: ["database-explorer"] },
      { id: "cs-operating-systems", title: "Operating Systems", description: "Understand processes, memory, files, and resource management.", concepts: ["processes", "scheduling", "virtual memory", "file systems"], example: "Explain how a scheduler shares one CPU among many active applications.", application: "Operating systems coordinate phones, servers, vehicles, robots, and embedded devices.", labs: ["network-simulator"] },
      { id: "cs-networks", title: "Computer Networks", description: "Explore packets, addresses, routing, latency, and reliable communication.", concepts: ["packets", "protocols", "routing", "latency"], formulas: ["transfer time ≈ data size/bandwidth + latency"], example: "Estimate why a large download can be slow even when a website responds quickly.", application: "Networks connect cloud services, homes, factories, vehicles, and global communication.", labs: ["network-simulator"] },
    ],
  ),
  subject(
    "artificial-intelligence",
    "Artificial Intelligence",
    "Explore intelligent agents, search, knowledge, language, and computer vision.",
    "Artificial intelligence designs systems that perceive, reason, plan, communicate, and act toward goals while accounting for uncertainty and human needs.",
    "violet",
    [
      { id: "ai-intelligent-agents", title: "Intelligent Agents", description: "Understand goals, environments, observations, and actions.", concepts: ["agents", "state", "goals", "utility"], example: "Describe a delivery robot as an agent that observes streets and chooses safe actions.", application: "Agent models appear in robotics, games, assistants, logistics, and autonomous systems.", labs: ["ai-training-simulator"] },
      { id: "ai-search-planning", title: "Search and Planning", description: "Compare strategies for finding paths and action sequences.", concepts: ["state spaces", "breadth-first search", "heuristics", "planning"], formulas: ["A* priority = path cost + heuristic"], example: "Use a heuristic to guide a route planner toward a destination efficiently.", application: "Search and planning support navigation, scheduling, puzzles, and resource allocation.", labs: ["ai-training-simulator"] },
      { id: "ai-knowledge-reasoning", title: "Knowledge and Reasoning", description: "Represent facts, rules, uncertainty, and logical conclusions.", concepts: ["knowledge representation", "logic", "inference", "uncertainty"], example: "Use rules and observations to infer whether a device fault is likely.", application: "Reasoning systems help with diagnosis, configuration, compliance, and decision support.", labs: ["neural-network-visualizer"] },
      { id: "ai-computer-vision", title: "Computer Vision", description: "Learn how machines extract useful information from images.", concepts: ["pixels", "features", "classification", "detection"], example: "Adjust a confidence threshold to balance missed objects and false alarms.", application: "Computer vision supports medical scans, manufacturing, accessibility, and autonomous vehicles.", labs: ["computer-vision-demo"] },
      { id: "ai-language", title: "Natural Language AI", description: "Explore tokens, context, meaning, and language generation.", concepts: ["tokens", "embeddings", "context", "generation"], example: "Compare how changing a prompt's context changes a model's response.", application: "Language AI powers tutoring, translation, search, summarization, and customer support.", labs: ["nlp-explorer"] },
    ],
  ),
  subject(
    "machine-learning",
    "Machine Learning",
    "Learn data preparation, supervised learning, neural networks, evaluation, and ethics.",
    "Machine learning develops models that improve from data, with careful attention to generalization, evaluation, bias, and responsible deployment.",
    "emerald",
    [
      { id: "ml-data-features", title: "Data and Features", description: "Turn observations into useful inputs for learning algorithms.", concepts: ["examples", "features", "labels", "data quality"], example: "Choose features that could help predict house prices without leaking the final answer.", application: "Feature design supports forecasting, fraud detection, health analytics, and personalization.", labs: ["ml-playground"] },
      { id: "ml-supervised-learning", title: "Supervised Learning", description: "Learn classification and regression from labeled examples.", concepts: ["classification", "regression", "training", "prediction"], formulas: ["mean squared error = Σ(y - ŷ)²/n"], example: "Train a simple model to classify messages as useful or unwanted.", application: "Supervised learning powers risk scoring, diagnosis, demand prediction, and recognition.", labs: ["ml-playground", "ai-training-simulator"] },
      { id: "ml-neural-networks", title: "Neural Networks", description: "Connect layers, weights, activations, and learned representations.", concepts: ["neurons", "weights", "activation functions", "backpropagation"], formulas: ["z = wx + b", "activation = f(z)"], example: "Trace an input through a small network and see how weights influence the output.", application: "Neural networks drive modern vision, speech, language, and scientific models.", labs: ["neural-network-visualizer"] },
      { id: "ml-evaluation", title: "Model Evaluation", description: "Measure generalization with validation data and useful metrics.", concepts: ["training split", "validation split", "precision", "recall"], formulas: ["accuracy = correct predictions/total predictions"], example: "Explain why a medical screening model may prioritize recall over raw accuracy.", application: "Evaluation helps teams choose reliable models and monitor them after deployment.", labs: ["computer-vision-demo", "ml-playground"] },
      { id: "ml-responsible", title: "Responsible Machine Learning", description: "Identify bias, privacy, transparency, and deployment risks.", concepts: ["bias", "fairness", "privacy", "human oversight"], example: "Audit whether a training dataset represents the people affected by a model.", application: "Responsible practices reduce harm in finance, hiring, education, health, and public services.", labs: ["ai-training-simulator"] },
    ],
  ),
  subject(
    "robotics",
    "Robotics",
    "Combine sensors, actuators, motion, control, and autonomy.",
    "Robotics integrates mechanics, electronics, control, and software so machines can sense their environment and act safely toward useful goals.",
    "rose",
    [
      { id: "robotics-sensors", title: "Sensors", description: "Measure distance, light, motion, temperature, and orientation.", concepts: ["measurement", "calibration", "noise", "sensor fusion"], example: "Compare repeated ultrasonic readings and estimate the effect of measurement noise.", application: "Robots use sensors in warehouses, farms, hospitals, vehicles, and homes.", labs: ["sensor-simulator"] },
      { id: "robotics-actuators", title: "Actuators", description: "Turn electrical commands into movement with motors and servos.", concepts: ["motors", "servos", "torque", "gearing"], formulas: ["power = torque × angular speed"], example: "Choose a gear ratio that trades motor speed for greater wheel torque.", application: "Actuators move robot arms, wheels, grippers, drones, and assistive devices.", labs: ["robot-movement"] },
      { id: "robotics-movement", title: "Robot Movement", description: "Plan wheels, joints, balance, and motion across environments.", concepts: ["kinematics", "differential drive", "odometry", "trajectory"], example: "Turn a two-wheeled robot by commanding different left and right wheel speeds.", application: "Motion models support delivery robots, rovers, industrial arms, and mobility aids.", labs: ["robot-movement", "line-following-robot"] },
      { id: "robotics-control", title: "Control Systems", description: "Use feedback to make robot behavior stable and accurate.", concepts: ["feedback", "setpoints", "error", "PID control"], formulas: ["error = target - measured value"], example: "Adjust steering based on how far a line-following robot is from its target path.", application: "Feedback control stabilizes drones, factory machines, vehicles, and medical equipment.", labs: ["line-following-robot"] },
      { id: "robotics-autonomous", title: "Autonomous Robots", description: "Combine perception, planning, and control for independent action.", concepts: ["localization", "mapping", "planning", "safety"], example: "Plan a route around obstacles while updating the robot's estimated position.", application: "Autonomy supports exploration, inspection, transportation, agriculture, and disaster response.", labs: ["obstacle-avoidance"] },
    ],
  ),
  subject(
    "electronics",
    "Electronics",
    "Understand voltage, resistors, capacitors, diodes, and transistors.",
    "Electronics controls electrical signals with components and circuits, forming the foundation of computers, communication, sensors, automation, and power systems.",
    "amber",
    [
      { id: "electronics-voltage-current", title: "Voltage and Current", description: "Distinguish electrical potential from charge flow.", concepts: ["charge", "current", "voltage", "power"], formulas: ["I = Q/t", "P = VI"], example: "Calculate how much charge passes a point when 2 A flows for 3 seconds.", application: "Voltage and current measurements are basic to every electrical installation and device.", labs: ["led-circuit", "resistor-tool"] },
      { id: "electronics-resistors", title: "Resistors", description: "Control current and divide voltage using resistance.", concepts: ["resistance", "Ohm's law", "series circuits", "parallel circuits"], formulas: ["V = IR", "Rseries = R₁ + R₂"], example: "Choose a resistor that limits current safely through an LED.", application: "Resistors set signal levels, protect components, sense current, and create timing networks.", labs: ["resistor-tool", "led-circuit"] },
      { id: "electronics-capacitors", title: "Capacitors", description: "Store charge and shape timing and filtering circuits.", concepts: ["capacitance", "charge storage", "time constants", "filtering"], formulas: ["Q = CV", "τ = RC"], example: "Explain how a capacitor smooths voltage after a rectifier.", application: "Capacitors stabilize power, filter audio, time circuits, and store short bursts of energy.", labs: ["digital-circuit-builder"] },
      { id: "electronics-diodes", title: "Diodes", description: "Control current direction and convert alternating signals.", concepts: ["forward bias", "reverse bias", "rectification", "LEDs"], example: "Trace current through a bridge rectifier during both halves of an AC cycle.", application: "Diodes protect circuits, emit light, detect signals, and convert AC power.", labs: ["led-circuit"] },
      { id: "electronics-transistors", title: "Transistors", description: "Use semiconductor switches and amplifiers to control signals.", concepts: ["switching", "amplification", "logic levels", "semiconductors"], example: "Use a small control signal to switch a larger motor current.", application: "Transistors are the switching foundation of processors, memory, power electronics, and communication.", labs: ["logic-gate-simulator", "digital-circuit-builder"] },
    ],
  ),
  subject(
    "environmental-science",
    "Environmental Science",
    "Investigate climate, pollution, renewable energy, water, and biodiversity.",
    "Environmental science combines Earth systems, biology, chemistry, policy, and data to understand human impacts and design practical, equitable solutions.",
    "emerald",
    [
      { id: "environment-climate-change", title: "Climate Change", description: "Examine greenhouse gases, evidence, impacts, and mitigation.", concepts: ["greenhouse effect", "emissions", "climate evidence", "mitigation"], example: "Compare how different emissions pathways influence future warming.", application: "Climate knowledge guides energy systems, infrastructure, agriculture, and disaster planning.", labs: ["climate-change", "carbon-footprint"] },
      { id: "environment-pollution", title: "Pollution", description: "Trace air, water, soil, noise, and plastic pollution.", concepts: ["sources", "exposure", "ecosystem effects", "prevention"], example: "Trace nutrient runoff from a field to oxygen depletion in a lake.", application: "Pollution science informs regulation, product design, public health, and cleanup.", labs: ["water-cycle", "carbon-footprint"] },
      { id: "environment-renewable-energy", title: "Renewable Energy", description: "Compare solar, wind, hydro, geothermal, and storage.", concepts: ["energy resources", "capacity factor", "storage", "grid balance"], formulas: ["energy = power × time"], example: "Estimate the daily energy from solar panels using panel area and sun hours.", application: "Renewable systems reduce emissions while supporting resilient electricity and heat.", labs: ["renewable-energy"] },
      { id: "environment-water", title: "Water Conservation", description: "Understand freshwater systems and efficient water use.", concepts: ["watersheds", "groundwater", "demand", "conservation"], example: "Compare household water use before and after installing efficient fixtures.", application: "Water planning protects communities, farms, ecosystems, and industry during scarcity.", labs: ["water-cycle"] },
      { id: "environment-biodiversity", title: "Biodiversity", description: "Explore species diversity, ecosystem resilience, and conservation.", concepts: ["genetic diversity", "species diversity", "habitats", "resilience"], example: "Explain how habitat fragmentation can isolate populations and reduce genetic diversity.", application: "Biodiversity supports food, medicine, pollination, clean water, and climate resilience.", labs: ["food-chain-builder"] },
    ],
  ),
  subject(
    "finance",
    "Finance",
    "Develop practical skills for budgeting, saving, investing, interest, and risk.",
    "Finance helps people and organizations allocate money across present needs, future goals, uncertainty, and opportunity using clear assumptions and disciplined decisions.",
    "violet",
    [
      { id: "finance-budgeting", title: "Budgeting", description: "Plan income, needs, goals, and flexible spending.", concepts: ["income", "fixed expenses", "variable expenses", "cash flow"], formulas: ["surplus = income - expenses"], example: "Build a monthly plan that funds essentials, an emergency goal, and flexible spending.", application: "Budgeting supports household stability, projects, businesses, and public programs.", labs: ["budget-planner"] },
      { id: "finance-saving", title: "Saving", description: "Build emergency funds and save consistently toward goals.", concepts: ["emergency funds", "automatic saving", "liquidity", "time horizon"], example: "Calculate how long a regular monthly transfer takes to reach an emergency-fund target.", application: "Savings reduce reliance on debt and prepare for goals and unexpected costs.", labs: ["compound-interest", "budget-planner"] },
      { id: "finance-investing", title: "Investing Basics", description: "Learn assets, diversification, time horizons, and compounding.", concepts: ["assets", "diversification", "return", "time horizon"], formulas: ["future value = present value × (1 + r)ᵗ"], example: "Compare a diversified portfolio with concentrating all money in one company.", application: "Investing can support retirement, education, business growth, and long-term goals.", labs: ["investment-simulator", "risk-return"] },
      { id: "finance-interest", title: "Interest", description: "Calculate simple and compound interest for saving and borrowing.", concepts: ["principal", "rate", "simple interest", "compound interest"], formulas: ["I = Prt", "A = P(1 + r/n)ⁿᵗ"], example: "Compare the balance of the same deposit under simple and compound interest.", application: "Interest affects savings accounts, loans, credit cards, mortgages, and bonds.", labs: ["compound-interest"] },
      { id: "finance-risk", title: "Risk Management", description: "Balance uncertainty, insurance, diversification, and return.", concepts: ["probability", "impact", "insurance", "risk-return tradeoff"], example: "Choose between retaining a small risk and insuring against a rare, severe loss.", application: "Risk management protects households, investments, businesses, and public infrastructure.", labs: ["risk-return"] },
    ],
  ),
  subject(
    "agriculture",
    "Agriculture",
    "Explore soil, irrigation, crop rotation, nutrients, and smart farming.",
    "Agriculture combines biology, environmental systems, engineering, economics, and data to produce food while protecting soil, water, biodiversity, and livelihoods.",
    "rose",
    [
      { id: "agriculture-soil", title: "Soil Health", description: "Understand soil structure, nutrients, organisms, and erosion.", concepts: ["soil texture", "organic matter", "microorganisms", "erosion"], example: "Compare how sandy and clay-rich soils hold water after rainfall.", application: "Healthy soil improves crop resilience, water storage, carbon retention, and productivity.", labs: ["soil-health"] },
      { id: "agriculture-irrigation", title: "Irrigation", description: "Compare water delivery methods and efficient scheduling.", concepts: ["crop demand", "drip irrigation", "evaporation", "water efficiency"], formulas: ["water volume = field area × application depth"], example: "Estimate the water required to apply 10 mm of irrigation over one hectare.", application: "Efficient irrigation protects water supplies while maintaining crop growth.", labs: ["irrigation-simulator"] },
      { id: "agriculture-rotation", title: "Crop Rotation", description: "Use crop sequences to improve soil and reduce pests.", concepts: ["crop families", "nitrogen fixation", "pest cycles", "soil cover"], example: "Design a rotation that alternates cereals, legumes, and cover crops.", application: "Rotation can reduce fertilizer demand, improve soil, and interrupt weeds and disease.", labs: ["crop-rotation"] },
      { id: "agriculture-fertilizers", title: "Fertilizers", description: "Match plant nutrient needs with responsible fertilizer use.", concepts: ["nitrogen", "phosphorus", "potassium", "nutrient loss"], example: "Use a soil test to avoid applying a nutrient already present in sufficient amounts.", application: "Precise nutrient management improves yield while reducing cost and water pollution.", labs: ["soil-health", "smart-farming"] },
      { id: "agriculture-smart-farming", title: "Smart Farming", description: "Apply sensors, drones, data, and automation on farms.", concepts: ["field sensors", "remote sensing", "precision application", "automation"], example: "Use soil-moisture readings to irrigate only the driest parts of a field.", application: "Smart farming can improve resource efficiency, traceability, safety, and climate resilience.", labs: ["smart-farming", "irrigation-simulator"] },
    ],
  ),
];

export const subjectNames = subjects.map((item) => item.name);

export function getSubjectById(subjectId: string) {
  return subjects.find((item) => item.id === subjectId);
}

export function getSubjectByName(subjectName: string) {
  return subjects.find((item) => item.name === subjectName);
}

export function getLessonById(lessonId: string) {
  for (const item of subjects) {
    const lesson = item.lessons.find((candidate) => candidate.id === lessonId);

    if (lesson) {
      return { lesson, subject: item };
    }
  }

  return undefined;
}

import type { BtechBranchId } from "@/lib/btech-branches";
import {
  createBtechUnits,
  type BtechLessonSeed,
  type BtechUnit,
} from "@/lib/btech-lessons";

export type CodingLanguage = "C" | "C++" | "Java" | "Python" | "JavaScript" | "SQL";
export type CodingDifficulty = "easy" | "medium" | "hard";

export type CodingPracticeProblem = {
  id: string;
  title: string;
  subjectId: string;
  languages: CodingLanguage[];
  difficulty: CodingDifficulty;
  prompt: string;
  starterCode: Partial<Record<CodingLanguage, string>>;
  testCases: { input: string; expectedOutput: string }[];
  hints: string[];
  reviewFocus: string[];
};

export type BtechSubjectPlan = {
  id: string;
  title: string;
  branchId: BtechBranchId;
  credits: number;
  description: string;
  labId: string;
  codingPracticeIds: string[];
  lessonSeeds: BtechLessonSeed[];
};

export type BtechSubject = BtechSubjectPlan & {
  yearId: string;
  semesterId: string;
  units: BtechUnit[];
};

function lesson(title: string, keyPoints: string[], formulas?: string[]): BtechLessonSeed {
  return { title, keyPoints, formulas };
}

function plan(
  id: string,
  title: string,
  branchId: BtechBranchId,
  labId: string,
  topics: string[],
  description: string,
  codingPracticeIds: string[] = [],
  credits = 4,
): BtechSubjectPlan {
  return {
    id,
    title,
    branchId,
    credits,
    description,
    labId,
    codingPracticeIds,
    lessonSeeds: [
      ...topics.map((topic) =>
        lesson(topic, [
          `${topic} definition`,
          `${title} model`,
          "engineering constraints",
          "worked example",
        ]),
      ),
      lesson("Lab model and simulation", [
        "input variables",
        "state changes",
        "visual feedback",
        "resettable experiment",
      ]),
      lesson("Industry case study", [
        "real-world application",
        "tradeoffs and constraints",
        "failure modes",
        "engineering decision",
      ]),
      lesson("Exam and interview practice", [
        "concept recall",
        "formula selection",
        "scenario reasoning",
        "answer explanation",
      ]),
    ],
  };
}

export const btechSubjectPlans: BtechSubjectPlan[] = [
  plan("calculus", "Calculus", "data-science", "gradient-descent-lab", ["Limits", "Derivatives", "Integrals", "Optimization"], "Rates of change, accumulation, and optimization for engineering models."),
  plan("linear-algebra", "Linear Algebra", "data-science", "neural-forward-lab", ["Vectors", "Matrices", "Eigenvalues", "Linear transformations"], "Vector spaces, matrices, and transformations used across graphics, circuits, data, and AI."),
  plan("probability", "Probability", "data-science", "gradient-descent-lab", ["Events", "Conditional probability", "Random variables", "Bayes rule"], "Uncertainty modeling for analytics, ML, networks, risk, and simulation."),
  plan("statistics", "Statistics", "data-science", "soil-health-lab", ["Descriptive statistics", "Sampling", "Hypothesis tests", "Regression"], "Data summarization, inference, uncertainty, and decision support."),
  plan("engineering-economics", "Engineering Economics", "data-science", "compound-interest-calculator-lab", ["Time value of money", "Budget planning", "Investment decisions", "Risk and return"], "Financial reasoning for engineering projects, products, budgets, and tradeoffs."),
  plan("discrete-mathematics", "Discrete Mathematics", "cse", "graph-bfs-dfs-lab", ["Logic", "Sets", "Relations", "Graph theory"], "Mathematical structures behind algorithms, databases, networks, and computation."),
  plan("engineering-chemistry", "Engineering Chemistry", "ece", "molecule-formation-lab", ["Atomic structure", "Chemical bonding", "pH and corrosion", "Reaction balancing"], "Chemical foundations for materials, water quality, energy, electronics, and manufacturing."),
  plan("engineering-biology", "Engineering Biology", "aiml", "dna-base-pairs-lab", ["Cell structure", "DNA base pairs", "Photosynthesis flow", "Biotech applications"], "Biology concepts used in bio-inspired computing, health technology, environment, and data science."),
  plan("c-programming", "C Programming", "cse", "c-memory-allocation-lab", ["Control flow", "Functions", "Arrays and strings", "Pointers"], "Procedural programming, memory, and low-level problem solving.", ["c-array-sum", "c-pointer-swap"]),
  plan("cpp-programming", "C++", "cse", "java-oop-class-object-lab", ["Classes", "STL containers", "References", "Templates"], "Object-oriented and generic programming for performance-oriented systems.", ["cpp-linked-list", "cpp-heap-kth"]),
  plan("python-programming", "Python Programming", "cse", "python-execution-flow-lab", ["Data types", "Functions", "Files", "Modules"], "Readable programming for automation, data, AI, and scripting.", ["py-frequency-map", "py-palindrome"]),
  plan("java-programming", "Java Programming", "cse", "java-oop-class-object-lab", ["Classes", "Collections", "Exceptions", "Threads"], "Portable OOP, collections, concurrency, and enterprise development.", ["java-two-sum", "java-bank-account"]),
  plan("object-oriented-programming", "Object Oriented Programming", "cse", "java-oop-class-object-lab", ["Objects", "Encapsulation", "Inheritance", "Polymorphism"], "Design software around classes, responsibilities, interfaces, and reuse.", ["java-bank-account", "cpp-polymorphism"]),
  plan("data-structures", "Data Structures", "cse", "stack-push-pop-lab", ["Arrays", "Stacks and queues", "Linked lists", "Trees and graphs"], "Organize data for efficient access, update, traversal, and storage.", ["js-stack-validator", "cpp-linked-list"]),
  plan("advanced-data-structures", "Advanced Data Structures", "cse", "tree-traversal-lab", ["Heaps", "Hash tables", "Balanced trees", "Tries"], "High-performance structures for indexing, priority, search, and routing.", ["cpp-heap-kth", "java-trie-prefix"]),
  plan("algorithms", "Algorithms", "cse", "sorting-animation-lab", ["Correctness", "Complexity", "Searching", "Sorting"], "Step-by-step computational problem solving with proofs and performance.", ["js-binary-search"]),
  plan("design-and-analysis-of-algorithms", "Design and Analysis of Algorithms", "cse", "dijkstra-lab", ["Divide and conquer", "Greedy algorithms", "Dynamic programming", "Graph algorithms"], "Design paradigms, asymptotic analysis, and optimization.", ["js-binary-search", "py-dijkstra"]),
  plan("operating-systems", "Operating Systems", "cse", "process-scheduling-lab", ["Processes", "CPU scheduling", "Memory paging", "Deadlocks"], "Resource management, process control, memory, files, and concurrency.", ["c-round-robin"]),
  plan("computer-networks", "Computer Networks", "it", "packet-transfer-lab", ["TCP/IP", "Packet transfer", "Routing", "Congestion"], "Protocols, packet flow, addressing, routing, and reliable communication."),
  plan("dbms", "DBMS", "data-science", "db-relationship-lab", ["ER models", "Normalization", "Transactions", "Indexes"], "Database design, relational integrity, transactions, and query planning.", ["sql-top-customers", "sql-join-orders"]),
  plan("sql", "SQL", "data-science", "sql-query-execution-lab", ["SELECT queries", "Joins", "Aggregation", "Window functions"], "Query relational databases and reason about execution plans.", ["sql-top-customers", "sql-dashboard-query"]),
  plan("software-engineering", "Software Engineering", "it", "process-scheduling-lab", ["Requirements", "Architecture", "Testing", "Agile delivery"], "Engineering practices for reliable, maintainable software systems."),
  plan("web-technologies", "Web Technologies", "it", "packet-transfer-lab", ["HTTP", "Frontend", "Backend APIs", "Deployment"], "The full web stack from browser rendering to server APIs.", ["js-api-client"]),
  plan("html", "HTML", "it", "python-execution-flow-lab", ["Semantic tags", "Forms", "Accessibility", "Document structure"], "Structure web content for accessibility and maintainability.", ["js-dom-filter"], 3),
  plan("css", "CSS", "it", "python-execution-flow-lab", ["Selectors", "Box model", "Flexbox", "Responsive design"], "Style responsive layouts and interface states.", ["js-dom-filter"], 3),
  plan("javascript", "JavaScript", "it", "python-execution-flow-lab", ["Variables", "DOM", "Async code", "Modules"], "Interactive browser and server-side programming.", ["js-dom-filter", "js-api-client"]),
  plan("react", "React", "it", "python-execution-flow-lab", ["Components", "State", "Effects", "Routing"], "Build component-based user interfaces and application flows.", ["js-api-client"]),
  plan("node-js", "Node.js", "it", "packet-transfer-lab", ["Runtime", "APIs", "Streams", "Server patterns"], "JavaScript backend services, APIs, and tooling.", ["js-api-client"]),
  plan("cloud-computing", "Cloud Computing", "it", "routing-lab", ["Virtualization", "Containers", "Serverless", "Cloud architecture"], "Deploy scalable compute, storage, networking, and managed services."),
  plan("distributed-systems", "Distributed Systems", "it", "routing-lab", ["Replication", "Consistency", "Consensus", "Fault tolerance"], "Coordinate reliable systems across multiple machines."),
  plan("devops", "DevOps", "it", "routing-lab", ["CI/CD", "Containers", "Monitoring", "Infrastructure as code"], "Automate delivery, operations, observability, and reliability."),
  plan("cyber-security", "Cyber Security", "cyber-security", "tcp-handshake-lab", ["Threat models", "Authentication", "Network defense", "Secure design"], "Protect systems against attacks through design, monitoring, and response.", ["py-caesar-cracker"]),
  plan("cryptography", "Cryptography", "cyber-security", "tcp-handshake-lab", ["Symmetric crypto", "Public key crypto", "Hashing", "Digital signatures"], "Secure communication, identity, integrity, and confidentiality.", ["py-caesar-cracker"]),
  plan("artificial-intelligence", "Artificial Intelligence", "aiml", "neural-forward-lab", ["Intelligent agents", "Search", "Knowledge representation", "Planning"], "Build systems that perceive, reason, plan, and act."),
  plan("machine-learning", "Machine Learning", "aiml", "gradient-descent-lab", ["Features", "Regression", "Classification", "Evaluation"], "Train models from data and evaluate generalization.", ["py-linear-regression", "py-kmeans"]),
  plan("deep-learning", "Deep Learning", "aiml", "cnn-filter-lab", ["Backpropagation", "CNNs", "RNNs", "Transformers"], "Neural architectures for vision, language, and representation learning.", ["py-gradient-step"]),
  plan("natural-language-processing", "Natural Language Processing", "aiml", "tokenization-lab", ["Tokenization", "Embeddings", "Attention", "Transformers"], "Teach computers to process and generate language.", ["py-token-counter"]),
  plan("computer-vision", "Computer Vision", "aiml", "object-detection-lab", ["Image preprocessing", "Classification", "Object detection", "Evaluation"], "Extract information from images and video."),
  plan("big-data-analytics", "Big Data Analytics", "data-science", "sql-query-execution-lab", ["Data lakes", "Distributed processing", "Streaming", "Analytics"], "Analyze large-scale data pipelines and distributed datasets.", ["sql-window-sales"]),
  plan("data-visualization", "Data Visualization", "data-science", "soil-health-lab", ["Charts", "Dashboards", "Visual encoding", "Storytelling"], "Communicate data with accurate, readable, interactive visuals.", ["sql-dashboard-query"]),
  plan("smart-agriculture", "Smart Agriculture", "civil", "smart-farming-dashboard-lab", ["Farm sensors", "Soil health", "Crop rotation", "Irrigation automation"], "Apply sensing, data, water management, and planning to sustainable farms."),
  plan("compiler-design", "Compiler Design", "cse", "recursion-call-stack-lab", ["Lexical analysis", "Parsing", "Intermediate code", "Optimization"], "Translate source code into executable instructions.", ["js-tokenizer"]),
  plan("theory-of-computation", "Theory of Computation", "cse", "graph-bfs-dfs-lab", ["Automata", "Regular languages", "Grammars", "Turing machines"], "Understand formal languages and computational limits."),
  plan("iot", "IoT", "robotics", "packet-transfer-lab", ["Sensors", "Protocols", "Edge devices", "Cloud telemetry"], "Connect embedded devices to data and automation systems."),
  plan("robotics", "Robotics", "robotics", "graph-bfs-dfs-lab", ["Sensors", "Actuators", "Kinematics", "Autonomy"], "Combine mechanics, electronics, control, and software for robots."),
  plan("embedded-systems", "Embedded Systems", "ece", "circuit-current-lab", ["Microcontrollers", "Interrupts", "Timers", "Firmware"], "Build software that controls hardware in real time."),
  plan("electronics", "Electronics", "ece", "logic-gate-flow-lab", ["Diodes", "Transistors", "Amplifiers", "Digital signals"], "Control and process electrical signals with components."),
  plan("electrical-circuits", "Electrical Circuits", "eee", "circuit-current-lab", ["Ohm's law", "Series circuits", "Parallel circuits", "Power"], "Analyze voltage, current, resistance, and power.", [], 4),
  plan("digital-logic-design", "Digital Logic Design", "ece", "logic-gate-flow-lab", ["Boolean algebra", "Logic gates", "Flip-flops", "Counters"], "Design combinational and sequential digital circuits."),
  plan("signals-and-systems", "Signals and Systems", "ece", "wave-optics-lab", ["Signals", "Systems", "Convolution", "Frequency response"], "Represent, transform, and analyze signals."),
  plan("control-systems", "EEE Control Systems", "eee", "motor-rotation-lab", ["Feedback", "Transfer functions", "Stability", "PID control"], "Design stable systems that regulate behavior."),
  plan("renewable-energy-systems", "Renewable Energy Systems", "eee", "renewable-energy-explorer-lab", ["Solar output", "Wind generation", "Hydro energy", "Storage planning"], "Model renewable sources, storage, grid integration, and sustainable energy tradeoffs."),
  plan("engineering-mechanics", "Engineering Mechanics", "mechanical", "bridge-load-lab", ["Forces", "Equilibrium", "Friction", "Motion"], "Analyze forces and motion in engineering bodies."),
  plan("thermodynamics", "Thermodynamics", "mechanical", "thermo-cycle-lab", ["Heat", "Work", "First law", "Cycles"], "Study energy transfer, engines, and thermal systems."),
  plan("fluid-mechanics", "Fluid Mechanics", "mechanical", "irrigation-flow-lab", ["Fluid properties", "Pressure", "Flow", "Bernoulli equation"], "Analyze liquid and gas behavior in engineering systems."),
  plan("strength-of-materials", "Strength of Materials", "mechanical", "beam-stress-lab", ["Stress", "Strain", "Bending", "Deflection"], "Understand material response under loads."),
  plan("surveying", "Surveying", "civil", "surveying-measurement-lab", ["Distance", "Angles", "Leveling", "Mapping"], "Measure land, elevation, and alignment for civil works."),
  plan("environmental-engineering", "Environmental Engineering", "civil", "soil-health-lab", ["Water treatment", "Wastewater", "Pollution", "Sustainability"], "Protect water, air, soil, and public health through engineering."),
  plan("environmental-science", "Environmental Science", "civil", "climate-change-visualizer-lab", ["Carbon footprint", "Water cycle", "Climate systems", "Renewable energy"], "Understand environmental systems, climate risk, resource cycles, and sustainability metrics."),
];

const planById = new Map(btechSubjectPlans.map((subject) => [subject.id, subject]));

export function getBtechSubjectPlan(subjectId: string) {
  return planById.get(subjectId);
}

export function createBtechSubject(
  subjectId: string,
  context: { yearId: string; semesterId: string; branchId?: BtechBranchId },
): BtechSubject {
  const subject = getBtechSubjectPlan(subjectId);

  if (!subject) {
    throw new Error(`Unknown B.Tech subject: ${subjectId}`);
  }

  const branchId = context.branchId ?? subject.branchId;

  return {
    ...subject,
    branchId,
    yearId: context.yearId,
    semesterId: context.semesterId,
    units: createBtechUnits({
      year: context.yearId,
      semester: context.semesterId,
      branch: branchId,
      subject: subject.title,
      subjectId: subject.id,
      labId: subject.labId,
      codingPracticeIds: subject.codingPracticeIds,
      lessonSeeds: subject.lessonSeeds,
    }),
  };
}

export const codingPracticeProblems: CodingPracticeProblem[] = [
  {
    id: "c-array-sum",
    title: "Array Sum in C",
    subjectId: "c-programming",
    languages: ["C"],
    difficulty: "easy",
    prompt: "Read n integers and print their sum.",
    starterCode: { C: "#include <stdio.h>\n\nint main(void) {\n  int n;\n  scanf(\"%d\", &n);\n  // TODO: compute sum\n  return 0;\n}\n" },
    testCases: [{ input: "5\n1 2 3 4 5", expectedOutput: "15" }],
    hints: ["Use a loop from 0 to n - 1.", "Initialize sum to 0 before reading values."],
    reviewFocus: ["loop bounds", "integer initialization", "input handling"],
  },
  {
    id: "c-pointer-swap",
    title: "Pointer Swap",
    subjectId: "c-programming",
    languages: ["C"],
    difficulty: "medium",
    prompt: "Write a function that swaps two integers using pointers.",
    starterCode: { C: "void swap(int *a, int *b) {\n  // TODO\n}\n" },
    testCases: [{ input: "2 9", expectedOutput: "9 2" }],
    hints: ["Dereference the pointers.", "Use a temporary variable."],
    reviewFocus: ["pointer safety", "side effects", "function design"],
  },
  {
    id: "py-frequency-map",
    title: "Frequency Map",
    subjectId: "python-programming",
    languages: ["Python"],
    difficulty: "easy",
    prompt: "Count word frequencies and print the most common word.",
    starterCode: { Python: "def most_common(words):\n    # TODO\n    return \"\"\n" },
    testCases: [{ input: "ai data ai code", expectedOutput: "ai" }],
    hints: ["Use a dictionary.", "Update the count for each word."],
    reviewFocus: ["dictionary usage", "tie handling", "clean return value"],
  },
  {
    id: "js-stack-validator",
    title: "Valid Parentheses",
    subjectId: "data-structures",
    languages: ["JavaScript", "Java", "C++", "Python"],
    difficulty: "medium",
    prompt: "Return true if brackets are balanced using a stack.",
    starterCode: { JavaScript: "export function isValid(input) {\n  const stack = [];\n  // TODO\n  return stack.length === 0;\n}\n" },
    testCases: [{ input: "{[()]}", expectedOutput: "true" }, { input: "{[(])}", expectedOutput: "false" }],
    hints: ["Push opening brackets.", "On a closing bracket, compare with the stack top."],
    reviewFocus: ["stack operations", "edge cases", "time complexity"],
  },
  {
    id: "js-binary-search",
    title: "Binary Search",
    subjectId: "design-and-analysis-of-algorithms",
    languages: ["JavaScript", "Java", "C++", "Python"],
    difficulty: "easy",
    prompt: "Return the index of a target in a sorted array, or -1.",
    starterCode: { JavaScript: "export function binarySearch(values, target) {\n  let left = 0;\n  let right = values.length - 1;\n  // TODO\n  return -1;\n}\n" },
    testCases: [{ input: "[1,3,5,7], 5", expectedOutput: "2" }],
    hints: ["Use mid = Math.floor((left + right) / 2).", "Move only one boundary per comparison."],
    reviewFocus: ["off-by-one errors", "loop invariant", "O(log n) reasoning"],
  },
  {
    id: "py-dijkstra",
    title: "Shortest Path",
    subjectId: "design-and-analysis-of-algorithms",
    languages: ["Python", "C++", "Java"],
    difficulty: "hard",
    prompt: "Implement Dijkstra's algorithm for a weighted graph.",
    starterCode: { Python: "import heapq\n\ndef dijkstra(graph, start):\n    dist = {node: float('inf') for node in graph}\n    # TODO\n    return dist\n" },
    testCases: [{ input: "A->B:4,A->C:1,C->B:2", expectedOutput: "B=3" }],
    hints: ["Use a priority queue.", "Skip stale queue entries."],
    reviewFocus: ["priority queue correctness", "relaxation", "graph representation"],
  },
  {
    id: "sql-top-customers",
    title: "Top Customers SQL",
    subjectId: "sql",
    languages: ["SQL"],
    difficulty: "medium",
    prompt: "Find the top five customers by total order value.",
    starterCode: { SQL: "SELECT c.name, SUM(o.total) AS revenue\nFROM customers c\nJOIN orders o ON o.customer_id = c.id\n-- TODO\n" },
    testCases: [{ input: "customers, orders", expectedOutput: "name revenue sorted desc" }],
    hints: ["GROUP BY customer.", "ORDER BY revenue DESC LIMIT 5."],
    reviewFocus: ["joins", "aggregation", "ordering"],
  },
  {
    id: "py-linear-regression",
    title: "One-Step Linear Regression",
    subjectId: "machine-learning",
    languages: ["Python"],
    difficulty: "medium",
    prompt: "Compute one gradient descent update for y = wx + b.",
    starterCode: { Python: "def step(xs, ys, w, b, lr):\n    # TODO\n    return w, b\n" },
    testCases: [{ input: "xs=[1,2], ys=[2,4], w=0, b=0, lr=.1", expectedOutput: "updated w,b" }],
    hints: ["Compute predictions.", "Average the gradient over examples."],
    reviewFocus: ["gradient formulas", "learning rate", "numerical clarity"],
  },
  {
    id: "py-token-counter",
    title: "Token Counter",
    subjectId: "natural-language-processing",
    languages: ["Python", "JavaScript"],
    difficulty: "easy",
    prompt: "Split text into normalized tokens and count them.",
    starterCode: { Python: "def count_tokens(text):\n    # TODO\n    return 0\n" },
    testCases: [{ input: "AI, AI for engineers!", expectedOutput: "4" }],
    hints: ["Lowercase text.", "Strip punctuation before splitting."],
    reviewFocus: ["normalization", "token boundaries", "edge cases"],
  },
  {
    id: "js-api-client",
    title: "Resilient API Client",
    subjectId: "node-js",
    languages: ["JavaScript"],
    difficulty: "hard",
    prompt: "Fetch JSON with retry and graceful error handling.",
    starterCode: { JavaScript: "export async function fetchJson(url) {\n  // TODO\n}\n" },
    testCases: [{ input: "failing twice then success", expectedOutput: "resolved data" }],
    hints: ["Use a loop for attempts.", "Throw a useful final error."],
    reviewFocus: ["async control flow", "error messages", "retry limits"],
  },
  {
    id: "sql-dashboard-query",
    title: "Dashboard Query",
    subjectId: "data-visualization",
    languages: ["SQL"],
    difficulty: "medium",
    prompt: "Aggregate weekly score by subject for a dashboard.",
    starterCode: { SQL: "SELECT subject, AVG(score) AS avg_score\nFROM attempts\n-- TODO\n" },
    testCases: [{ input: "attempts", expectedOutput: "subject avg_score grouped" }],
    hints: ["Use GROUP BY subject.", "Filter only completed attempts if needed."],
    reviewFocus: ["aggregation", "dashboard usefulness", "filters"],
  },
];

export function getCodingPracticeProblems(subjectId?: string) {
  return subjectId
    ? codingPracticeProblems.filter((problem) => problem.subjectId === subjectId)
    : codingPracticeProblems;
}

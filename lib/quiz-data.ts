import type { QuizQuestion } from "@/types";
import { subjects } from "@/lib/subjects";

type QuestionSeed = Omit<QuizQuestion, "id" | "subject" | "lessonId">;

const questionBanks: Record<string, QuestionSeed[]> = {
  Physics: [
    { lesson: "Gravity and Motion", difficulty: "easy", question: "What happens to the speed of an object in free fall near Earth's surface when air resistance is ignored?", options: ["It increases", "It decreases", "It stays constant", "It becomes zero"], correctAnswer: "It increases", explanation: "Gravity produces a nearly constant downward acceleration, so the object's speed increases while it falls." },
    { lesson: "Gravity and Motion", difficulty: "medium", question: "A car changes velocity from 10 m/s to 22 m/s in 4 seconds. What is its average acceleration?", options: ["3 m/s²", "5.5 m/s²", "8 m/s²", "32 m/s²"], correctAnswer: "3 m/s²", explanation: "Average acceleration is change in velocity divided by time: (22 - 10) / 4 = 3 m/s²." },
    { lesson: "Newton's Laws", difficulty: "easy", question: "Which law explains why a passenger moves forward when a car stops suddenly?", options: ["Newton's first law", "Newton's second law", "Newton's third law", "Law of gravitation"], correctAnswer: "Newton's first law", explanation: "Inertia keeps the passenger's body moving forward unless a force such as a seat belt stops it." },
    { lesson: "Newton's Laws", difficulty: "hard", question: "A 6 kg object accelerates at 4 m/s². What net force acts on it?", options: ["1.5 N", "10 N", "24 N", "40 N"], correctAnswer: "24 N", explanation: "Newton's second law gives F = ma = 6 × 4 = 24 N." },
    { lesson: "Electricity and Circuits", difficulty: "easy", question: "What quantity is measured in amperes?", options: ["Voltage", "Current", "Resistance", "Energy"], correctAnswer: "Current", explanation: "An ampere measures electric current, the rate at which charge flows." },
    { lesson: "Electricity and Circuits", difficulty: "medium", question: "What current flows through a 6 ohm resistor connected to 12 volts?", options: ["0.5 A", "2 A", "6 A", "72 A"], correctAnswer: "2 A", explanation: "Ohm's law gives I = V/R = 12/6 = 2 A." },
    { lesson: "Waves and Sound", difficulty: "easy", question: "Which property of a sound wave mainly determines its pitch?", options: ["Amplitude", "Frequency", "Speed", "Intensity"], correctAnswer: "Frequency", explanation: "Higher-frequency sound waves are heard as higher pitches." },
    { lesson: "Waves and Sound", difficulty: "hard", question: "A wave travels at 340 m/s and has a frequency of 170 Hz. What is its wavelength?", options: ["0.5 m", "2 m", "170 m", "510 m"], correctAnswer: "2 m", explanation: "Using v = fλ, wavelength λ = 340/170 = 2 m." },
    { lesson: "Light and Optics", difficulty: "medium", question: "Why does a straw appear bent when partly submerged in water?", options: ["Reflection", "Refraction", "Diffraction", "Polarization"], correctAnswer: "Refraction", explanation: "Light changes speed and direction as it passes between water and air." },
    { lesson: "Light and Optics", difficulty: "hard", question: "What kind of image does a converging lens form when an object is beyond twice the focal length?", options: ["Real, inverted, and smaller", "Virtual, upright, and larger", "Real, upright, and larger", "Virtual, inverted, and smaller"], correctAnswer: "Real, inverted, and smaller", explanation: "For an object beyond 2f, a converging lens forms a real inverted image between f and 2f that is reduced." },
  ],
  Chemistry: [
    { lesson: "Atoms and Molecules", difficulty: "easy", question: "Which particle determines the atomic number of an element?", options: ["Proton", "Neutron", "Electron", "Photon"], correctAnswer: "Proton", explanation: "The atomic number equals the number of protons in the nucleus." },
    { lesson: "Atoms and Molecules", difficulty: "medium", question: "How many atoms are present in one molecule of H₂O?", options: ["1", "2", "3", "4"], correctAnswer: "3", explanation: "H₂O contains two hydrogen atoms and one oxygen atom, for three atoms total." },
    { lesson: "Periodic Table", difficulty: "easy", question: "Elements in the same vertical group of the periodic table usually have similar what?", options: ["Chemical properties", "Atomic masses", "Numbers of shells", "Physical states"], correctAnswer: "Chemical properties", explanation: "Group members have similar valence-electron arrangements and therefore similar chemical behavior." },
    { lesson: "Periodic Table", difficulty: "hard", question: "Which trend generally increases from left to right across a period?", options: ["Atomic radius", "Metallic character", "Electronegativity", "Number of electron shells"], correctAnswer: "Electronegativity", explanation: "Increasing effective nuclear charge generally raises electronegativity across a period." },
    { lesson: "Chemical Reactions", difficulty: "easy", question: "What must be conserved when a chemical equation is balanced?", options: ["Number of each type of atom", "Number of molecules", "Volume of each substance", "Physical state"], correctAnswer: "Number of each type of atom", explanation: "Atoms are rearranged but not created or destroyed in an ordinary chemical reaction." },
    { lesson: "Chemical Reactions", difficulty: "medium", question: "A reaction that releases heat to its surroundings is called what?", options: ["Endothermic", "Exothermic", "Reversible", "Neutral"], correctAnswer: "Exothermic", explanation: "Exothermic reactions transfer energy, commonly as heat, to the surroundings." },
    { lesson: "Acids and Bases", difficulty: "easy", question: "Which pH value represents an acidic solution?", options: ["3", "7", "9", "12"], correctAnswer: "3", explanation: "At room temperature, solutions with pH below 7 are acidic." },
    { lesson: "Acids and Bases", difficulty: "medium", question: "What are the typical products of acid-base neutralization?", options: ["Salt and water", "Metal and hydrogen", "Acid and oxygen", "Base and carbon dioxide"], correctAnswer: "Salt and water", explanation: "Hydrogen ions from the acid combine with hydroxide ions from the base to form water, leaving a salt." },
    { lesson: "Organic Chemistry Basics", difficulty: "medium", question: "Which element forms the backbone of organic molecules?", options: ["Carbon", "Sodium", "Calcium", "Iron"], correctAnswer: "Carbon", explanation: "Carbon can form four covalent bonds and stable chains, rings, and frameworks." },
    { lesson: "Organic Chemistry Basics", difficulty: "hard", question: "Which functional group identifies an alcohol?", options: ["Hydroxyl (-OH)", "Carboxyl (-COOH)", "Amino (-NH₂)", "Carbonyl (>C=O)"], correctAnswer: "Hydroxyl (-OH)", explanation: "Alcohols contain a hydroxyl group attached to a carbon atom." },
  ],
  Biology: [
    { lesson: "Cell Structure", difficulty: "easy", question: "Which organelle contains most of a eukaryotic cell's DNA?", options: ["Nucleus", "Ribosome", "Golgi apparatus", "Lysosome"], correctAnswer: "Nucleus", explanation: "The nucleus stores most of the cell's genetic material." },
    { lesson: "Cell Structure", difficulty: "medium", question: "What is the main function of mitochondria?", options: ["Produce ATP", "Store genetic traits", "Make cell walls", "Digest sunlight"], correctAnswer: "Produce ATP", explanation: "Mitochondria carry out cellular respiration to make ATP, a usable form of cellular energy." },
    { lesson: "Human Body Systems", difficulty: "easy", question: "Which body system transports oxygen and nutrients?", options: ["Circulatory system", "Digestive system", "Skeletal system", "Endocrine system"], correctAnswer: "Circulatory system", explanation: "Blood vessels and the heart move oxygen, nutrients, hormones, and wastes around the body." },
    { lesson: "Human Body Systems", difficulty: "hard", question: "Where does most nutrient absorption occur in the digestive system?", options: ["Small intestine", "Stomach", "Large intestine", "Esophagus"], correctAnswer: "Small intestine", explanation: "The small intestine has folds and villi that provide a large surface area for nutrient absorption." },
    { lesson: "Genetics", difficulty: "easy", question: "What molecule carries hereditary information in most organisms?", options: ["DNA", "ATP", "Glucose", "Cellulose"], correctAnswer: "DNA", explanation: "DNA stores genetic instructions in sequences of nucleotide bases." },
    { lesson: "Genetics", difficulty: "medium", question: "An organism with two different alleles for a gene is described as what?", options: ["Heterozygous", "Homozygous", "Asexual", "Diploid only"], correctAnswer: "Heterozygous", explanation: "Heterozygous means the two allele versions at a gene locus are different." },
    { lesson: "Photosynthesis", difficulty: "easy", question: "Which gas do plants take in for photosynthesis?", options: ["Carbon dioxide", "Oxygen", "Nitrogen", "Hydrogen"], correctAnswer: "Carbon dioxide", explanation: "Plants use carbon dioxide and water to build glucose during photosynthesis." },
    { lesson: "Photosynthesis", difficulty: "hard", question: "In which organelle does photosynthesis occur?", options: ["Chloroplast", "Mitochondrion", "Nucleus", "Vacuole"], correctAnswer: "Chloroplast", explanation: "Chloroplasts contain chlorophyll and the membrane systems used to capture light energy." },
    { lesson: "Ecosystems", difficulty: "medium", question: "What is the primary source of energy for most ecosystems?", options: ["Sunlight", "Soil minerals", "Wind", "Decomposers"], correctAnswer: "Sunlight", explanation: "Producers capture solar energy, which then moves through food chains." },
    { lesson: "Ecosystems", difficulty: "hard", question: "Why is less energy available at higher trophic levels?", options: ["Energy is lost as heat and through metabolism", "Predators destroy energy", "Plants absorb all oxygen", "Matter stops cycling"], correctAnswer: "Energy is lost as heat and through metabolism", explanation: "Organisms use much of their energy for life processes, so only a fraction becomes biomass for the next level." },
  ],
  Mathematics: [
    { lesson: "Algebra", difficulty: "easy", question: "Solve 3x + 5 = 20.", options: ["x = 5", "x = 8", "x = 15", "x = 25"], correctAnswer: "x = 5", explanation: "Subtract 5 to get 3x = 15, then divide by 3." },
    { lesson: "Algebra", difficulty: "medium", question: "What is the slope of the line y = -2x + 7?", options: ["-2", "2", "7", "-7"], correctAnswer: "-2", explanation: "In slope-intercept form y = mx + b, the coefficient m is the slope." },
    { lesson: "Geometry", difficulty: "easy", question: "What is the sum of the interior angles of a triangle?", options: ["90°", "180°", "270°", "360°"], correctAnswer: "180°", explanation: "The three interior angles of every Euclidean triangle add to 180 degrees." },
    { lesson: "Geometry", difficulty: "hard", question: "What is the area of a circle with radius 4?", options: ["4π", "8π", "16π", "32π"], correctAnswer: "16π", explanation: "Circle area is A = πr² = π × 4² = 16π." },
    { lesson: "Trigonometry", difficulty: "easy", question: "In a right triangle, sin(θ) equals which ratio?", options: ["Opposite / hypotenuse", "Adjacent / hypotenuse", "Opposite / adjacent", "Hypotenuse / opposite"], correctAnswer: "Opposite / hypotenuse", explanation: "The mnemonic SOH gives sine = opposite divided by hypotenuse." },
    { lesson: "Trigonometry", difficulty: "medium", question: "What is cos(60°)?", options: ["0", "1/2", "√2/2", "1"], correctAnswer: "1/2", explanation: "From the standard 30-60-90 triangle, cos 60 degrees equals one half." },
    { lesson: "Calculus Basics", difficulty: "medium", question: "What is the derivative of x²?", options: ["2x", "x", "x³/3", "2"], correctAnswer: "2x", explanation: "The power rule gives d(xⁿ)/dx = nxⁿ⁻¹, so d(x²)/dx = 2x." },
    { lesson: "Calculus Basics", difficulty: "hard", question: "What does a definite integral represent geometrically when the function stays above the x-axis?", options: ["Area under the curve", "Slope at one point", "Maximum value only", "Horizontal intercept"], correctAnswer: "Area under the curve", explanation: "A definite integral accumulates signed area between the graph and the x-axis over an interval." },
    { lesson: "Probability", difficulty: "easy", question: "What is the probability of rolling an even number on a fair six-sided die?", options: ["1/6", "1/3", "1/2", "2/3"], correctAnswer: "1/2", explanation: "Three of the six outcomes, 2, 4, and 6, are even." },
    { lesson: "Probability", difficulty: "hard", question: "Two fair coins are tossed. What is the probability of getting exactly one head?", options: ["1/4", "1/2", "3/4", "1"], correctAnswer: "1/2", explanation: "The equally likely outcomes are HH, HT, TH, and TT; HT and TH have exactly one head." },
  ],
  "Computer Science": [
    { lesson: "Algorithms", difficulty: "easy", question: "What is an algorithm?", options: ["A finite sequence of steps for solving a problem", "A physical computer part", "A programming language", "A database table"], correctAnswer: "A finite sequence of steps for solving a problem", explanation: "An algorithm is a clear procedure that transforms inputs into desired outputs." },
    { lesson: "Algorithms", difficulty: "hard", question: "What is the typical time complexity of binary search on a sorted array?", options: ["O(1)", "O(log n)", "O(n)", "O(n²)"], correctAnswer: "O(log n)", explanation: "Binary search halves the remaining search range after each comparison." },
    { lesson: "Data Structures", difficulty: "easy", question: "Which data structure follows last in, first out order?", options: ["Stack", "Queue", "Graph", "Hash table"], correctAnswer: "Stack", explanation: "A stack removes the most recently added item first." },
    { lesson: "Data Structures", difficulty: "medium", question: "Which structure naturally models a network of connected cities?", options: ["Graph", "Stack", "String", "Scalar"], correctAnswer: "Graph", explanation: "Cities can be vertices and roads can be edges connecting them." },
    { lesson: "Databases", difficulty: "easy", question: "What language is commonly used to query relational databases?", options: ["SQL", "HTML", "CSS", "HTTP"], correctAnswer: "SQL", explanation: "Structured Query Language is used to define, query, and update relational data." },
    { lesson: "Databases", difficulty: "medium", question: "What is the purpose of a primary key?", options: ["Uniquely identify each row", "Encrypt every value", "Sort all columns", "Duplicate records"], correctAnswer: "Uniquely identify each row", explanation: "A primary key provides a unique identifier for each table record." },
    { lesson: "Operating Systems", difficulty: "medium", question: "What does an operating system scheduler manage?", options: ["Which process uses the CPU", "Only file names", "Screen brightness only", "Internet domain names"], correctAnswer: "Which process uses the CPU", explanation: "The scheduler allocates processor time among runnable processes or threads." },
    { lesson: "Operating Systems", difficulty: "hard", question: "What is virtual memory?", options: ["Using storage to extend the apparent memory available to processes", "A second physical monitor", "Encrypted network traffic", "A type of CPU instruction"], correctAnswer: "Using storage to extend the apparent memory available to processes", explanation: "Virtual memory maps process address spaces to physical memory and may use disk when RAM is limited." },
    { lesson: "Computer Networks", difficulty: "easy", question: "What is the main purpose of a network protocol?", options: ["Define rules for communicating systems", "Increase monitor brightness", "Store every file locally", "Replace hardware with text"], correctAnswer: "Define rules for communicating systems", explanation: "Protocols define formats and behavior so different devices can exchange data reliably." },
    { lesson: "Computer Networks", difficulty: "hard", question: "Which factor contributes a mostly fixed delay before a data transfer begins?", options: ["Network latency", "File compression ratio", "Screen resolution", "Database row count"], correctAnswer: "Network latency", explanation: "Latency is the travel and processing delay, while bandwidth mainly affects how quickly a large payload can be transferred." },
  ],
  "Artificial Intelligence": [
    { lesson: "Intelligent Agents", difficulty: "easy", question: "What is an intelligent agent?", options: ["A system that perceives and acts toward goals", "A database with one table", "A fixed image filter", "A type of battery"], correctAnswer: "A system that perceives and acts toward goals", explanation: "An agent receives observations from an environment and selects actions intended to achieve goals." },
    { lesson: "Intelligent Agents", difficulty: "medium", question: "What does a utility function help an AI agent do?", options: ["Compare how desirable different outcomes are", "Store raw pixels only", "Increase network bandwidth", "Remove all uncertainty"], correctAnswer: "Compare how desirable different outcomes are", explanation: "Utility provides a numerical way to rank outcomes when an agent has several possible actions." },
    { lesson: "Search and Planning", difficulty: "easy", question: "What does a state space represent?", options: ["Possible situations and transitions in a problem", "Only the final answer", "A computer's physical location", "A list of passwords"], correctAnswer: "Possible situations and transitions in a problem", explanation: "Search algorithms explore states connected by valid actions to find a path to a goal." },
    { lesson: "Search and Planning", difficulty: "hard", question: "In A* search, what is combined to prioritize a state?", options: ["Path cost and estimated remaining cost", "Only the number of goals", "Memory and processor temperature", "Training and test accuracy"], correctAnswer: "Path cost and estimated remaining cost", explanation: "A* prioritizes states using the cost already paid plus a heuristic estimate to the goal." },
    { lesson: "Knowledge and Reasoning", difficulty: "medium", question: "What is inference?", options: ["Deriving conclusions from known information", "Deleting all uncertain facts", "Compressing an image", "Changing a motor speed"], correctAnswer: "Deriving conclusions from known information", explanation: "Inference applies rules or probabilistic relationships to facts and observations." },
    { lesson: "Knowledge and Reasoning", difficulty: "hard", question: "Why represent uncertainty in an AI system?", options: ["Observations and rules may be incomplete or noisy", "Computers cannot store true statements", "Every outcome is equally likely", "Logic never supports decisions"], correctAnswer: "Observations and rules may be incomplete or noisy", explanation: "Probability and other uncertainty models let systems reason when information is imperfect." },
    { lesson: "Computer Vision", difficulty: "easy", question: "What is image classification?", options: ["Assigning a category to an image", "Measuring network latency", "Sorting database rows", "Generating motor torque"], correctAnswer: "Assigning a category to an image", explanation: "Classification predicts which category best describes an image or image region." },
    { lesson: "Computer Vision", difficulty: "medium", question: "What happens when a detection confidence threshold is raised?", options: ["Fewer low-confidence detections are accepted", "Every image gains more pixels", "The model retrains itself", "All false negatives disappear"], correctAnswer: "Fewer low-confidence detections are accepted", explanation: "A higher threshold is stricter, often reducing false positives while potentially missing more true objects." },
    { lesson: "Natural Language AI", difficulty: "easy", question: "What is a token in language AI?", options: ["A unit of text processed by a model", "A physical processor core", "A network cable", "A database backup"], correctAnswer: "A unit of text processed by a model", explanation: "Models divide text into tokens such as words, word pieces, or punctuation for processing." },
    { lesson: "Natural Language AI", difficulty: "hard", question: "Why does prompt context matter to a language model?", options: ["It provides information that shapes the intended response", "It permanently changes model weights", "It guarantees every answer is true", "It removes the token limit"], correctAnswer: "It provides information that shapes the intended response", explanation: "Relevant context helps the model interpret the request and produce a more appropriate answer." },
  ],
  "Machine Learning": [
    { lesson: "Data and Features", difficulty: "easy", question: "What is a feature in machine learning?", options: ["An input variable used by a model", "The final deployed server", "A guaranteed correct prediction", "A type of loss function only"], correctAnswer: "An input variable used by a model", explanation: "Features describe each example and provide the information a model uses to make predictions." },
    { lesson: "Data and Features", difficulty: "medium", question: "Why is data quality important?", options: ["Models learn patterns and errors present in their data", "More errors always improve generalization", "Models ignore missing values automatically", "Quality matters only after deployment"], correctAnswer: "Models learn patterns and errors present in their data", explanation: "Biased, mislabeled, or incomplete data can produce unreliable model behavior." },
    { lesson: "Supervised Learning", difficulty: "easy", question: "What distinguishes supervised learning?", options: ["Training examples include target labels", "The model receives no data", "Only one feature is allowed", "The model never makes predictions"], correctAnswer: "Training examples include target labels", explanation: "Supervised learning uses examples paired with desired outputs to learn a mapping." },
    { lesson: "Supervised Learning", difficulty: "hard", question: "Which task is regression?", options: ["Predicting a continuous house price", "Choosing among animal categories", "Grouping unlabeled customers", "Finding the shortest path"], correctAnswer: "Predicting a continuous house price", explanation: "Regression predicts numerical values, while classification predicts categories." },
    { lesson: "Neural Networks", difficulty: "easy", question: "What does a neural network weight control?", options: ["The influence of one signal on the next computation", "The physical mass of the computer", "The number of training labels", "The network cable length"], correctAnswer: "The influence of one signal on the next computation", explanation: "Weights are learned parameters that scale signals between units or layers." },
    { lesson: "Neural Networks", difficulty: "hard", question: "What is backpropagation used for?", options: ["Computing how parameters contributed to prediction error", "Creating labels by hand", "Reducing every model to one neuron", "Encrypting training data"], correctAnswer: "Computing how parameters contributed to prediction error", explanation: "Backpropagation applies the chain rule to calculate gradients used to update network weights." },
    { lesson: "Model Evaluation", difficulty: "easy", question: "Why keep validation data separate from training data?", options: ["To estimate performance on unseen examples", "To make the training set larger", "To guarantee perfect accuracy", "To remove all model parameters"], correctAnswer: "To estimate performance on unseen examples", explanation: "Validation data helps measure generalization without evaluating only on examples the model learned from." },
    { lesson: "Model Evaluation", difficulty: "medium", question: "When is recall especially important?", options: ["When missing a positive case is costly", "When only file size matters", "When every class is identical", "When no labels exist"], correctAnswer: "When missing a positive case is costly", explanation: "Recall measures the fraction of actual positive cases correctly found." },
    { lesson: "Responsible Machine Learning", difficulty: "medium", question: "What is dataset bias?", options: ["Systematic imbalance that can produce unfair model behavior", "A method for speeding up every model", "A guaranteed privacy tool", "A type of database index"], correctAnswer: "Systematic imbalance that can produce unfair model behavior", explanation: "If groups or situations are poorly represented, model performance may differ in harmful ways." },
    { lesson: "Responsible Machine Learning", difficulty: "hard", question: "Why is human oversight useful in high-impact ML systems?", options: ["People can review context, exceptions, and consequences", "It guarantees the model never changes", "It replaces the need for testing", "It makes all data public"], correctAnswer: "People can review context, exceptions, and consequences", explanation: "Human review helps manage uncertainty and accountability where errors can significantly affect people." },
  ],
  Robotics: [
    { lesson: "Sensors", difficulty: "easy", question: "Which sensor can measure the distance to a nearby obstacle using sound pulses?", options: ["Ultrasonic sensor", "Temperature sensor", "Gyroscope", "Color sensor"], correctAnswer: "Ultrasonic sensor", explanation: "An ultrasonic sensor measures echo travel time to estimate distance." },
    { lesson: "Sensors", difficulty: "medium", question: "What does a gyroscope measure in a robot?", options: ["Angular motion", "Light intensity only", "Battery capacity", "Wheel diameter"], correctAnswer: "Angular motion", explanation: "Gyroscopes measure angular velocity and help estimate orientation changes." },
    { lesson: "Actuators", difficulty: "easy", question: "What is an actuator?", options: ["A device that turns a control signal into physical action", "A data storage format", "A passive measuring scale", "A wireless password"], correctAnswer: "A device that turns a control signal into physical action", explanation: "Motors, servos, and pneumatic cylinders are actuators because they create movement or force." },
    { lesson: "Actuators", difficulty: "hard", question: "Why is a servo useful for positioning a robot joint?", options: ["It uses feedback to target an angle", "It measures air pressure only", "It stores program code", "It cannot change direction"], correctAnswer: "It uses feedback to target an angle", explanation: "A servo combines a motor, gearing, and feedback control to reach and hold a commanded position." },
    { lesson: "Robot Movement", difficulty: "medium", question: "What does differential drive use to steer a mobile robot?", options: ["Different speeds on left and right wheels", "A single fixed wheel", "Only vertical propellers", "Changing battery voltage randomly"], correctAnswer: "Different speeds on left and right wheels", explanation: "Changing the relative wheel speeds makes the robot travel straight, curve, or rotate." },
    { lesson: "Robot Movement", difficulty: "hard", question: "What is odometry commonly used to estimate?", options: ["Robot position from wheel motion", "Air temperature from color", "Battery chemistry", "Camera lens material"], correctAnswer: "Robot position from wheel motion", explanation: "Wheel encoder measurements can be integrated to estimate distance traveled and heading." },
    { lesson: "Control Systems", difficulty: "easy", question: "What is feedback in a control system?", options: ["Using measured output to adjust future control", "Ignoring sensor values", "Removing all actuators", "Sending data once without checking"], correctAnswer: "Using measured output to adjust future control", explanation: "Feedback compares actual behavior with the target and corrects the control input." },
    { lesson: "Control Systems", difficulty: "hard", question: "In a PID controller, which term responds to accumulated past error?", options: ["Integral", "Proportional", "Derivative", "Feedforward"], correctAnswer: "Integral", explanation: "The integral term sums error over time and helps remove persistent steady-state error." },
    { lesson: "Autonomous Robots", difficulty: "medium", question: "What is path planning?", options: ["Choosing a route from start to goal", "Painting the robot chassis", "Charging a battery", "Compressing a camera image only"], correctAnswer: "Choosing a route from start to goal", explanation: "Path-planning algorithms search for feasible, often efficient routes while avoiding obstacles." },
    { lesson: "Autonomous Robots", difficulty: "hard", question: "What does SLAM allow a robot to do?", options: ["Build a map while estimating its location", "Increase motor voltage without limits", "Replace every sensor", "Translate code into machine language"], correctAnswer: "Build a map while estimating its location", explanation: "Simultaneous localization and mapping jointly estimates the robot pose and an unknown environment map." },
  ],
  Electronics: [
    { lesson: "Voltage and Current", difficulty: "easy", question: "What is voltage?", options: ["Electric potential difference", "Rate of charge flow", "Opposition to current", "Magnetic pole count"], correctAnswer: "Electric potential difference", explanation: "Voltage measures energy transferred per unit charge between two points." },
    { lesson: "Voltage and Current", difficulty: "medium", question: "How much charge flows in 3 seconds when current is 2 amperes?", options: ["1.5 C", "5 C", "6 C", "9 C"], correctAnswer: "6 C", explanation: "Current I = Q/t, so charge Q = It = 2 × 3 = 6 coulombs." },
    { lesson: "Resistors", difficulty: "easy", question: "What is the main role of a resistor in a circuit?", options: ["Limit or control current", "Generate unlimited energy", "Store program instructions", "Detect sound"], correctAnswer: "Limit or control current", explanation: "A resistor opposes current flow and creates a voltage drop." },
    { lesson: "Resistors", difficulty: "hard", question: "What is the equivalent resistance of 4 Ω and 6 Ω resistors connected in series?", options: ["2.4 Ω", "5 Ω", "10 Ω", "24 Ω"], correctAnswer: "10 Ω", explanation: "Series resistances add directly: 4 + 6 = 10 Ω." },
    { lesson: "Capacitors", difficulty: "easy", question: "What does a capacitor store?", options: ["Electric charge and energy", "Only magnetic poles", "Computer source code", "Sound waves"], correctAnswer: "Electric charge and energy", explanation: "Separated charge on a capacitor's plates stores energy in an electric field." },
    { lesson: "Capacitors", difficulty: "medium", question: "What is a common use of a capacitor in a power supply?", options: ["Smooth voltage ripple", "Create fuel", "Measure mass", "Increase wire length"], correctAnswer: "Smooth voltage ripple", explanation: "A filter capacitor charges and discharges to reduce variation in a rectified voltage." },
    { lesson: "Diodes", difficulty: "easy", question: "What is a basic property of an ideal diode?", options: ["It conducts mainly in one direction", "It stores mechanical energy", "It amplifies every signal", "It has infinite current both ways"], correctAnswer: "It conducts mainly in one direction", explanation: "A diode allows forward current while blocking reverse current in its basic operating model." },
    { lesson: "Diodes", difficulty: "hard", question: "What is the purpose of a bridge rectifier?", options: ["Convert AC to pulsating DC", "Convert light into sound", "Store binary data", "Measure resistance directly"], correctAnswer: "Convert AC to pulsating DC", explanation: "Four diodes route both halves of an AC waveform so the output current has one polarity." },
    { lesson: "Transistors", difficulty: "medium", question: "A transistor used as an electronic switch primarily operates between which states?", options: ["Off and on", "Hot and cold", "Positive and negative mass", "Sound and light"], correctAnswer: "Off and on", explanation: "Switching circuits drive a transistor between a nonconducting state and a strongly conducting state." },
    { lesson: "Transistors", difficulty: "hard", question: "What does a small base current control in a bipolar junction transistor?", options: ["A larger collector current", "The color of the circuit board", "The resistor material", "A capacitor's plate area"], correctAnswer: "A larger collector current", explanation: "In active operation, a small base current controls a larger current through the collector-emitter path." },
  ],
  "Environmental Science": [
    { lesson: "Climate Change", difficulty: "easy", question: "Which gas is the largest human-caused contributor to current global warming?", options: ["Carbon dioxide", "Oxygen", "Argon", "Helium"], correctAnswer: "Carbon dioxide", explanation: "Fossil-fuel use and land-use change have greatly increased atmospheric carbon dioxide." },
    { lesson: "Climate Change", difficulty: "hard", question: "What is climate mitigation?", options: ["Reducing greenhouse gas emissions or increasing carbon removal", "Measuring tomorrow's weather", "Moving every city inland", "Ignoring long-term temperature trends"], correctAnswer: "Reducing greenhouse gas emissions or increasing carbon removal", explanation: "Mitigation addresses the causes of climate change, while adaptation addresses its impacts." },
    { lesson: "Pollution", difficulty: "easy", question: "What process can cause excessive algae growth when too many nutrients enter water?", options: ["Eutrophication", "Evaporation", "Sublimation", "Photosynthesis only"], correctAnswer: "Eutrophication", explanation: "Nutrient enrichment can trigger algal blooms and later oxygen depletion." },
    { lesson: "Pollution", difficulty: "medium", question: "Why can fine particulate air pollution be harmful?", options: ["Small particles can enter deep into the lungs", "It always increases oxygen levels", "It removes all allergens", "It only changes sky color"], correctAnswer: "Small particles can enter deep into the lungs", explanation: "Fine particles can penetrate the respiratory system and are associated with heart and lung harm." },
    { lesson: "Renewable Energy", difficulty: "easy", question: "Which energy source directly converts sunlight into electricity?", options: ["Solar photovoltaic panels", "Coal turbines", "Diesel engines", "Natural gas boilers"], correctAnswer: "Solar photovoltaic panels", explanation: "Photovoltaic cells use semiconductor effects to convert light energy into electric current." },
    { lesson: "Renewable Energy", difficulty: "hard", question: "Why is energy storage useful with wind and solar power?", options: ["It balances supply when generation varies", "It makes sunlight constant", "It removes the need for power lines", "It creates energy from nothing"], correctAnswer: "It balances supply when generation varies", explanation: "Storage shifts energy from high-generation periods to times when demand exceeds renewable output." },
    { lesson: "Water Conservation", difficulty: "medium", question: "Which irrigation method generally delivers water most directly to plant roots?", options: ["Drip irrigation", "Flood irrigation", "Open sprinkling at noon", "Unlined canals"], correctAnswer: "Drip irrigation", explanation: "Drip systems apply small amounts near roots, reducing evaporation and runoff." },
    { lesson: "Water Conservation", difficulty: "hard", question: "What is a watershed?", options: ["Land area that drains to a common water body", "A device that manufactures water", "Only an underground aquifer", "A salt-removal membrane"], correctAnswer: "Land area that drains to a common water body", explanation: "Rain and runoff within a watershed flow toward the same stream, lake, or other outlet." },
    { lesson: "Biodiversity", difficulty: "easy", question: "What does biodiversity include?", options: ["Variation in genes, species, and ecosystems", "Only the number of trees", "Only endangered mammals", "Weather changes during one day"], correctAnswer: "Variation in genes, species, and ecosystems", explanation: "Biodiversity describes biological variety at multiple levels." },
    { lesson: "Biodiversity", difficulty: "medium", question: "Why can high biodiversity improve ecosystem resilience?", options: ["Different species can support overlapping ecological functions", "Every species uses identical resources", "It prevents all natural disturbances", "It eliminates competition"], correctAnswer: "Different species can support overlapping ecological functions", explanation: "Functional diversity can help ecosystems continue operating when conditions change or some populations decline." },
  ],
  Finance: [
    { lesson: "Budgeting", difficulty: "easy", question: "What is the main purpose of a budget?", options: ["Plan how income will be spent and saved", "Guarantee investment profit", "Remove every unexpected cost", "Increase all prices"], correctAnswer: "Plan how income will be spent and saved", explanation: "A budget assigns available money to needs, wants, savings, and goals." },
    { lesson: "Budgeting", difficulty: "medium", question: "Which expense is usually considered fixed?", options: ["Monthly rent", "Restaurant meals", "Entertainment", "Impulse purchases"], correctAnswer: "Monthly rent", explanation: "A fixed expense typically stays the same on a regular schedule, unlike flexible spending." },
    { lesson: "Saving", difficulty: "easy", question: "What is an emergency fund designed to cover?", options: ["Unexpected essential expenses", "Guaranteed stock gains", "Luxury purchases only", "Taxes for every future year"], correctAnswer: "Unexpected essential expenses", explanation: "Emergency savings provide a buffer for events such as urgent repairs, medical bills, or income loss." },
    { lesson: "Saving", difficulty: "hard", question: "Why can automating savings be effective?", options: ["It makes saving consistent before money is spent elsewhere", "It guarantees the highest interest rate", "It removes all bank fees", "It prevents inflation"], correctAnswer: "It makes saving consistent before money is spent elsewhere", explanation: "Automatic transfers turn saving into a regular habit and reduce reliance on repeated decisions." },
    { lesson: "Investing Basics", difficulty: "easy", question: "What is diversification?", options: ["Spreading investments across different assets", "Putting all money into one company", "Borrowing to cover every loss", "Avoiding all long-term goals"], correctAnswer: "Spreading investments across different assets", explanation: "Diversification reduces dependence on the performance of a single investment." },
    { lesson: "Investing Basics", difficulty: "medium", question: "Why does a longer investment horizon often allow more tolerance for short-term volatility?", options: ["There is more time to recover from market declines", "Losses become impossible", "All investments pay the same return", "Inflation stops"], correctAnswer: "There is more time to recover from market declines", explanation: "Longer horizons can provide time for market cycles and compounding, though returns are never guaranteed." },
    { lesson: "Interest", difficulty: "easy", question: "What is compound interest?", options: ["Interest earned on principal and previously earned interest", "A one-time account fee", "Interest calculated only on the original principal", "A tax on cash"], correctAnswer: "Interest earned on principal and previously earned interest", explanation: "Compounding adds earned interest to the balance, allowing later interest to grow on a larger amount." },
    { lesson: "Interest", difficulty: "hard", question: "A $1,000 deposit earns 5% simple interest for two years. How much interest is earned?", options: ["$50", "$100", "$105", "$1,100"], correctAnswer: "$100", explanation: "Simple interest is P × r × t = 1000 × 0.05 × 2 = $100." },
    { lesson: "Risk Management", difficulty: "medium", question: "What is the relationship between investment risk and expected return in general?", options: ["Higher expected return usually involves higher risk", "Higher return always has lower risk", "Risk and return are unrelated", "No investment has risk"], correctAnswer: "Higher expected return usually involves higher risk", explanation: "Investors generally require greater potential return to accept greater uncertainty, though outcomes are not guaranteed." },
    { lesson: "Risk Management", difficulty: "hard", question: "What is insurance primarily used for?", options: ["Transfer the financial impact of specified risks", "Guarantee investment growth", "Eliminate every hazard", "Create tax-free income"], correctAnswer: "Transfer the financial impact of specified risks", explanation: "Premiums transfer covered financial risks to an insurer under the policy's terms." },
  ],
  Agriculture: [
    { lesson: "Soil Health", difficulty: "easy", question: "Why is organic matter valuable in soil?", options: ["It supports structure, water retention, and nutrient cycling", "It permanently removes all insects", "It turns sand into metal", "It prevents every plant disease"], correctAnswer: "It supports structure, water retention, and nutrient cycling", explanation: "Decomposed organic material improves soil aggregation and feeds organisms that cycle nutrients." },
    { lesson: "Soil Health", difficulty: "medium", question: "What soil pH is generally considered neutral?", options: ["7", "2", "5", "12"], correctAnswer: "7", explanation: "A pH of 7 is neutral; lower values are acidic and higher values are alkaline." },
    { lesson: "Irrigation", difficulty: "easy", question: "What is irrigation?", options: ["Artificial application of water to crops", "Harvesting grain by hand", "Measuring soil color", "Storing seeds in cold rooms"], correctAnswer: "Artificial application of water to crops", explanation: "Irrigation supplies water when rainfall is insufficient or poorly timed." },
    { lesson: "Irrigation", difficulty: "hard", question: "Why can over-irrigation harm crops and soil?", options: ["It can cause waterlogging, nutrient loss, and salinity", "It always increases soil oxygen", "It eliminates erosion", "It makes roots deeper immediately"], correctAnswer: "It can cause waterlogging, nutrient loss, and salinity", explanation: "Excess water can displace soil air, leach nutrients, and leave salts behind as water evaporates." },
    { lesson: "Crop Rotation", difficulty: "easy", question: "What is crop rotation?", options: ["Growing different crops in sequence on the same land", "Planting only one crop forever", "Moving a farm to a new country", "Harvesting every crop on one day"], correctAnswer: "Growing different crops in sequence on the same land", explanation: "Changing crops over seasons can improve soil conditions and interrupt pest cycles." },
    { lesson: "Crop Rotation", difficulty: "medium", question: "Why are legumes useful in many crop rotations?", options: ["They can add biologically fixed nitrogen to the system", "They remove all soil water", "They require no sunlight", "They create phosphorus from nothing"], correctAnswer: "They can add biologically fixed nitrogen to the system", explanation: "Symbiotic bacteria in legume root nodules convert atmospheric nitrogen into forms usable by plants." },
    { lesson: "Fertilizers", difficulty: "easy", question: "What do the letters N-P-K on fertilizer represent?", options: ["Nitrogen, phosphorus, and potassium", "Nickel, platinum, and krypton", "Nutrients, plants, and kernels", "Nitrate, protein, and kerosene"], correctAnswer: "Nitrogen, phosphorus, and potassium", explanation: "N-P-K labels the proportions of three major plant nutrients." },
    { lesson: "Fertilizers", difficulty: "hard", question: "Why should fertilizer application be matched to soil tests and crop needs?", options: ["To avoid waste, pollution, and nutrient imbalance", "To make every soil identical", "To eliminate irrigation", "To prevent photosynthesis"], correctAnswer: "To avoid waste, pollution, and nutrient imbalance", explanation: "Applying only needed nutrients improves efficiency and reduces runoff or leaching." },
    { lesson: "Smart Farming", difficulty: "medium", question: "What is precision agriculture?", options: ["Using data and technology to manage field variation", "Planting without measuring anything", "Replacing every crop with robots", "Growing food only indoors"], correctAnswer: "Using data and technology to manage field variation", explanation: "Sensors, maps, positioning, and analytics help apply inputs where and when they are needed." },
    { lesson: "Smart Farming", difficulty: "hard", question: "How can a normalized difference vegetation index (NDVI) help farmers?", options: ["Estimate plant vigor from reflected light", "Directly measure grain mass underground", "Change soil pH remotely", "Create rainfall"], correctAnswer: "Estimate plant vigor from reflected light", explanation: "NDVI compares near-infrared and red reflectance to indicate vegetation greenness and potential stress." },
  ],
};

const lessonIdBySubjectAndTitle = new Map(
  subjects.flatMap((subject) =>
    subject.lessons.map(
      (lesson) => [`${subject.name}:${lesson.title}`, lesson.id] as const,
    ),
  ),
);

const authoredQuestions: QuizQuestion[] = Object.entries(questionBanks).flatMap(
  ([subject, questions]) =>
    questions.map((question, index) => ({
      ...question,
      id: `${subject.toLowerCase().replace(/\s+/g, "-")}-${index + 1}`,
      subject,
      lessonId:
        lessonIdBySubjectAndTitle.get(`${subject}:${question.lesson}`) ??
        "unlinked",
    })),
);

function rotateOptions(options: string[], correctIndex: number) {
  const shift = Math.max(0, Math.min(options.length - 1, correctIndex));
  return [...options.slice(shift), ...options.slice(0, shift)];
}

const conceptPool = subjects.flatMap((subject) =>
  subject.lessons.flatMap((lesson) => lesson.keyConcepts),
);
const applicationPool = subjects.flatMap((subject) =>
  subject.lessons.map((lesson) => lesson.applications[0]),
);

const supplementalQuestions: QuizQuestion[] = subjects.flatMap(
  (subject, subjectIndex) =>
    subject.lessons.flatMap((lesson, lessonIndex) => {
      const correctConcept = lesson.keyConcepts[0];
      const conceptDistractors = conceptPool
        .filter((concept) => concept !== correctConcept)
        .filter((concept, index, values) => values.indexOf(concept) === index)
        .slice(subjectIndex + lessonIndex, subjectIndex + lessonIndex + 3);
      const conceptOptions = rotateOptions(
        [correctConcept, ...conceptDistractors],
        (subjectIndex + lessonIndex) % 4,
      );
      const correctApplication = lesson.applications[0];
      const applicationDistractors = applicationPool
        .filter((application) => application !== correctApplication)
        .slice(subjectIndex + lessonIndex, subjectIndex + lessonIndex + 3);
      const applicationOptions = rotateOptions(
        [correctApplication, ...applicationDistractors],
        (subjectIndex + lessonIndex + 2) % 4,
      );

      return [
        {
          id: `${lesson.id}-concept-check`,
          subject: subject.name,
          lessonId: lesson.id,
          lesson: lesson.title,
          difficulty: "easy",
          question: `Which concept is most directly associated with ${lesson.title}?`,
          options: conceptOptions,
          correctAnswer: correctConcept,
          explanation: `${correctConcept} is one of the lesson's central ideas and helps explain ${lesson.description.toLowerCase()}`,
        },
        {
          id: `${lesson.id}-application-check`,
          subject: subject.name,
          lessonId: lesson.id,
          lesson: lesson.title,
          difficulty: "medium",
          question: `Which real-world application best matches ${lesson.title}?`,
          options: applicationOptions,
          correctAnswer: correctApplication,
          explanation: correctApplication,
        },
      ] satisfies QuizQuestion[];
    }),
);

export const quizQuestions: QuizQuestion[] = [
  ...authoredQuestions,
  ...supplementalQuestions,
];

export function getQuizQuestions(
  subject: string,
  lessonId: string,
  difficulty: QuizQuestion["difficulty"] | "all",
) {
  return quizQuestions.filter(
    (question) =>
      question.subject === subject &&
      (lessonId === "all" || question.lessonId === lessonId) &&
      (difficulty === "all" || question.difficulty === difficulty),
  );
}

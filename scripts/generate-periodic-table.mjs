import fs from "fs";

const elements = [
  ["H", "Hydrogen", 1, 1.008, 1, 1, "reactive-nonmetal", "1s1", "Fuel cells, ammonia production", "Lightest element; one proton and one electron."],
  ["He", "Helium", 2, 4.003, 1, 18, "noble-gas", "1s2", "Balloons, cryogenics, MRI cooling", "Inert noble gas; second most abundant in universe."],
  ["Li", "Lithium", 3, 6.94, 2, 1, "alkali-metal", "[He] 2s1", "Batteries, ceramics, mood stabilizers", "Soft alkali metal; highly reactive with water."],
  ["Be", "Beryllium", 4, 9.012, 2, 2, "alkaline-earth", "[He] 2s2", "Aerospace alloys, X-ray windows", "Lightweight alkaline earth metal; toxic dust."],
  ["B", "Boron", 5, 10.81, 2, 13, "metalloid", "[He] 2s2 2p1", "Borosilicate glass, detergents, semiconductors", "Metalloid essential for plant cell walls."],
  ["C", "Carbon", 6, 12.011, 2, 14, "reactive-nonmetal", "[He] 2s2 2p2", "Steel, plastics, fuels, life molecules", "Basis of organic chemistry and life."],
  ["N", "Nitrogen", 7, 14.007, 2, 15, "reactive-nonmetal", "[He] 2s2 2p3", "Fertilizers, food preservation, explosives", "Makes up 78% of Earth atmosphere."],
  ["O", "Oxygen", 8, 15.999, 2, 16, "reactive-nonmetal", "[He] 2s2 2p4", "Respiration, steelmaking, water treatment", "Essential for combustion and aerobic life."],
  ["F", "Fluorine", 9, 18.998, 2, 17, "reactive-nonmetal", "[He] 2s2 2p5", "Toothpaste, Teflon, uranium enrichment", "Most electronegative and reactive element."],
  ["Ne", "Neon", 10, 20.18, 2, 18, "noble-gas", "[He] 2s2 2p6", "Neon signs, high-voltage indicators", "Noble gas that glows red-orange in discharge tubes."],
  ["Na", "Sodium", 11, 22.99, 3, 1, "alkali-metal", "[Ne] 3s1", "Table salt, street lighting, soap", "Soft metal; reacts vigorously with water."],
  ["Mg", "Magnesium", 12, 24.305, 3, 2, "alkaline-earth", "[Ne] 3s2", "Light alloys, fireworks, antacids", "Burns with brilliant white flame."],
  ["Al", "Aluminium", 13, 26.982, 3, 13, "post-transition-metal", "[Ne] 3s2 3p1", "Packaging, aircraft, construction", "Abundant metal with excellent strength-to-weight ratio."],
  ["Si", "Silicon", 14, 28.086, 3, 14, "metalloid", "[Ne] 3s2 3p2", "Semiconductors, solar cells, glass", "Foundation of modern electronics industry."],
  ["P", "Phosphorus", 15, 30.974, 3, 15, "reactive-nonmetal", "[Ne] 3s2 3p3", "Fertilizers, detergents, DNA backbone", "Exists in white, red, and black allotropes."],
  ["S", "Sulfur", 16, 32.07, 3, 16, "reactive-nonmetal", "[Ne] 3s2 3p4", "Sulfuric acid, vulcanized rubber, fungicides", "Yellow solid; essential in proteins and enzymes."],
  ["Cl", "Chlorine", 17, 35.45, 3, 17, "reactive-nonmetal", "[Ne] 3s2 3p5", "Water disinfection, PVC, bleach", "Greenish toxic gas; strong oxidizing agent."],
  ["Ar", "Argon", 18, 39.948, 3, 18, "noble-gas", "[Ne] 3s2 3p6", "Welding shield gas, incandescent bulbs", "Most abundant noble gas in atmosphere."],
  ["K", "Potassium", 19, 39.098, 4, 1, "alkali-metal", "[Ar] 4s1", "Fertilizers, glass, food preservatives", "Essential nutrient for nerve and muscle function."],
  ["Ca", "Calcium", 20, 40.078, 4, 2, "alkaline-earth", "[Ar] 4s2", "Cement, bones, dietary supplements", "Major component of bones and teeth."],
  ["Sc", "Scandium", 21, 44.956, 4, 3, "transition-metal", "[Ar] 3d1 4s2", "Aerospace alloys, stadium lighting", "Light transition metal; rare in Earth crust."],
  ["Ti", "Titanium", 22, 47.867, 4, 4, "transition-metal", "[Ar] 3d2 4s2", "Aircraft, implants, pigments", "Strong, corrosion-resistant, biocompatible."],
  ["V", "Vanadium", 23, 50.942, 4, 5, "transition-metal", "[Ar] 3d3 4s2", "Steel alloys, catalysts, batteries", "Hardens steel; used in tool alloys."],
  ["Cr", "Chromium", 24, 51.996, 4, 6, "transition-metal", "[Ar] 3d5 4s1", "Stainless steel, chrome plating, pigments", "Gives stainless steel its corrosion resistance."],
  ["Mn", "Manganese", 25, 54.938, 4, 7, "transition-metal", "[Ar] 3d5 4s2", "Steel production, batteries, fertilizers", "Essential trace element for enzymes."],
  ["Fe", "Iron", 26, 55.845, 4, 8, "transition-metal", "[Ar] 3d6 4s2", "Steel, hemoglobin, magnets, construction", "Most used metal; core of Earth."],
  ["Co", "Cobalt", 27, 58.933, 4, 9, "transition-metal", "[Ar] 3d7 4s2", "Batteries, pigments, medical isotopes", "Magnetic; essential vitamin B12 component."],
  ["Ni", "Nickel", 28, 58.693, 4, 10, "transition-metal", "[Ar] 3d8 4s2", "Stainless steel, coins, rechargeable batteries", "Corrosion-resistant; ferromagnetic."],
  ["Cu", "Copper", 29, 63.546, 4, 11, "transition-metal", "[Ar] 3d10 4s1", "Electrical wiring, plumbing, alloys", "Excellent electrical and thermal conductor."],
  ["Zn", "Zinc", 30, 65.38, 4, 12, "transition-metal", "[Ar] 3d10 4s2", "Galvanizing, brass, dietary supplements", "Protects steel from rust via galvanization."],
  ["Ga", "Gallium", 31, 69.723, 4, 13, "post-transition-metal", "[Ar] 3d10 4s2 4p1", "Semiconductors, LEDs, thermometers", "Melts in your hand; used in GaAs chips."],
  ["Ge", "Germanium", 32, 72.63, 4, 14, "metalloid", "[Ar] 3d10 4s2 4p2", "Fiber optics, infrared optics, transistors", "Semiconductor; improves silicon transistor speed."],
  ["As", "Arsenic", 33, 74.922, 4, 15, "metalloid", "[Ar] 3d10 4s2 4p3", "Semiconductors, wood preservatives, pesticides", "Toxic metalloid; semiconductor dopant."],
  ["Se", "Selenium", 34, 78.971, 4, 16, "reactive-nonmetal", "[Ar] 3d10 4s2 4p4", "Photocopiers, glass, dietary supplements", "Photoconductor; antioxidant in biology."],
  ["Br", "Bromine", 35, 79.904, 4, 17, "reactive-nonmetal", "[Ar] 3d10 4s2 4p5", "Flame retardants, photography, medicines", "Only liquid nonmetal at room temperature."],
  ["Kr", "Krypton", 36, 83.798, 4, 18, "noble-gas", "[Ar] 3d10 4s2 4p6", "Lighting, lasers, insulation windows", "Noble gas used in high-efficiency lighting."],
  ["Rb", "Rubidium", 37, 85.468, 5, 1, "alkali-metal", "[Kr] 5s1", "Research, atomic clocks, fireworks", "Highly reactive alkali metal."],
  ["Sr", "Strontium", 38, 87.62, 5, 2, "alkaline-earth", "[Kr] 5s2", "Fireworks red color, magnets, glass", "Produces crimson-red flame color."],
  ["Y", "Yttrium", 39, 88.906, 5, 3, "transition-metal", "[Kr] 4d1 5s2", "LED phosphors, superconductors, alloys", "Used in YBCO high-temperature superconductors."],
  ["Zr", "Zirconium", 40, 91.224, 5, 4, "transition-metal", "[Kr] 4d2 5s2", "Nuclear reactors, ceramics, jewelry", "Low neutron absorption; corrosion resistant."],
  ["Nb", "Niobium", 41, 92.906, 5, 5, "transition-metal", "[Kr] 4d4 5s1", "Superconducting magnets, steel, jet engines", "Superconducts at low temperatures."],
  ["Mo", "Molybdenum", 42, 95.95, 5, 6, "transition-metal", "[Kr] 4d5 5s1", "Alloy steels, catalysts, lubricants", "Essential enzyme cofactor in nitrogen fixation."],
  ["Tc", "Technetium", 43, 98, 5, 7, "transition-metal", "[Kr] 4d5 5s2", "Medical imaging, corrosion tracer", "First artificially produced element."],
  ["Ru", "Ruthenium", 44, 101.07, 5, 8, "transition-metal", "[Kr] 4d7 5s1", "Catalysts, electronics, jewelry plating", "Rare platinum-group metal."],
  ["Rh", "Rhodium", 45, 102.91, 5, 9, "transition-metal", "[Kr] 4d8 5s1", "Catalytic converters, jewelry, mirrors", "Extremely rare; excellent catalyst."],
  ["Pd", "Palladium", 46, 106.42, 5, 10, "transition-metal", "[Kr] 4d10", "Catalytic converters, electronics, dentistry", "Absorbs hydrogen; precious catalyst metal."],
  ["Ag", "Silver", 47, 107.87, 5, 11, "transition-metal", "[Kr] 4d10 5s1", "Jewelry, photography, electronics, coins", "Best electrical conductor of all metals."],
  ["Cd", "Cadmium", 48, 112.41, 5, 12, "transition-metal", "[Kr] 4d10 5s2", "Batteries, pigments, nuclear reactors", "Toxic heavy metal; used in NiCd batteries."],
  ["In", "Indium", 49, 114.82, 5, 13, "post-transition-metal", "[Kr] 4d10 5s2 5p1", "Touch screens, solders, semiconductors", "Soft metal; forms transparent conductive oxide."],
  ["Sn", "Tin", 50, 118.71, 5, 14, "post-transition-metal", "[Kr] 4d10 5s2 5p2", "Solder, tinplate, bronze alloys", "Low melting point; prevents iron corrosion."],
  ["Sb", "Antimony", 51, 121.76, 5, 15, "metalloid", "[Kr] 4d10 5s2 5p3", "Flame retardants, batteries, semiconductors", "Brittle metalloid; expands on solidifying."],
  ["Te", "Tellurium", 52, 127.6, 5, 16, "metalloid", "[Kr] 4d10 5s2 5p4", "Solar cells, alloys, thermoelectrics", "Rare metalloid; improves steel machinability."],
  ["I", "Iodine", 53, 126.9, 5, 17, "reactive-nonmetal", "[Kr] 4d10 5s2 5p5", "Disinfectants, thyroid medicine, dyes", "Essential nutrient for thyroid hormones."],
  ["Xe", "Xenon", 54, 131.29, 5, 18, "noble-gas", "[Kr] 4d10 5s2 5p6", "Lighting, anesthesia, ion propulsion", "Noble gas used in ion thrusters."],
  ["Cs", "Caesium", 55, 132.91, 6, 1, "alkali-metal", "[Xe] 6s1", "Atomic clocks, drilling fluids, photoelectric cells", "Most electropositive stable element."],
  ["Ba", "Barium", 56, 137.33, 6, 2, "alkaline-earth", "[Xe] 6s2", "Medical imaging, fireworks, glass", "Heavy alkaline earth; green flame color."],
  ["La", "Lanthanum", 57, 138.91, 6, 3, "lanthanide", "[Xe] 5d1 6s2", "Camera lenses, catalysts, batteries", "First lanthanide; soft silvery metal."],
  ["Ce", "Cerium", 58, 140.12, 8, 4, "lanthanide", "[Xe] 4f1 5d1 6s2", "Catalytic converters, polishing, alloys", "Most abundant rare earth element."],
  ["Pr", "Praseodymium", 59, 140.91, 8, 5, "lanthanide", "[Xe] 4f3 6s2", "Magnets, glass coloring, aircraft engines", "Creates intense yellow-green glass color."],
  ["Nd", "Neodymium", 60, 144.24, 8, 6, "lanthanide", "[Xe] 4f4 6s2", "Powerful magnets, lasers, glass", "Makes strongest permanent magnets."],
  ["Pm", "Promethium", 61, 145, 8, 7, "lanthanide", "[Xe] 4f5 6s2", "Nuclear batteries, luminous paint", "All isotopes radioactive; no stable form."],
  ["Sm", "Samarium", 62, 150.36, 8, 8, "lanthanide", "[Xe] 4f6 6s2", "Magnets, cancer treatment, nuclear reactors", "Used in SmCo permanent magnets."],
  ["Eu", "Europium", 63, 151.96, 8, 9, "lanthanide", "[Xe] 4f7 6s2", "Phosphors, Euro banknotes, LEDs", "Produces red and blue phosphor colors."],
  ["Gd", "Gadolinium", 64, 157.25, 8, 10, "lanthanide", "[Xe] 4f7 5d1 6s2", "MRI contrast, neutron capture, magnets", "MRI contrast agent; high neutron absorption."],
  ["Tb", "Terbium", 65, 158.93, 8, 11, "lanthanide", "[Xe] 4f9 6s2", "Green phosphors, magnets, sonar", "Produces green phosphorescence."],
  ["Dy", "Dysprosium", 66, 162.5, 8, 12, "lanthanide", "[Xe] 4f10 6s2", "Magnets, lasers, nuclear control rods", "Improves magnet performance at high temperature."],
  ["Ho", "Holmium", 67, 164.93, 8, 13, "lanthanide", "[Xe] 4f11 6s2", "Lasers, magnets, nuclear control", "Highest magnetic moment of any element."],
  ["Er", "Erbium", 68, 167.26, 8, 14, "lanthanide", "[Xe] 4f12 6s2", "Fiber optic amplifiers, lasers, metallurgy", "Amplifies optical signals in fiber networks."],
  ["Tm", "Thulium", 69, 168.93, 8, 15, "lanthanide", "[Xe] 4f13 6s2", "Portable X-ray, lasers, metallurgy", "Least abundant stable lanthanide."],
  ["Yb", "Ytterbium", 70, 173.05, 8, 16, "lanthanide", "[Xe] 4f14 6s2", "Lasers, stress gauges, atomic clocks", "Used in high-precision atomic clocks."],
  ["Lu", "Lutetium", 71, 174.97, 8, 17, "lanthanide", "[Xe] 4f14 5d1 6s2", "PET scan detectors, catalysts, research", "Last and densest lanthanide."],
  ["Hf", "Hafnium", 72, 178.49, 6, 4, "transition-metal", "[Xe] 4f14 5d2 6s2", "Nuclear control rods, microprocessors", "Excellent neutron absorber in reactors."],
  ["Ta", "Tantalum", 73, 180.95, 6, 5, "transition-metal", "[Xe] 4f14 5d3 6s2", "Capacitors, surgical implants, alloys", "Biocompatible; resists all body fluids."],
  ["W", "Tungsten", 74, 183.84, 6, 6, "transition-metal", "[Xe] 4f14 5d4 6s2", "Light bulb filaments, cutting tools, armor", "Highest melting point of all metals."],
  ["Re", "Rhenium", 75, 186.21, 6, 7, "transition-metal", "[Xe] 4f14 5d5 6s2", "Jet engines, catalysts, thermocouples", "One of densest metals; extreme heat resistance."],
  ["Os", "Osmium", 76, 190.23, 6, 8, "transition-metal", "[Xe] 4f14 5d6 6s2", "Pen tips, electrical contacts, alloys", "Densest naturally occurring element."],
  ["Ir", "Iridium", 77, 192.22, 6, 9, "transition-metal", "[Xe] 4f14 5d7 6s2", "Spark plugs, crucibles, standards", "Most corrosion-resistant metal known."],
  ["Pt", "Platinum", 78, 195.08, 6, 10, "transition-metal", "[Xe] 4f14 5d9 6s1", "Catalytic converters, jewelry, chemotherapy", "Noble metal; excellent catalyst."],
  ["Au", "Gold", 79, 196.97, 6, 11, "transition-metal", "[Xe] 4f14 5d10 6s1", "Jewelry, electronics, currency, dentistry", "Noble metal; does not tarnish."],
  ["Hg", "Mercury", 80, 200.59, 6, 12, "transition-metal", "[Xe] 4f14 5d10 6s2", "Thermometers, barometers, amalgams", "Only metal liquid at room temperature."],
  ["Tl", "Thallium", 81, 204.38, 6, 13, "post-transition-metal", "[Xe] 4f14 5d10 6s2 6p1", "Electronics, glass, rat poison", "Highly toxic post-transition metal."],
  ["Pb", "Lead", 82, 207.2, 6, 14, "post-transition-metal", "[Xe] 4f14 5d10 6s2 6p2", "Batteries, radiation shielding, pipes", "Dense, soft; neurotoxic heavy metal."],
  ["Bi", "Bismuth", 83, 208.98, 6, 15, "post-transition-metal", "[Xe] 4f14 5d10 6s2 6p3", "Pharmaceuticals, cosmetics, alloys", "Low-toxicity heavy metal; rainbow crystals."],
  ["Po", "Polonium", 84, 209, 6, 16, "post-transition-metal", "[Xe] 4f14 5d10 6s2 6p4", "Anti-static devices, nuclear triggers", "Highly radioactive; discovered by Curie."],
  ["At", "Astatine", 85, 210, 6, 17, "metalloid", "[Xe] 4f14 5d10 6s2 6p5", "Cancer research, radiotherapy", "Rarest naturally occurring element."],
  ["Rn", "Radon", 86, 222, 6, 18, "noble-gas", "[Xe] 4f14 5d10 6s2 6p6", "Cancer risk studies, earthquake prediction", "Radioactive noble gas; indoor air hazard."],
  ["Fr", "Francium", 87, 223, 7, 1, "alkali-metal", "[Rn] 7s1", "Scientific research only", "Extremely radioactive; most unstable alkali."],
  ["Ra", "Radium", 88, 226, 7, 2, "alkaline-earth", "[Rn] 7s2", "Cancer treatment, luminous paint", "Radioactive; glows in dark paint historically."],
  ["Ac", "Actinium", 89, 227, 7, 3, "actinide", "[Rn] 6d1 7s2", "Neutron sources, cancer research", "First actinide; highly radioactive."],
  ["Th", "Thorium", 90, 232.04, 9, 4, "actinide", "[Rn] 6d2 7s2", "Nuclear fuel, gas mantles, alloys", "Potential nuclear fuel; more abundant than uranium."],
  ["Pa", "Protactinium", 91, 231.04, 9, 5, "actinide", "[Rn] 5f2 6d1 7s2", "Scientific research", "Rare radioactive actinide."],
  ["U", "Uranium", 92, 238.03, 9, 6, "actinide", "[Rn] 5f3 6d1 7s2", "Nuclear power, weapons, dating rocks", "Fissile; powers nuclear reactors."],
  ["Np", "Neptunium", 93, 237, 9, 7, "actinide", "[Rn] 5f4 6d1 7s2", "Neutron detection, research", "First transuranium element synthesized."],
  ["Pu", "Plutonium", 94, 244, 9, 8, "actinide", "[Rn] 5f6 7s2", "Nuclear weapons, RTGs, research", "Key fissile material; extremely toxic."],
  ["Am", "Americium", 95, 243, 9, 9, "actinide", "[Rn] 5f7 7s2", "Smoke detectors, research", "Ionizes air in household smoke alarms."],
  ["Cm", "Curium", 96, 247, 9, 10, "actinide", "[Rn] 5f7 6d1 7s2", "Space power, research", "Named after Marie and Pierre Curie."],
  ["Bk", "Berkelium", 97, 247, 9, 11, "actinide", "[Rn] 5f9 7s2", "Scientific research", "Named after Berkeley, California."],
  ["Cf", "Californium", 98, 251, 9, 12, "actinide", "[Rn] 5f10 7s2", "Neutron sources, cancer treatment", "Powerful neutron emitter."],
  ["Es", "Einsteinium", 99, 252, 9, 13, "actinide", "[Rn] 5f11 7s2", "Scientific research", "Named after Albert Einstein."],
  ["Fm", "Fermium", 100, 257, 9, 14, "actinide", "[Rn] 5f12 7s2", "Scientific research", "Named after Enrico Fermi."],
  ["Md", "Mendelevium", 101, 258, 9, 15, "actinide", "[Rn] 5f13 7s2", "Scientific research", "Named after Dmitri Mendeleev."],
  ["No", "Nobelium", 102, 259, 9, 16, "actinide", "[Rn] 5f14 7s2", "Scientific research", "Named after Alfred Nobel."],
  ["Lr", "Lawrencium", 103, 266, 9, 17, "actinide", "[Rn] 5f14 7d1 7s2", "Scientific research", "Last actinide; named after Ernest Lawrence."],
  ["Rf", "Rutherfordium", 104, 267, 7, 4, "transition-metal", "[Rn] 5f14 6d2 7s2", "Scientific research", "Superheavy synthetic element."],
  ["Db", "Dubnium", 105, 268, 7, 5, "transition-metal", "[Rn] 5f14 6d3 7s2", "Scientific research", "Named after Dubna, Russia."],
  ["Sg", "Seaborgium", 106, 269, 7, 6, "transition-metal", "[Rn] 5f14 6d4 7s2", "Scientific research", "Named after Glenn Seaborg."],
  ["Bh", "Bohrium", 107, 270, 7, 7, "transition-metal", "[Rn] 5f14 6d5 7s2", "Scientific research", "Named after Niels Bohr."],
  ["Hs", "Hassium", 108, 277, 7, 8, "transition-metal", "[Rn] 5f14 6d6 7s2", "Scientific research", "Named after German state Hesse."],
  ["Mt", "Meitnerium", 109, 278, 7, 9, "unknown", "[Rn] 5f14 6d7 7s2", "Scientific research", "Named after Lise Meitner."],
  ["Ds", "Darmstadtium", 110, 281, 7, 10, "unknown", "[Rn] 5f14 6d8 7s2", "Scientific research", "Named after Darmstadt, Germany."],
  ["Rg", "Roentgenium", 111, 282, 7, 11, "unknown", "[Rn] 5f14 6d9 7s2", "Scientific research", "Named after Wilhelm Röntgen."],
  ["Cn", "Copernicium", 112, 285, 7, 12, "unknown", "[Rn] 5f14 6d10 7s2", "Scientific research", "Named after Nicolaus Copernicus."],
  ["Nh", "Nihonium", 113, 286, 7, 13, "unknown", "[Rn] 5f14 6d10 7s2 7p1", "Scientific research", "First element discovered in Asia."],
  ["Fl", "Flerovium", 114, 289, 7, 14, "unknown", "[Rn] 5f14 6d10 7s2 7p2", "Scientific research", "Named after Flerov Laboratory."],
  ["Mc", "Moscovium", 115, 290, 7, 15, "unknown", "[Rn] 5f14 6d10 7s2 7p3", "Scientific research", "Named after Moscow Oblast."],
  ["Lv", "Livermorium", 116, 293, 7, 16, "unknown", "[Rn] 5f14 6d10 7s2 7p4", "Scientific research", "Named after Livermore, California."],
  ["Ts", "Tennessine", 117, 294, 7, 17, "unknown", "[Rn] 5f14 6d10 7s2 7p5", "Scientific research", "Named after Tennessee, USA."],
  ["Og", "Oganesson", 118, 294, 7, 18, "unknown", "[Rn] 5f14 6d10 7s2 7p6", "Scientific research", "Heaviest known element; noble gas-like."],
];

const categoryLabels = {
  "alkali-metal": "Alkali metals",
  "alkaline-earth": "Alkaline earth metals",
  "transition-metal": "Transition metals",
  "post-transition-metal": "Post-transition metals",
  metalloid: "Metalloids",
  "reactive-nonmetal": "Reactive nonmetals",
  "noble-gas": "Noble gases",
  lanthanide: "Lanthanides",
  actinide: "Actinides",
  unknown: "Unknown properties",
};

const out = elements.map(
  ([
    symbol,
    name,
    atomicNumber,
    atomicMass,
    period,
    group,
    category,
    electronConfiguration,
    commonUses,
    explanation,
  ]) => ({
    symbol,
    name,
    atomicNumber,
    atomicMass,
    period,
    group,
    category,
    categoryLabel: categoryLabels[category],
    electronConfiguration,
    commonUses,
    explanation,
    gridRow: period,
    gridCol: group,
  }),
);

const header = `import type { ElementCategory } from "@/types";

export type PeriodicElement = {
  symbol: string;
  name: string;
  atomicNumber: number;
  atomicMass: number;
  period: number;
  group: number;
  category: ElementCategory;
  categoryLabel: string;
  electronConfiguration: string;
  commonUses: string;
  explanation: string;
  gridRow: number;
  gridCol: number;
};

export const elementCategories: {
  id: ElementCategory;
  label: string;
  color: string;
}[] = [
  { id: "alkali-metal", label: "Alkali metals", color: "#f87171" },
  { id: "alkaline-earth", label: "Alkaline earth metals", color: "#fb923c" },
  { id: "transition-metal", label: "Transition metals", color: "#fbbf24" },
  { id: "post-transition-metal", label: "Post-transition metals", color: "#a3e635" },
  { id: "metalloid", label: "Metalloids", color: "#34d399" },
  { id: "reactive-nonmetal", label: "Reactive nonmetals", color: "#22d3ee" },
  { id: "noble-gas", label: "Noble gases", color: "#a78bfa" },
  { id: "lanthanide", label: "Lanthanides", color: "#f472b6" },
  { id: "actinide", label: "Actinides", color: "#e879f9" },
  { id: "unknown", label: "Unknown properties", color: "#94a3b8" },
];

export const periodicElements: PeriodicElement[] = `;

const footer = `;

export function getCategoryColor(category: ElementCategory): string {
  return (
    elementCategories.find((item) => item.id === category)?.color ?? "#94a3b8"
  );
}
`;

fs.writeFileSync(
  "lib/periodic-table-data.ts",
  header + JSON.stringify(out, null, 2) + footer,
);
console.log(`Generated ${out.length} elements`);

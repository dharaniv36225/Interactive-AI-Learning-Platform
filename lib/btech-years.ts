import type { BtechBranchId } from "@/lib/btech-branches";
import { btechBranches, getBtechBranch } from "@/lib/btech-branches";
import type { BtechLesson, BtechUnit } from "@/lib/btech-lessons";
import {
  btechSubjectPlans,
  createBtechSubject,
  codingPracticeProblems,
  type BtechSubject,
} from "@/lib/btech-subjects";
import { btechLabCatalog } from "@/lib/btech-labs";

export type BtechYearId = "year-1" | "year-2" | "year-3" | "year-4";

export type BtechSemester = {
  id: string;
  title: string;
  focus: string;
  subjects: BtechSubject[];
};

export type BtechYear = {
  id: BtechYearId;
  title: string;
  description: string;
  semesters: BtechSemester[];
};

type SemesterPlan = {
  id: string;
  title: string;
  focus: string;
  branchSubjectIds: Record<BtechBranchId, string[]>;
};

const branchSemesterTracks: Record<BtechBranchId, string[][]> = {
  cse: [
    ["calculus", "linear-algebra", "c-programming", "engineering-chemistry", "electrical-circuits"],
    ["probability", "statistics", "discrete-mathematics", "python-programming", "digital-logic-design"],
    ["cpp-programming", "java-programming", "object-oriented-programming", "data-structures", "dbms"],
    ["advanced-data-structures", "algorithms", "design-and-analysis-of-algorithms", "operating-systems", "computer-networks"],
    ["compiler-design", "theory-of-computation", "software-engineering", "web-technologies", "cyber-security"],
    ["artificial-intelligence", "machine-learning", "distributed-systems", "cloud-computing", "devops"],
    ["deep-learning", "natural-language-processing", "computer-vision", "cryptography", "iot"],
    ["software-engineering", "cloud-computing", "cyber-security", "data-visualization", "devops"],
  ],
  aiml: [
    ["calculus", "linear-algebra", "c-programming", "engineering-biology", "electronics"],
    ["probability", "statistics", "python-programming", "discrete-mathematics", "digital-logic-design"],
    ["data-structures", "object-oriented-programming", "dbms", "sql", "java-programming"],
    ["algorithms", "design-and-analysis-of-algorithms", "operating-systems", "computer-networks", "software-engineering"],
    ["artificial-intelligence", "machine-learning", "data-visualization", "big-data-analytics", "cloud-computing"],
    ["deep-learning", "natural-language-processing", "computer-vision", "distributed-systems", "devops"],
    ["robotics", "embedded-systems", "control-systems", "cryptography", "machine-learning"],
    ["artificial-intelligence", "deep-learning", "natural-language-processing", "computer-vision", "software-engineering"],
  ],
  it: [
    ["calculus", "linear-algebra", "c-programming", "engineering-chemistry", "electrical-circuits"],
    ["probability", "statistics", "python-programming", "discrete-mathematics", "environmental-engineering"],
    ["java-programming", "object-oriented-programming", "data-structures", "dbms", "sql"],
    ["web-technologies", "html", "css", "javascript", "computer-networks"],
    ["react", "node-js", "software-engineering", "cloud-computing", "cyber-security"],
    ["distributed-systems", "devops", "big-data-analytics", "data-visualization", "machine-learning"],
    ["cryptography", "iot", "embedded-systems", "computer-vision", "software-engineering"],
    ["cloud-computing", "devops", "cyber-security", "data-visualization", "engineering-economics"],
  ],
  ece: [
    ["calculus", "linear-algebra", "c-programming", "engineering-chemistry", "electronics"],
    ["probability", "digital-logic-design", "python-programming", "electrical-circuits", "environmental-engineering"],
    ["signals-and-systems", "electronics", "data-structures", "object-oriented-programming", "dbms"],
    ["computer-networks", "operating-systems", "embedded-systems", "algorithms", "software-engineering"],
    ["iot", "control-systems", "cloud-computing", "cyber-security", "web-technologies"],
    ["artificial-intelligence", "machine-learning", "computer-vision", "distributed-systems", "devops"],
    ["robotics", "deep-learning", "natural-language-processing", "cryptography", "engineering-economics"],
    ["embedded-systems", "iot", "control-systems", "software-engineering", "data-visualization"],
  ],
  eee: [
    ["calculus", "linear-algebra", "c-programming", "electrical-circuits", "engineering-mechanics"],
    ["probability", "statistics", "electronics", "digital-logic-design", "environmental-engineering"],
    ["signals-and-systems", "control-systems", "data-structures", "object-oriented-programming", "dbms"],
    ["operating-systems", "computer-networks", "embedded-systems", "algorithms", "software-engineering"],
    ["iot", "cloud-computing", "cyber-security", "thermodynamics", "fluid-mechanics"],
    ["artificial-intelligence", "machine-learning", "robotics", "distributed-systems", "devops"],
    ["control-systems", "embedded-systems", "renewable-energy-systems", "cryptography", "engineering-economics"],
    ["electrical-circuits", "control-systems", "devops", "data-visualization", "environmental-science"],
  ],
  mechanical: [
    ["calculus", "linear-algebra", "c-programming", "engineering-mechanics", "engineering-chemistry"],
    ["probability", "statistics", "python-programming", "environmental-engineering", "electrical-circuits"],
    ["thermodynamics", "fluid-mechanics", "strength-of-materials", "data-structures", "dbms"],
    ["algorithms", "operating-systems", "computer-networks", "software-engineering", "control-systems"],
    ["iot", "embedded-systems", "robotics", "cloud-computing", "engineering-economics"],
    ["artificial-intelligence", "machine-learning", "data-visualization", "devops", "smart-agriculture"],
    ["thermodynamics", "fluid-mechanics", "robotics", "control-systems", "environmental-science"],
    ["software-engineering", "engineering-economics", "data-visualization", "devops", "cloud-computing"],
  ],
  civil: [
    ["calculus", "linear-algebra", "c-programming", "engineering-mechanics", "engineering-chemistry"],
    ["probability", "statistics", "environmental-engineering", "python-programming", "electrical-circuits"],
    ["surveying", "strength-of-materials", "fluid-mechanics", "dbms", "sql"],
    ["algorithms", "computer-networks", "software-engineering", "data-visualization", "environmental-science"],
    ["smart-agriculture", "iot", "cloud-computing", "cyber-security", "engineering-economics"],
    ["artificial-intelligence", "machine-learning", "big-data-analytics", "devops", "environmental-engineering"],
    ["surveying", "strength-of-materials", "fluid-mechanics", "smart-agriculture", "environmental-science"],
    ["environmental-engineering", "engineering-economics", "data-visualization", "cloud-computing", "software-engineering"],
  ],
  "data-science": [
    ["calculus", "linear-algebra", "c-programming", "engineering-economics", "engineering-biology"],
    ["probability", "statistics", "python-programming", "discrete-mathematics", "environmental-science"],
    ["data-structures", "dbms", "sql", "object-oriented-programming", "java-programming"],
    ["algorithms", "design-and-analysis-of-algorithms", "computer-networks", "software-engineering", "web-technologies"],
    ["machine-learning", "data-visualization", "big-data-analytics", "cloud-computing", "cyber-security"],
    ["artificial-intelligence", "deep-learning", "natural-language-processing", "computer-vision", "distributed-systems"],
    ["statistics", "engineering-economics", "devops", "cryptography", "iot"],
    ["big-data-analytics", "data-visualization", "machine-learning", "cloud-computing", "software-engineering"],
  ],
  "cyber-security": [
    ["calculus", "linear-algebra", "c-programming", "electrical-circuits", "engineering-chemistry"],
    ["probability", "statistics", "python-programming", "discrete-mathematics", "digital-logic-design"],
    ["data-structures", "object-oriented-programming", "dbms", "sql", "computer-networks"],
    ["algorithms", "operating-systems", "software-engineering", "web-technologies", "javascript"],
    ["cyber-security", "cryptography", "cloud-computing", "compiler-design", "theory-of-computation"],
    ["distributed-systems", "devops", "artificial-intelligence", "machine-learning", "big-data-analytics"],
    ["computer-networks", "cyber-security", "cryptography", "iot", "embedded-systems"],
    ["cyber-security", "cloud-computing", "devops", "data-visualization", "engineering-economics"],
  ],
  robotics: [
    ["calculus", "linear-algebra", "c-programming", "engineering-mechanics", "electronics"],
    ["probability", "statistics", "python-programming", "electrical-circuits", "digital-logic-design"],
    ["data-structures", "object-oriented-programming", "signals-and-systems", "embedded-systems", "dbms"],
    ["algorithms", "operating-systems", "computer-networks", "control-systems", "software-engineering"],
    ["robotics", "iot", "embedded-systems", "cloud-computing", "cyber-security"],
    ["artificial-intelligence", "machine-learning", "computer-vision", "deep-learning", "devops"],
    ["robotics", "control-systems", "fluid-mechanics", "thermodynamics", "engineering-economics"],
    ["robotics", "artificial-intelligence", "embedded-systems", "data-visualization", "software-engineering"],
  ],
};

function semesterPlan(
  semesterIndex: number,
  id: string,
  title: string,
  focus: string,
): SemesterPlan {
  return {
    id,
    title,
    focus,
    branchSubjectIds: Object.fromEntries(
      btechBranches.map((branch) => [
        branch.id,
        branchSemesterTracks[branch.id][semesterIndex] ?? [],
      ]),
    ) as Record<BtechBranchId, string[]>,
  };
}

const semesterPlans: Record<BtechYearId, SemesterPlan[]> = {
  "year-1": [
    semesterPlan(0, "semester-1", "Semester 1", "Engineering foundations, first programming, basic science, circuits, and mechanics."),
    semesterPlan(1, "semester-2", "Semester 2", "Probability, statistics, Python, discrete thinking, digital systems, and sustainability."),
  ],
  "year-2": [
    semesterPlan(2, "semester-3", "Semester 3", "Branch core begins: OOP, data structures, databases, signals, mechanics, and measurement."),
    semesterPlan(3, "semester-4", "Semester 4", "Algorithms, operating systems, networks, web/software foundations, controls, and applied modeling."),
  ],
  "year-3": [
    semesterPlan(4, "semester-5", "Semester 5", "Specialization paths across cloud, security, AI, IoT, embedded systems, economics, and branch practice."),
    semesterPlan(5, "semester-6", "Semester 6", "Advanced AI, ML, analytics, distributed systems, automation, and interdisciplinary engineering labs."),
  ],
  "year-4": [
    semesterPlan(6, "semester-7", "Semester 7", "Advanced branch electives, capstone preparation, controls, sustainability, and research-style labs."),
    semesterPlan(7, "semester-8", "Semester 8", "Capstone-ready revision across AI, cloud, security, DevOps, analytics, economics, and professional practice."),
  ],
};

const yearMeta: Record<BtechYearId, Omit<BtechYear, "semesters">> = {
  "year-1": {
    id: "year-1",
    title: "B.Tech Year 1",
    description: "Build the engineering base: math, programming, circuits, mechanics, digital logic, and environment.",
  },
  "year-2": {
    id: "year-2",
    title: "B.Tech Year 2",
    description: "Move into core branch depth: OOP, data structures, algorithms, DBMS, networks, OS, and web.",
  },
  "year-3": {
    id: "year-3",
    title: "B.Tech Year 3",
    description: "Specialize in AI, ML, data, cloud, security, embedded systems, distributed systems, and DevOps.",
  },
  "year-4": {
    id: "year-4",
    title: "B.Tech Year 4",
    description: "Prepare for capstone, internships, interviews, research, and industry-ready engineering practice.",
  },
};

export const btechYears: BtechYear[] = (Object.keys(yearMeta) as BtechYearId[]).map(
  (yearId) => ({
    ...yearMeta[yearId],
    semesters: semesterPlans[yearId].map((semester) => ({
      id: semester.id,
      title: semester.title,
      focus: semester.focus,
      subjects: Object.entries(semester.branchSubjectIds).flatMap(
        ([branchId, subjectIds]) =>
          subjectIds.map((subjectId) =>
            createBtechSubject(subjectId, {
              yearId,
              semesterId: semester.id,
              branchId: branchId as BtechBranchId,
            }),
          ),
      ),
    })),
  }),
);

export const btechCurriculum = btechYears;

export function getBtechYear(yearId: string) {
  return btechYears.find((year) => year.id === yearId);
}

export function getBtechSemester(yearId: string, semesterId: string) {
  return getBtechYear(yearId)?.semesters.find((semester) => semester.id === semesterId);
}

export function getBranchesForSemester(yearId: string, semesterId: string) {
  const semester = getBtechSemester(yearId, semesterId);

  if (!semester) {
    return [];
  }

  const branchIds = new Set(semester.subjects.map((subject) => subject.branchId));

  return btechBranches
    .filter((branch) => branchIds.has(branch.id))
    .map((branch) => ({
      ...branch,
      subjectCount: semester.subjects.filter((subject) => subject.branchId === branch.id).length,
    }));
}

export function getSubjectsForBranch(
  yearId: string,
  semesterId: string,
  branchId: string,
) {
  const semester = getBtechSemester(yearId, semesterId);
  return (
    semester?.subjects.filter(
      (subject) => subject.branchId === (branchId as BtechBranchId),
    ) ?? []
  );
}

export function getBtechSubject(
  yearId: string,
  semesterId: string,
  branchId: string,
  subjectId: string,
) {
  return getSubjectsForBranch(yearId, semesterId, branchId).find(
    (subject) => subject.id === subjectId,
  );
}

export function getBtechUnit(
  yearId: string,
  semesterId: string,
  branchId: string,
  subjectId: string,
  unitId: string,
): BtechUnit | undefined {
  return getBtechSubject(yearId, semesterId, branchId, subjectId)?.units.find(
    (unit) => unit.id === unitId,
  );
}

export function getBtechLesson(
  yearId: string,
  semesterId: string,
  branchId: string,
  subjectId: string,
  unitId: string,
  lessonId: string,
): BtechLesson | undefined {
  return getBtechUnit(yearId, semesterId, branchId, subjectId, unitId)?.lessons.find(
    (lesson) => lesson.id === lessonId,
  );
}

export function getAllBtechSubjects() {
  return btechYears.flatMap((year) =>
    year.semesters.flatMap((semester) =>
      semester.subjects.map((subject) => ({
        ...subject,
        yearId: year.id,
        yearTitle: year.title,
        semesterId: semester.id,
        semesterTitle: semester.title,
        branch: getBtechBranch(subject.branchId),
      })),
    ),
  );
}

export function getAllBtechLessons() {
  return getAllBtechSubjects().flatMap((subject) =>
    subject.units.flatMap((unit) => unit.lessons),
  );
}

export function getUniversityStats() {
  const subjects = getAllBtechSubjects();
  const lessons = getAllBtechLessons();

  return {
    years: btechYears.length,
    semesters: btechYears.reduce((total, year) => total + year.semesters.length, 0),
    branches: btechBranches.length,
    subjects: btechSubjectPlans.length,
    activeSemesterSubjects: subjects.length,
    lessons: lessons.length,
    labs: btechLabCatalog.length,
    quizzes: lessons.length * 120,
    codingProblems: codingPracticeProblems.length,
    visualizations: btechLabCatalog.length,
  };
}

export function getYearStaticParams() {
  return btechYears.map((year) => ({ yearId: year.id }));
}

export function getSemesterStaticParams() {
  return btechYears.flatMap((year) =>
    year.semesters.map((semester) => ({
      yearId: year.id,
      semesterId: semester.id,
    })),
  );
}

export function getBranchStaticParams() {
  return btechYears.flatMap((year) =>
    year.semesters.flatMap((semester) =>
      getBranchesForSemester(year.id, semester.id).map((branch) => ({
        yearId: year.id,
        semesterId: semester.id,
        branchId: branch.id,
      })),
    ),
  );
}

export function getSubjectStaticParams() {
  return btechYears.flatMap((year) =>
    year.semesters.flatMap((semester) =>
      semester.subjects.map((subject) => ({
        yearId: year.id,
        semesterId: semester.id,
        branchId: subject.branchId,
        subjectId: subject.id,
      })),
    ),
  );
}

export function getUnitStaticParams() {
  return btechYears.flatMap((year) =>
    year.semesters.flatMap((semester) =>
      semester.subjects.flatMap((subject) =>
        subject.units.map((unit) => ({
          yearId: year.id,
          semesterId: semester.id,
          branchId: subject.branchId,
          subjectId: subject.id,
          unitId: unit.id,
        })),
      ),
    ),
  );
}

export function getLessonStaticParams() {
  return btechYears.flatMap((year) =>
    year.semesters.flatMap((semester) =>
      semester.subjects.flatMap((subject) =>
        subject.units.flatMap((unit) =>
          unit.lessons.map((lesson) => ({
            yearId: year.id,
            semesterId: semester.id,
            branchId: subject.branchId,
            subjectId: subject.id,
            unitId: unit.id,
            lessonId: lesson.id,
          })),
        ),
      ),
    ),
  );
}

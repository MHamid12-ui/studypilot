/**
 * StudyPilot — shared subject catalog.
 *
 * Predefined subjects seed a user's `_subjects` list when selected during
 * onboarding (specs/data-layer.md §1). Custom subjects added via
 * "+ Add Subject" are stored in the same list with `custom: true` and an
 * empty topic array — the app must work without topics.
 */

export interface PredefinedSubject {
  name: string;
  topics: string[];
}

export const PREDEFINED_SUBJECTS: PredefinedSubject[] = [
  {
    name: "Computer Science & Programming",
    topics: [
      "Programming Fundamentals",
      "Object-Oriented Programming",
      "Data Structures",
      "Algorithms",
      "Databases",
      "Computer Networks",
      "Operating Systems",
      "Artificial Intelligence",
    ],
  },
  {
    name: "Mathematics",
    topics: [
      "Algebra",
      "Geometry",
      "Calculus",
      "Statistics",
      "Probability",
      "Linear Algebra",
      "Trigonometry",
      "Discrete Mathematics",
    ],
  },
];

export interface EducationLevelOption {
  value: "HIGH_SCHOOL" | "UNDERGRADUATE";
  label: string;
  description: string;
}

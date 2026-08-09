import type { EducationLevel } from '../types';

// Mock responses that simulate GPT-4o tutor behavior
const TUTOR_RESPONSES: Record<string, string[]> = {
  mathematics: [
    "Great question! Let's break this down step by step. **First**, consider the fundamental concept here…",
    "That's an interesting area of mathematics. The key principle to understand is that **patterns emerge** from the underlying structure. Let me show you with an example:\n\n> If we take the function f(x) = x², its derivative is f'(x) = 2x. This tells us the rate of change at any point.\n\nDoes this clarify things?",
    "Think of it this way: mathematics is like a language for describing patterns. When you encounter a problem like this, the first step is always to **identify what you know** and **what you're trying to find**.",
    "Excellent question! Here's a helpful way to visualize it:\n\n1. Start with the basic definition\n2. Apply the relevant theorem\n3. Simplify step by step\n\nWant me to walk through a specific example?",
    "This connects to several important concepts. Let me highlight the key relationships:\n\n- **Core idea**: The fundamental theorem connects differentiation and integration\n- **Why it matters**: It lets us compute areas using antiderivatives\n- **Common application**: Finding the area under a curve\n\nWould you like a practice problem on this?",
  ],
  computer_science: [
    "Great question! Let's think about this from a CS perspective. The key insight is that **data structures** and **algorithms** work together to solve problems efficiently.\n\nFor example, choosing the right data structure can reduce time complexity from O(n²) to O(n log n).",
    "That's a fundamental concept in computer science. Here's how it works:\n\n```\nfunction example(n) {\n  // This runs in O(n) time\n  for (let i = 0; i < n; i++) {\n    console.log(i);\n  }\n}\n```\n\nThe key takeaway is understanding the **trade-offs** involved.",
    "Think about it like this: computers are really good at doing simple things very fast. The art of programming is breaking complex problems into simple steps that a computer can execute.\n\nWould you like me to explain a specific algorithm or concept in more detail?",
    "This is actually a classic problem in computer science! Here are the key ideas:\n\n1. **Abstraction** — hiding complexity behind clean interfaces\n2. **Modularity** — building systems from smaller, independent parts\n3. **Encapsulation** — keeping implementation details private\n\nWhich of these would you like to explore further?",
    "Let me explain with a concrete example. Imagine you're building a web application:\n\n- **Frontend**: What the user sees (HTML, CSS, JavaScript)\n- **Backend**: Server-side logic (APIs, databases)\n- **Database**: Where data is stored and retrieved\n\nEach layer has its own role and they communicate through well-defined interfaces.",
  ],
};

const GENERIC_RESPONSES = [
  "That's a great question! Let me explain this in detail.\n\n**The core concept** involves understanding the fundamental principles first. Once you grasp these, everything else builds on top of them naturally.",
  "I'd be happy to help with that! Here's a structured approach:\n\n1. First, understand the basic definition\n2. Then, look at how it applies in different contexts\n3. Finally, practice with examples to solidify your understanding\n\nWould you like to try a practice question on this topic?",
  "Let's work through this together. The most important thing to remember is that learning takes time and practice. Let me break it down:\n\n- **Step 1**: Identify what you already know\n- **Step 2**: Connect new information to existing knowledge\n- **Step 3**: Apply through practice\n\nWhat part would you like to focus on?",
  "This is a fascinating topic! Here's what you should know:\n\n> \"The only way to learn mathematics is to do mathematics.\" — Paul Halmos\n\nThe same applies to any subject. Active practice is key to mastery.",
  "Let me explain with an analogy. Think of this concept like building with LEGO blocks:\n\n- Each block is a basic concept\n- You combine them to build something complex\n- Understanding how blocks fit together is the key skill\n\nReady to dive deeper into this?",
];

function getSubjectKey(topic: string): string {
  const lower = topic.toLowerCase();
  if (['algebra', 'geometry', 'trigonometry', 'calculus', 'statistics', 'linear algebra', 'discrete mathematics', 'pre-calculus'].some(s => lower.includes(s))) {
    return 'mathematics';
  }
  if (['programming', 'data structures', 'algorithms', 'web development', 'databases', 'operating systems', 'networks', 'cybersecurity', 'computer', 'software'].some(s => lower.includes(s))) {
    return 'computer_science';
  }
  return 'general';
}

function pickRandom(arr: string[]): string {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function mockTutorResponse(
  _message: string,
  topic: string,
  level: EducationLevel,
  _conversationHistory: { role: string; content: string }[]
): string {
  const subjectKey = getSubjectKey(topic);
  const responses = TUTOR_RESPONSES[subjectKey] || GENERIC_RESPONSES;

  // Personalise based on education level
  const levelContext = level === 'undergraduate'
    ? ' (at an undergraduate level, assuming foundational knowledge)'
    : ' (at a high school level, starting from basics)';

  // Build contextual response
  const topicIntro = `Great question about **${topic}**${levelContext}.\n\n`;
  const body = pickRandom(responses);
  const followUp = '\n\n---\n\n*Feel free to ask a follow-up question, or type **"practice"** to get a quiz question!*';

  return topicIntro + body + followUp;
}

// Map subject display names to quiz bank subject keys
function subjectToQuizKey(subjectName: string): 'math' | 'cs' | null {
  const lower = subjectName.toLowerCase();
  if (lower.includes('math')) return 'math';
  if (lower.includes('computer')) return 'cs';
  return null;
}

export function mockGenerateQuiz(subjectName: string, topic: string, _level: EducationLevel): {
  questionText: string;
  options: string[];
  correctIndex: number;
  explanation: string;
} {
  // First, try to find a question that matches the exact topic name
  const qa = QUIZ_BANK.filter(q => q.topic.toLowerCase() === topic.toLowerCase());
  if (qa.length > 0) {
    const chosen = qa[Math.floor(Math.random() * qa.length)];
    return {
      questionText: chosen.questionText,
      options: chosen.options,
      correctIndex: chosen.correctIndex,
      explanation: chosen.explanation,
    };
  }

  // Fallback: use the subject name to pick relevant questions
  const subjectKey = subjectToQuizKey(subjectName);
  const pool = subjectKey
    ? QUIZ_BANK.filter(q => q.subject === subjectKey)
    : QUIZ_BANK; // Unknown subject → show questions from the full bank

  const chosen = pool.length > 0
    ? pool[Math.floor(Math.random() * pool.length)]
    : QUIZ_BANK[Math.floor(Math.random() * QUIZ_BANK.length)];

  return {
    questionText: chosen.questionText,
    options: chosen.options,
    correctIndex: chosen.correctIndex,
    explanation: chosen.explanation,
  };
}

export function mockEvaluateAnswer(
  selectedIndex: number,
  correctIndex: number,
  _questionText: string,
  explanation: string
): { isCorrect: boolean; explanation: string } {
  const isCorrect = selectedIndex === correctIndex;
  return {
    isCorrect,
    explanation: isCorrect
      ? `✅ **Correct!** ${explanation}`
      : `❌ **Not quite.** The correct answer was option **${correctIndex + 1}**. ${explanation}`,
  };
}

interface QuizBankItem {
  subject: 'math' | 'cs';
  topic: string;
  questionText: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const QUIZ_BANK: QuizBankItem[] = [
  // Mathematics questions
  {
    subject: 'math',
    topic: 'algebra',
    questionText: 'What is the solution to the equation 2x + 5 = 13?',
    options: ['x = 3', 'x = 4', 'x = 5', 'x = 6'],
    correctIndex: 1,
    explanation: 'Subtract 5 from both sides: 2x = 8, then divide by 2: x = 4.',
  },
  {
    subject: 'math',
    topic: 'calculus',
    questionText: 'What is the derivative of f(x) = 3x²?',
    options: ["f'(x) = 3x", "f'(x) = 6x", "f'(x) = 6x²", "f'(x) = 3x²"],
    correctIndex: 1,
    explanation: 'Using the power rule: d/dx (xⁿ) = n·xⁿ⁻¹, so d/dx (3x²) = 3·2x = 6x.',
  },
  {
    subject: 'math',
    topic: 'trigonometry',
    questionText: 'What is sin²(θ) + cos²(θ) equal to?',
    options: ['0', '1', '-1', 'sin(2θ)'],
    correctIndex: 1,
    explanation: 'This is the Pythagorean identity: sin²(θ) + cos²(θ) = 1 for any angle θ.',
  },
  {
    subject: 'math',
    topic: 'statistics',
    questionText: 'What is the mean of the numbers: 4, 8, 6, 5, 2?',
    options: ['4', '5', '6', '7'],
    correctIndex: 1,
    explanation: 'Sum = 4+8+6+5+2 = 25. There are 5 numbers, so mean = 25/5 = 5.',
  },
  {
    subject: 'math',
    topic: 'linear algebra',
    questionText: 'What is the determinant of the 2×2 matrix [[1, 2], [3, 4]]?',
    options: ['-2', '2', '10', '-10'],
    correctIndex: 0,
    explanation: 'det = (1×4) - (2×3) = 4 - 6 = -2.',
  },
  {
    subject: 'math',
    topic: 'geometry',
    questionText: 'What is the area of a circle with radius 5?',
    options: ['10π', '25π', '5π', '15π'],
    correctIndex: 1,
    explanation: 'Area = πr² = π×5² = 25π.',
  },
  // Computer Science questions
  {
    subject: 'cs',
    topic: 'data structures',
    questionText: 'Which data structure operates on a Last-In-First-Out (LIFO) principle?',
    options: ['Queue', 'Stack', 'Linked List', 'Tree'],
    correctIndex: 1,
    explanation: 'A stack follows LIFO — the last element added is the first one removed (like a stack of plates).',
  },
  {
    subject: 'cs',
    topic: 'algorithms',
    questionText: 'What is the time complexity of binary search on a sorted array of n elements?',
    options: ['O(n)', 'O(n²)', 'O(log n)', 'O(n log n)'],
    correctIndex: 2,
    explanation: 'Binary search halves the search space each iteration, resulting in O(log n) time complexity.',
  },
  {
    subject: 'cs',
    topic: 'programming fundamentals',
    questionText: 'What does the term "variable" mean in programming?',
    options: [
      'A fixed value that never changes',
      'A named storage location for data',
      'A type of loop',
      'A function that returns a value',
    ],
    correctIndex: 1,
    explanation: 'A variable is a named storage location in memory that holds data which can change during program execution.',
  },
  {
    subject: 'cs',
    topic: 'databases',
    questionText: 'What SQL keyword is used to retrieve data from a database?',
    options: ['GET', 'FETCH', 'SELECT', 'RETRIEVE'],
    correctIndex: 2,
    explanation: 'The SELECT statement is used to query or retrieve data from one or more tables in a database.',
  },
  {
    subject: 'cs',
    topic: 'networks',
    questionText: 'What protocol is commonly used to send emails?',
    options: ['HTTP', 'FTP', 'SMTP', 'TCP'],
    correctIndex: 2,
    explanation: 'SMTP (Simple Mail Transfer Protocol) is the standard protocol for sending emails across the Internet.',
  },
  {
    subject: 'cs',
    topic: 'operating systems',
    questionText: 'What is the main purpose of an operating system?',
    options: [
      'Run only one application at a time',
      'Manage hardware and software resources',
      'Connect to the internet',
      'Create documents',
    ],
    correctIndex: 1,
    explanation: 'An operating system manages hardware and software resources, provides services for programs, and acts as an intermediary between user and hardware.',
  },
];
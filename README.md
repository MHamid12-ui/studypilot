# StudyPilot 🎓

**StudyPilot** is an AI-powered study companion designed to help students **learn, practice, organize their studies, and track their progress** in one place.

The platform provides a simple and personalized learning environment where students can manage their subjects, explore topics, practice questions, and get AI-powered learning assistance.

---

## Overview

Students often have to manage multiple subjects, study materials, practice sessions, and their learning progress separately.

**StudyPilot** aims to bring these activities together in one platform.

The project focuses on creating a **student-friendly, personalized, and easy-to-use learning experience** with AI-powered features.

---

## Key Features

### 🎯 Personalized Subject Management

* Manage multiple subjects from one dashboard.
* Includes built-in subjects such as **Maths and Computer Science**.
* Add custom subjects according to your learning needs.
* Organize learning around specific topics.

### 🤖 AI Tutor

* Provides AI-powered learning assistance.
* Helps students understand difficult concepts.
* Supports context-aware questions and explanations.
* Designed to provide personalized study support.

### 📝 Practice & Quiz Tracking

* Practice questions based on learning topics.
* Track quiz attempts and study activity.
* Helps students maintain consistent learning habits.

### 📊 Progress & Session History

* Keep track of previous study sessions.
* View learning activity and quiz history.
* Provides a foundation for understanding learning progress over time.

### 🔐 User Authentication

* User signup and login system.
* Separate user sessions.
* User-specific study data.
* Supports multiple users with isolated local data.

### 📱 Responsive Design

* Clean and modern education-focused interface.
* Responsive layout for desktop and mobile devices.
* Simple navigation designed for students.

---

## Tech Stack

| Technology         | Purpose                            |
| ------------------ | ---------------------------------- |
| **React**          | Frontend application               |
| **TypeScript**     | Type-safe development              |
| **Vite**           | Development and build tool         |
| **Tailwind CSS**   | UI styling                         |
| **React Router**   | Application routing                |
| **Lucide React**   | Interface icons                    |
| **LocalStorage**   | Local user and study data          |
| **Native Builder** | AI-powered application development |

---

## Application Structure

StudyPilot is organized into different sections to provide a complete learning workflow:

```text
Authentication
      ↓
Onboarding
      ↓
Dashboard
      ↓
Subjects & Topics
      ↓
AI Tutor / Practice
      ↓
Progress & Session History
      ↓
Profile & Settings
```

---

## Main Pages

### 🔐 Authentication

* Login
* Signup
* User session management

### 👋 Onboarding

Students can select their education level and choose their initial subjects before starting their learning journey.

### 🏠 Dashboard

Provides a central place to access subjects, learning activities, and important study information.

### 📚 Subjects

Students can manage their subjects and add custom topics based on their requirements.

### 🤖 AI Tutor

Provides AI-powered support for understanding concepts and answering study-related questions.

### 📝 Practice

Designed for practicing questions and improving understanding through active learning.

### 📈 Progress

Provides access to learning activity, quiz attempts, and session history.

### 👤 Profile

Displays user information and learning-related details.

### ⚙️ Settings

Provides application and user preferences.

---

## Data & User Experience

StudyPilot uses a **user-specific local data structure** to keep different users' information separated.

Important application data is stored using browser **LocalStorage**, allowing the project to work without requiring a traditional database for the current prototype.

This approach also makes the project lightweight and suitable for a hackathon prototype.

---

## Getting Started

### Prerequisites

Make sure you have installed:

* Node.js
* npm
* Git

### 1. Clone the Repository

```bash
git clone <your-repository-url>
```

### 2. Open the Project

```bash
cd studypilot
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Start the Development Server

```bash
npm run dev
```

The application will start on the local development server.

---

## Production Build

To create a production build:

```bash
npm run build
```

To check the project for TypeScript errors:

```bash
npx tsc --noEmit
```

---

## Hackathon

StudyPilot was developed for the:

**AI Factory Native Builder Hackathon**

Organized by:

**lablab.ai & NativelyAI**

The project was built under a limited hackathon timeline, focusing on developing a functional AI-powered learning platform and gaining practical experience in modern web and AI application development.

---

## Project Goals

The main goals of StudyPilot are to:

* Make studying more organized.
* Provide personalized learning support.
* Help students practice consistently.
* Keep learning activity in one place.
* Make AI-based learning easier to access.
* Create a simple and student-friendly learning experience.

---

## Future Improvements

StudyPilot can be further improved with:

* 📅 Personalized study plans
* 🧠 More advanced AI tutoring
* 📊 Detailed performance analytics
* 🎯 AI-generated learning goals
* 📝 More advanced quizzes and assessments
* 🔔 Study reminders and notifications
* ☁️ Cloud-based data synchronization
* 👥 Collaborative learning features
* 📚 Support for more subjects
* 🔐 Secure backend authentication and database storage

---

## Project Status

**Status: Hackathon Prototype**

StudyPilot is an actively evolving project. The current version focuses on the core student learning experience, while additional AI, analytics, and personalization features can be added in future versions.

---

## License

This project was created as a **hackathon project for learning, experimentation, and development**.

# ⚡ BITSPARKS — AI-Powered Student Productivity Platform

A full-stack web application helping students manage studies, mental health, career planning, and productivity in one unified platform.

## 🗂 Project Structure

```
bitsparks/
├── frontend/                   # React + Tailwind CSS
│   ├── public/
│   └── src/
│       ├── components/
│       │   ├── auth/           # Login, Register, ProtectedRoute
│       │   ├── dashboard/      # DashboardHome, StatsCard, Charts
│       │   ├── study/          # PomodoroTimer, TaskManager, StudyPlanner
│       │   ├── mental/         # MoodTracker, Journal, Breathing, Quotes
│       │   ├── career/         # AptitudeQuiz, SkillEngine, Roadmap
│       │   ├── academic/       # ExamCountdown, RevisionPlanner, Goals
│       │   ├── finance/        # ScholarshipSearch, BudgetPlanner, Jobs
│       │   ├── social/         # CommunityGroups, WellnessTips
│       │   └── skills/         # Courses, DigitalSkills, NewsWidget
│       ├── pages/              # Route-level page components
│       ├── context/            # AuthContext, AppContext
│       ├── hooks/              # useAuth, useTimer, useMood
│       └── utils/              # api.js, helpers.js, constants.js
│
└── backend/                    # Node.js + Express
    ├── config/                 # db.js, jwt.js
    ├── middleware/             # auth.js, errorHandler.js
    ├── models/                 # User, Task, Mood, Journal, Goal
    ├── controllers/            # auth, study, mental, career, etc.
    └── routes/                 # /api/auth, /api/study, /api/mental, etc.
```

## 🚀 Quick Start

### Backend
```bash
cd backend
npm install
cp .env.example .env   # Fill in MONGO_URI and JWT_SECRET
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm start
```

## 🛠 Tech Stack
- **Frontend**: React 18, Tailwind CSS, Recharts, React Router v6
- **Backend**: Node.js, Express 4, Mongoose
- **Database**: MongoDB Atlas
- **Auth**: JWT + bcrypt
- **State**: React Context + useReducer

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Student registration |
| POST | /api/auth/login | JWT login |
| GET | /api/auth/me | Get current user |
| GET/POST | /api/study/tasks | CRUD tasks |
| GET/POST | /api/study/sessions | Pomodoro sessions |
| GET/POST | /api/mental/moods | Mood entries |
| GET/POST | /api/mental/journals | Journal entries |
| GET/POST | /api/academic/goals | Goal tracking |
| GET/POST | /api/academic/exams | Exam countdowns |
| GET | /api/career/quiz | Aptitude questions |
| POST | /api/career/quiz/submit | Submit & get roadmap |
| GET | /api/finance/scholarships | Scholarship listings |
| GET | /api/finance/jobs | Part-time job listings |

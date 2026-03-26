# OTRAS Dashboard

A complete React + Vite + TailwindCSS dashboard for the OTRAS exam preparation platform.

## Tech Stack

- React 18
- Vite 5
- TailwindCSS 3
- Lucide React Icons
- React Router DOM 6

## Setup & Run

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

## Project Structure

```
otras-dashboard/
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── package.json
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── index.css
    ├── components/
    │   ├── Sidebar.jsx
    │   ├── TopHeader.jsx
    │   ├── PageContainer.jsx
    │   ├── Card.jsx
    │   ├── StatCard.jsx
    │   ├── ExamCard.jsx
    │   ├── TierCard.jsx
    │   ├── ScheduleItem.jsx
    │   └── FormField.jsx
    └── pages/
        ├── Dashboard.jsx
        ├── Eligibility.jsx
        ├── ArthaEngine.jsx
        ├── Exams.jsx
        ├── StudyPlan.jsx
        ├── Resources.jsx
        ├── Profile.jsx
        ├── CareerAI.jsx
        ├── MockTests.jsx
        └── Analytics.jsx
```

## Pages

| Route (sidebar) | Page |
|---|---|
| dashboard | Welcome hero, feature cards, performance chart, daily sprint |
| exams | Exam discovery with search, save, apply |
| eligibility | Eligibility engine with results |
| artha | Artha multi-tier journey |
| career | Career AI roadmap generator |
| studyplan | AI study plan architect |
| mocktests | Mock tests (placeholder) |
| analytics | Analytics (placeholder) |
| profile | OTR registration form |

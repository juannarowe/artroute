# Art Route

Mobile-first web app for discovering art gallery opening/vernissage events
in Barcelona. Bootcamp project (IT Academy / Barcelona Activa).

## Stack

**Frontend**
- React + Vite + TypeScript
- Firebase Auth (authentication)
- React Query (@tanstack/react-query) — data caching and sync
- Leaflet (interactive map)
- FullCalendar (event calendar)
- Recharts (statistics)

**Backend**
- NestJS + TypeScript
- MongoDB or SQL (TBD)

**AI**
- Anthropic API — "AI Assist" feature on the Create Event form

## Project structure

art-route/
├── frontend/ # React + Vite + TypeScript
├── backend/ # NestJS
├── .gitignore
└── README.md

## Running locally

### Frontend
```bash
cd frontend
npm install
npm run dev
```
Available at `http://localhost:5173`

### Backend
```bash
cd backend
npm install
npm run start:dev
```
Available at `http://localhost:3000`

## Workflow (Git Flow)

- `main` — reflects production/deployment.
- `develop` — integration branch; receives merges from all completed tasks.
- `feature/*`, `chore/*` — one branch per Trello task, created from `develop`.
- Per-task flow: branch → commits → Pull Request into `develop` → review/approval → merge.
- `release/*` — stabilization before going to `main` (end of MVP).

Commits follow the [Conventional Commits](https://www.conventionalcommits.org/)
convention (`feat:`, `fix:`, `chore:`, `docs:`, `test:`, `refactor:`).

## Task tracking

Full backlog on Trello — **Art Route** board
(lists: To Do / In Progress / Done).
Each card is tagged `[TECH]` or `[FEATURE]` and named after its
corresponding Git Flow branch, e.g.
`[FEATURE] [feature/my-events] My Events page (status badges + overall stats)`.

## Data model (summary)

**Event**: title, gallery/venue, address, lat/lng, date/time, category,
description, image, price, external link, createdBy, status
(`pending | published | rejected`), rejectionNote.

**User**: name, email, role (`user | admin`).
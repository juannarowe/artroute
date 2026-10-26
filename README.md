# Art Route

Mobile-first web app to discover **art gallery openings (vernissages) in Barcelona**.
Visitors explore the events on a list, a map, a calendar and a statistics panel.
Logged-in users mark the openings they will go to and submit their own events,
which an admin approves before they are published.

Final project of the Front-End Development bootcamp — IT Academy (Barcelona Activa).

**Live demo:** https://artroute-kappa.vercel.app
**API:** https://artroute.onrender.com/events

> The API runs on Render's free plan: after 15 minutes without use it goes to
> sleep, so the first request can take up to ~50 seconds.

---

## Features

| Who | What they can do |
|---|---|
| **Visitor** | Browse published events as cards, open an event's detail page, see them on the **map** and in the **statistics** panel |
| **Logged-in user** | Register / log in (email + password or Google), mark **Go / Going** on events, see the **Going** tab, the **calendar**, **create events** (they start as *pending*) and follow them in **My Events** (status badges, rejection note) |
| **Admin** | **Manage Events** panel: approve or reject pending events (with an optional note) and see every event with its status |

The same data stays **in sync** everywhere: approving an event makes it appear
on the list, the map, the calendar and the charts at once, without reloading.

## Tech stack

**Frontend** (`frontend/`)
- React 19 + Vite + TypeScript
- React Router (protected and admin-only routes)
- TanStack React Query — single source of truth for server data
- Firebase Auth (email/password + Google)
- Tailwind CSS v4 + shadcn/ui
- Leaflet (react-leaflet) · FullCalendar · Recharts
- Vitest + React Testing Library + vitest-cucumber (Gherkin)

**Backend** (`backend/`)
- NestJS 11 + TypeScript
- MongoDB Atlas + Mongoose
- firebase-admin (verifies the Firebase ID token on every write request)
- class-validator DTOs + global `ValidationPipe`
- Jest + jest-cucumber (Gherkin)

**Deploy:** Vercel (frontend) · Render (backend) · MongoDB Atlas (database)

## Architecture

### System overview

```mermaid
%%{init: {"theme": "base", "themeVariables": {"fontFamily": "ui-sans-serif, system-ui, sans-serif", "fontSize": "14px", "primaryColor": "#ffffff", "primaryTextColor": "#0a0a0a", "primaryBorderColor": "#0a0a0a", "secondaryColor": "#f5f5f5", "tertiaryColor": "#fafafa", "lineColor": "#737373", "textColor": "#737373", "clusterBkg": "#fafafa", "clusterBorder": "#a3a3a3", "titleColor": "#0a0a0a", "edgeLabelBackground": "#ffffff", "actorBkg": "#ffffff", "actorBorder": "#0a0a0a", "actorTextColor": "#0a0a0a", "actorLineColor": "#a3a3a3", "signalColor": "#737373", "signalTextColor": "#737373", "noteBkgColor": "#f5f5f5", "noteBorderColor": "#a3a3a3", "noteTextColor": "#0a0a0a", "labelBoxBkgColor": "#ffffff", "labelBoxBorderColor": "#0a0a0a", "labelTextColor": "#0a0a0a", "loopTextColor": "#737373", "activationBkgColor": "#f5f5f5", "activationBorderColor": "#0a0a0a", "attributeBackgroundColorOdd": "#ffffff", "attributeBackgroundColorEven": "#f5f5f5"}}}%%
flowchart LR
  person(["Visitor · User · Admin"])
  subgraph vercel ["Vercel"]
    spa["React SPA<br/>Vite · TypeScript<br/>React Query · shadcn/ui"]
  end
  subgraph firebase ["Firebase"]
    fbauth["Firebase Auth<br/>email + Google"]
  end
  subgraph render ["Render"]
    api["NestJS API<br/>guard · DTOs · services"]
  end
  subgraph atlas ["MongoDB Atlas"]
    db[("events<br/>users")]
  end
  person --> spa
  spa -- "log in · ID token" --> fbauth
  spa -- "HTTPS + Bearer token" --> api
  api -- "verify token" --> fbauth
  api -- "Mongoose" --> db
```

### Frontend data flow

One request feeds the list, the map, the calendar and the charts: they all read
the same React Query cache and transform it with `useMemo`.

```mermaid
%%{init: {"theme": "base", "themeVariables": {"fontFamily": "ui-sans-serif, system-ui, sans-serif", "fontSize": "14px", "primaryColor": "#ffffff", "primaryTextColor": "#0a0a0a", "primaryBorderColor": "#0a0a0a", "secondaryColor": "#f5f5f5", "tertiaryColor": "#fafafa", "lineColor": "#737373", "textColor": "#737373", "clusterBkg": "#fafafa", "clusterBorder": "#a3a3a3", "titleColor": "#0a0a0a", "edgeLabelBackground": "#ffffff", "actorBkg": "#ffffff", "actorBorder": "#0a0a0a", "actorTextColor": "#0a0a0a", "actorLineColor": "#a3a3a3", "signalColor": "#737373", "signalTextColor": "#737373", "noteBkgColor": "#f5f5f5", "noteBorderColor": "#a3a3a3", "noteTextColor": "#0a0a0a", "labelBoxBkgColor": "#ffffff", "labelBoxBorderColor": "#0a0a0a", "labelTextColor": "#0a0a0a", "loopTextColor": "#737373", "activationBkgColor": "#f5f5f5", "activationBorderColor": "#0a0a0a", "attributeBackgroundColorOdd": "#ffffff", "attributeBackgroundColorEven": "#f5f5f5"}}}%%
flowchart TB
  subgraph pages ["Pages · dumb components"]
    direction LR
    pEvents["Events<br/>All · Going"]
    pMap["Map"]
    pCalendar["Calendar"]
    pStats["Stats"]
  end
  subgraph derived ["Derived hooks · useMemo, no fetch"]
    direction LR
    hGoing["useGoingEvents"]
    hPins["useMapPins"]
    hItems["useCalendarItems"]
    hStats["useEventStats"]
  end
  hEvents["useEvents · status published"]
  cache[("React Query cache<br/>one request, shared")]
  apiFn["getEvents → apiFetch<br/>base URL · token · errors"]
  backend["GET /events?status=published"]
  pEvents --> hEvents
  pEvents --> hGoing
  pMap --> hPins
  pCalendar --> hItems
  pStats --> hStats
  hGoing --> hEvents
  hPins --> hEvents
  hItems --> hEvents
  hStats --> hEvents
  hEvents <--> cache
  hEvents --> apiFn
  apiFn --> backend
```

Main rules of the project:
1. **No `fetch` inside components.** All server data goes through React Query hooks (`frontend/src/hooks`).
2. **Dumb components, smart hooks.** Components receive props and render; fetching and transforming live in hooks.
3. **No duplicated state.** "Going" events, map pins, calendar items and chart data are **derived with `useMemo`** from the same cached `useEvents()` query — the map, calendar and stats never fetch.
4. **Security lives in the backend.** Hiding a button is UX, not security:
   - `FirebaseAuthGuard` → 401 without a valid token
   - DTO whitelist → users cannot send `status`, `createdBy` or `attendees`
   - owner rule → only the creator or an admin can edit/delete an event (403)
   - only admins can approve or reject (403); roles are stored in MongoDB, never taken from the request

### Backend request pipeline

Every request goes through the same checks, in this order:

```mermaid
%%{init: {"theme": "base", "themeVariables": {"fontFamily": "ui-sans-serif, system-ui, sans-serif", "fontSize": "14px", "primaryColor": "#ffffff", "primaryTextColor": "#0a0a0a", "primaryBorderColor": "#0a0a0a", "secondaryColor": "#f5f5f5", "tertiaryColor": "#fafafa", "lineColor": "#737373", "textColor": "#737373", "clusterBkg": "#fafafa", "clusterBorder": "#a3a3a3", "titleColor": "#0a0a0a", "edgeLabelBackground": "#ffffff", "actorBkg": "#ffffff", "actorBorder": "#0a0a0a", "actorTextColor": "#0a0a0a", "actorLineColor": "#a3a3a3", "signalColor": "#737373", "signalTextColor": "#737373", "noteBkgColor": "#f5f5f5", "noteBorderColor": "#a3a3a3", "noteTextColor": "#0a0a0a", "labelBoxBkgColor": "#ffffff", "labelBoxBorderColor": "#0a0a0a", "labelTextColor": "#0a0a0a", "loopTextColor": "#737373", "activationBkgColor": "#f5f5f5", "activationBorderColor": "#0a0a0a", "attributeBackgroundColorOdd": "#ffffff", "attributeBackgroundColorEven": "#f5f5f5"}}}%%
flowchart LR
  req["HTTP request"] --> guard["FirebaseAuthGuard<br/>verify token · load role"]
  guard -- "no or bad token" --> e401["401 Unauthorized"]
  guard --> pipe["ValidationPipe<br/>DTO whitelist"]
  pipe -- "invalid body" --> e400["400 Bad Request"]
  pipe --> ctrl["Controller<br/>route · params"]
  ctrl --> svc["Service<br/>owner / admin rules"]
  svc -- "not allowed" --> e403["403 Forbidden"]
  svc -- "unknown id" --> e404["404 Not Found"]
  svc --> model["Mongoose model"]
  model --> db[("MongoDB")]
```

### API

| Method | Route | Access | Description |
|---|---|---|---|
| GET | `/events?status=&owner=` | public | List events (sorted by date), optional filters |
| GET | `/events/:id` | public | One event (404 for unknown or invalid ids) |
| POST | `/events` | logged in | Create an event (`status: pending`, `createdBy` = token uid) |
| PATCH | `/events/:id` | owner or admin | Edit an event |
| DELETE | `/events/:id` | owner or admin | Delete an event (204) |
| POST | `/events/:id/go` | logged in | Toggle "Go" (only published events) |
| PATCH | `/events/:id/status` | admin | Publish or reject (+ optional note) |
| GET | `/users/me` | logged in | Current user and role (created on first login) |

### Data model

```mermaid
%%{init: {"theme": "base", "themeVariables": {"fontFamily": "ui-sans-serif, system-ui, sans-serif", "fontSize": "14px", "primaryColor": "#ffffff", "primaryTextColor": "#0a0a0a", "primaryBorderColor": "#0a0a0a", "secondaryColor": "#f5f5f5", "tertiaryColor": "#fafafa", "lineColor": "#737373", "textColor": "#737373", "clusterBkg": "#fafafa", "clusterBorder": "#a3a3a3", "titleColor": "#0a0a0a", "edgeLabelBackground": "#ffffff", "actorBkg": "#ffffff", "actorBorder": "#0a0a0a", "actorTextColor": "#0a0a0a", "actorLineColor": "#a3a3a3", "signalColor": "#737373", "signalTextColor": "#737373", "noteBkgColor": "#f5f5f5", "noteBorderColor": "#a3a3a3", "noteTextColor": "#0a0a0a", "labelBoxBkgColor": "#ffffff", "labelBoxBorderColor": "#0a0a0a", "labelTextColor": "#0a0a0a", "loopTextColor": "#737373", "activationBkgColor": "#f5f5f5", "activationBorderColor": "#0a0a0a", "attributeBackgroundColorOdd": "#ffffff", "attributeBackgroundColorEven": "#f5f5f5"}}}%%
erDiagram
  USER ||--o{ EVENT : "creates (createdBy)"
  USER }o--o{ EVENT : "goes to (attendees)"
  USER {
    string firebaseUid PK
    string name
    string email
    string role "user or admin"
  }
  EVENT {
    ObjectId _id PK
    string title
    string venue
    string address
    number lat
    number lng
    date date
    string category
    string description
    string image "optional"
    number price "0 = free"
    string externalLink "optional"
    string createdBy FK "Firebase uid"
    string status "pending, published or rejected"
    string rejectionNote "optional"
    list attendees "Firebase uids"
  }
```

## Sitemap

```mermaid
%%{init: {"theme": "base", "themeVariables": {"fontFamily": "ui-sans-serif, system-ui, sans-serif", "fontSize": "14px", "primaryColor": "#ffffff", "primaryTextColor": "#0a0a0a", "primaryBorderColor": "#0a0a0a", "secondaryColor": "#f5f5f5", "tertiaryColor": "#fafafa", "lineColor": "#737373", "textColor": "#737373", "clusterBkg": "#fafafa", "clusterBorder": "#a3a3a3", "titleColor": "#0a0a0a", "edgeLabelBackground": "#ffffff", "actorBkg": "#ffffff", "actorBorder": "#0a0a0a", "actorTextColor": "#0a0a0a", "actorLineColor": "#a3a3a3", "signalColor": "#737373", "signalTextColor": "#737373", "noteBkgColor": "#f5f5f5", "noteBorderColor": "#a3a3a3", "noteTextColor": "#0a0a0a", "labelBoxBkgColor": "#ffffff", "labelBoxBorderColor": "#0a0a0a", "labelTextColor": "#0a0a0a", "loopTextColor": "#737373", "activationBkgColor": "#f5f5f5", "activationBorderColor": "#0a0a0a", "attributeBackgroundColorOdd": "#ffffff", "attributeBackgroundColorEven": "#f5f5f5"}}}%%
flowchart TB
  home["/"] --> sEvents
  subgraph public ["Public"]
    sEvents["/events<br/>All · Going"]
    sDetail["/events/:id"]
    sMap["/map"]
    sStats["/stats"]
    sLogin["/login"]
    sRegister["/register"]
  end
  subgraph loggedIn ["Logged-in users"]
    sCalendar["/calendar"]
    sProfile["/profile"]
    sMyEvents["/my-events"]
    sCreate["/events/new"]
  end
  subgraph admins ["Admins"]
    sManage["/manage-events"]
  end
  sEvents --> sDetail
  sMap --> sDetail
  sCalendar --> sDetail
  sLogin <--> sRegister
  sProfile --> sMyEvents
  sProfile --> sCreate
  sManage --> sDetail
```

## User flows

### Event lifecycle

```mermaid
%%{init: {"theme": "base", "themeVariables": {"fontFamily": "ui-sans-serif, system-ui, sans-serif", "fontSize": "14px", "primaryColor": "#ffffff", "primaryTextColor": "#0a0a0a", "primaryBorderColor": "#0a0a0a", "secondaryColor": "#f5f5f5", "tertiaryColor": "#fafafa", "lineColor": "#737373", "textColor": "#737373", "clusterBkg": "#fafafa", "clusterBorder": "#a3a3a3", "titleColor": "#0a0a0a", "edgeLabelBackground": "#ffffff", "actorBkg": "#ffffff", "actorBorder": "#0a0a0a", "actorTextColor": "#0a0a0a", "actorLineColor": "#a3a3a3", "signalColor": "#737373", "signalTextColor": "#737373", "noteBkgColor": "#f5f5f5", "noteBorderColor": "#a3a3a3", "noteTextColor": "#0a0a0a", "labelBoxBkgColor": "#ffffff", "labelBoxBorderColor": "#0a0a0a", "labelTextColor": "#0a0a0a", "loopTextColor": "#737373", "activationBkgColor": "#f5f5f5", "activationBorderColor": "#0a0a0a", "attributeBackgroundColorOdd": "#ffffff", "attributeBackgroundColorEven": "#f5f5f5"}}}%%
stateDiagram-v2
  [*] --> pending : user submits the form
  pending --> published : admin approves
  pending --> rejected : admin rejects, with a note
  published --> [*]
  rejected --> [*]
  note right of published
    Visible on the list, map,
    calendar and stats
  end note
```

### Create an event → admin approval → everything in sync

```mermaid
%%{init: {"theme": "base", "themeVariables": {"fontFamily": "ui-sans-serif, system-ui, sans-serif", "fontSize": "14px", "primaryColor": "#ffffff", "primaryTextColor": "#0a0a0a", "primaryBorderColor": "#0a0a0a", "secondaryColor": "#f5f5f5", "tertiaryColor": "#fafafa", "lineColor": "#737373", "textColor": "#737373", "clusterBkg": "#fafafa", "clusterBorder": "#a3a3a3", "titleColor": "#0a0a0a", "edgeLabelBackground": "#ffffff", "actorBkg": "#ffffff", "actorBorder": "#0a0a0a", "actorTextColor": "#0a0a0a", "actorLineColor": "#a3a3a3", "signalColor": "#737373", "signalTextColor": "#737373", "noteBkgColor": "#f5f5f5", "noteBorderColor": "#a3a3a3", "noteTextColor": "#0a0a0a", "labelBoxBkgColor": "#ffffff", "labelBoxBorderColor": "#0a0a0a", "labelTextColor": "#0a0a0a", "loopTextColor": "#737373", "activationBkgColor": "#f5f5f5", "activationBorderColor": "#0a0a0a", "attributeBackgroundColorOdd": "#ffffff", "attributeBackgroundColorEven": "#f5f5f5"}}}%%
sequenceDiagram
  actor U as User
  participant FE as React app
  participant API as NestJS API
  participant DB as MongoDB
  actor A as Admin
  U->>FE: Fills in the "Create event" form
  FE->>API: POST /events (Bearer token)
  API->>DB: save · status pending · createdBy = uid
  API-->>FE: 201 Created
  FE-->>U: My Events shows "Pending review"
  A->>FE: Manage Events · Approve
  FE->>API: PATCH /events/:id/status · published
  API->>DB: status = published
  API-->>FE: 200 OK
  FE->>FE: invalidate the events cache
  FE-->>A: List, map, calendar and stats update at once
```

### Mark "Go"

```mermaid
%%{init: {"theme": "base", "themeVariables": {"fontFamily": "ui-sans-serif, system-ui, sans-serif", "fontSize": "14px", "primaryColor": "#ffffff", "primaryTextColor": "#0a0a0a", "primaryBorderColor": "#0a0a0a", "secondaryColor": "#f5f5f5", "tertiaryColor": "#fafafa", "lineColor": "#737373", "textColor": "#737373", "clusterBkg": "#fafafa", "clusterBorder": "#a3a3a3", "titleColor": "#0a0a0a", "edgeLabelBackground": "#ffffff", "actorBkg": "#ffffff", "actorBorder": "#0a0a0a", "actorTextColor": "#0a0a0a", "actorLineColor": "#a3a3a3", "signalColor": "#737373", "signalTextColor": "#737373", "noteBkgColor": "#f5f5f5", "noteBorderColor": "#a3a3a3", "noteTextColor": "#0a0a0a", "labelBoxBkgColor": "#ffffff", "labelBoxBorderColor": "#0a0a0a", "labelTextColor": "#0a0a0a", "loopTextColor": "#737373", "activationBkgColor": "#f5f5f5", "activationBorderColor": "#0a0a0a", "attributeBackgroundColorOdd": "#ffffff", "attributeBackgroundColorEven": "#f5f5f5"}}}%%
sequenceDiagram
  actor U as User
  participant FE as React app
  participant API as NestJS API
  U->>FE: Clicks "Go" on an event
  FE->>API: POST /events/:id/go (Bearer token)
  alt uid not in attendees
    API-->>FE: 201 · uid added
  else uid already in attendees
    API-->>FE: 201 · uid removed
  end
  FE->>FE: invalidate events and event caches
  FE-->>U: Button shows "Going", Going tab and black map pin update
```

## Project structure

```
artroute/
├── frontend/
│   └── src/
│       ├── api/          # functions that call the API (one per route)
│       ├── components/   # reusable UI (EventCard, EventsMap, EventsCalendar, ...)
│       │   └── ui/       # shadcn/ui components (generated)
│       ├── context/      # AuthContext + AuthProvider (Firebase session)
│       ├── hooks/        # React Query hooks and derived data (useEvents, useMapPins, ...)
│       ├── layouts/      # header + bottom navigation
│       ├── lib/          # apiFetch, Firebase, formatters, counting helpers
│       ├── pages/        # one file per route (+ .feature and .test.tsx files)
│       └── types/        # TypeScript types (ArtEvent, AppUser, ...)
└── backend/
    └── src/
        ├── auth/         # FirebaseAuthGuard (+ Gherkin tests)
        ├── events/       # schema, DTOs, controller, service (+ Gherkin tests)
        ├── users/        # user schema (role), GET /users/me
        └── seed/         # sample data + seed script
```

## Running locally

**Requirements:** Node.js 22+, a MongoDB Atlas cluster and a Firebase project
(Authentication with Email/Password and Google enabled).

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env   # then fill in the values (see below)
npm run seed           # optional: 20 sample events in Barcelona
npm run start:dev      # http://localhost:3000
```

| Variable | Description |
|---|---|
| `MONGODB_URI` | MongoDB Atlas connection string, with the database name `artroute` |
| `PORT` | Port of the API (default 3000) |
| `FRONTEND_URL` | Frontend origin allowed by CORS (`http://localhost:5173`) |
| `FIREBASE_PROJECT_ID` | Firebase project id (to verify ID tokens) |

### 2. Frontend

```bash
cd frontend
npm install
cp .env.example .env   # then fill in the values (see below)
npm run dev            # http://localhost:5173
```

| Variable | Description |
|---|---|
| `VITE_FIREBASE_*` | Firebase web app config (Firebase Console → Project settings) |
| `VITE_API_URL` | URL of the API (`http://localhost:3000`) |

> `VITE_*` variables end up in the browser bundle, so they must never contain
> secrets. The only secret (the MongoDB connection string) lives in the backend.

**Admin role:** every new user is a `user`. To make an admin, change `role` to
`"admin"` in the `users` collection in MongoDB Atlas.

## Scripts

| | Frontend | Backend |
|---|---|---|
| Development | `npm run dev` | `npm run start:dev` |
| Build | `npm run build` | `npm run build` |
| Lint | `npm run lint` | `npm run lint` |
| Tests | `npm test` | `npm test` |
| Other | `npm run preview` | `npm run seed`, `npm run start:prod` |

## Tests

Unit tests with **Gherkin scenarios**: the `.feature` files are executable
(vitest-cucumber in the frontend, jest-cucumber in the backend). External
services (MongoDB, Firebase, the API) are mocked, so the tests are fast and
always give the same result.

- **Backend (16 tests):** event permissions (owner / other user / admin / invalid id),
  auth guard (no token / invalid token / valid token + role), "Go" toggle,
  admin approval (publish, reject with note, forbidden for users, invalid status)
- **Frontend (34 tests):** events page (cards, empty state, Going tab logged in/out),
  register (success, email already in use), NotFound page, date and price formatters

```bash
cd backend && npm test
cd frontend && npm test
```

## Workflow

- **Git Flow:** `main` (production) ← `develop` ← `feature/*`, `chore/*`, `fix/*`, `test/*`, `docs/*`
- One branch and one Pull Request per Trello card; commits follow
  [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `chore:`, `test:`, `docs:`)
- Backlog on Trello (board **Art Route**: To Do / In Progress / Done); each card is
  named after its branch, e.g. `[FEATURE] [feature/my-events] My Events page`

## Next steps

- Edit and resubmit a rejected event; edit personal profile data
- Create / edit / delete events directly from the map and the calendar (Level 2)
- Filters by category and date shared by the map, calendar and charts (Level 3)
- "AI Assist" on the create form: clean description and suggested category from pasted text

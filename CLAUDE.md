# Art Route — instructions for Claude Code

Bootcamp final project (IT Academy). Mobile-first SPA to discover art gallery
openings (vernissages) in Barcelona. The student must be able to explain every
line in the final presentation, so clarity beats cleverness.

## Language
- Talk to the user in Portuguese.
- Code, comments, file names and commit messages in English.

## Stack
- Monorepo: `frontend/` (React + Vite + TypeScript) and `backend/` (NestJS).
- Database: MongoDB (Atlas) + Mongoose.
- Auth: Firebase Auth (frontend) + `firebase-admin` token verification (backend).
- Server data: React Query (`@tanstack/react-query`).
- UI: shadcn/ui with default styling (no re-theming).
- Map: Leaflet · Calendar: FullCalendar · Charts: Recharts.
- Tests: Vitest + Gherkin scenarios (`.feature` files).

## Code level: BEGINNER-FRIENDLY
- Simple, explicit code. No clever one-liners, no advanced TS generics.
- Descriptive names (`publishedEvents`, not `data2`).
- Small components: one job per component/file.
- Short comments only where the "why" is not obvious.

## Architecture rules (do NOT break these)
1. **No `fetch`/`axios` inside components.** All server data goes through
   React Query hooks in `frontend/src/hooks/`.
2. **Dumb components, smart hooks.** Components only receive props and render.
   Fetching, filtering, sorting and transforming live in hooks.
3. **No duplicated state.** Never store `events` + `filteredEvents` +
   `goingEvents`. Derive with `useMemo` from the cached data.
4. **Map, Calendar and stats never fetch.** They transform data from
   `useEvents()`, `useGoingEvents()` or `useMyEvents()`.
5. **Security lives in the backend.** Hiding a button is UX, not security.
   Ownership rule: only `createdBy` or an admin can edit/delete an event.
6. **DRY:** if the same JSX or logic appears twice, extract it.

### Planned hooks
- `useEvents(filters?)` → `GET /events?status=published`
- `useEvent(id)` → cache-first, falls back to `GET /events/:id`
- `useMyEvents()` → `GET /events?owner=<uid>` (all statuses)
- `useGoingEvents()` → derived with `useMemo`, no fetch
- `usePendingEvents()` → `GET /events?status=pending` (admin)

## Data model
**Event:** title, venue, address, lat, lng, date, category, description,
image, price, externalLink, createdBy (Firebase uid),
status (`pending` | `published` | `rejected`), rejectionNote?,
attendees (array of Firebase uids who marked "Go").

**User:** name, email, role (`user` | `admin`).

## Workflow (one Trello card at a time)
1. The student creates the branch from an up-to-date `develop`.
2. Move the Trello card (board "Art Route") to *In Progress*.
   Trello access comes from the claude.ai Trello connector (no `.mcp.json`).
3. Present a plan and wait for approval before writing code.
4. Implement, then explain the changes file by file (in Portuguese).
5. The student commits, pushes and opens the PR to `develop`
   (Claude drafts the PR description: simple, in English, with a test checklist).
6. After the merge, move the card to *Done* and comment the PR link.

From the Event schema card (`feature/events-schema`) onwards, the student
writes the code and Claude acts as a mentor: explain, review, give hints —
do not write the solution unless asked.

## Git rules
- Git Flow: `main` ← `develop` ← `feature/*` / `chore/*` / `fix/*`.
- One branch per Trello card. Never work directly on `develop` or `main`.
- **Do not commit, push or merge on your own.** When a step is done, stop,
  show a summary of the changes and SUGGEST a commit message.
- Commit messages follow Conventional Commits
  (`feat:`, `fix:`, `chore:`, `refactor:`, `test:`, `docs:`).
- Small commits: one logical change per commit.

## Before finishing any task
- The app builds without TypeScript errors.
- Explain briefly (in Portuguese) what was created and why, file by file.

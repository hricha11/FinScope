## FinScope UI (frontend)

Single-page React app for the FinScope backend running at `http://localhost:8080`.

### Tech
- React + Vite (TypeScript)
- Tailwind CSS
- React Router v7
- Axios with auth interceptor
- Recharts for charts
- Jest + React Testing Library (example test included)

### Getting started
1) Install deps
```bash
npm install
```

2) Run dev server (Vite)
```bash
VITE_API_BASE_URL=http://localhost:8080 npm run dev
# legacy env key also supported: REACT_APP_API_BASE_URL
```

3) Build
```bash
npm run build
```

4) Preview / serve
```bash
npm run preview
```

### Env
- `VITE_API_BASE_URL` (preferred) or `REACT_APP_API_BASE_URL` (fallback) to point at your Spring Boot server. Default is `http://localhost:8080`.

### Auth
- POST `/auth/register` and `/auth/login` return `{ token }`.
- Token is stored in `localStorage` under `finscope_token` and injected via Axios interceptor as `Authorization: Bearer <token>`.
- 401 responses trigger a safe logout + redirect to `/auth/login`.

### Available routes
- `/auth/login`, `/auth/register`
- `/dashboard` (protected)
- `/budget`
- `/goals`
- `/goals/:id`
- `/profile`
- `*` → 404 page

### Testing
```bash
npm test
```
Example: `SummaryCards` renders values from a mocked dashboard response.

### Notes
- UI keeps to Tailwind-only primitives (no external UI kits).
- If any backend endpoint shape differs, update the thin API helpers in `src/api/` (marked with TODO where assumptions were made).

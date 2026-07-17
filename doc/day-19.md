# 📅 Day 19 — Axios 401 → auto-logout redirect

_2026-07-16_ · Covers plan Day 19.

### 🎯 What I was trying to do

Make ANY `401 Unauthorized` from the backend automatically **clear the dead token and
redirect to `/login`** — so an expired/invalid token mid-session kicks the user out cleanly
instead of silently failing.

### 💡 What I learned

- **Axios interceptors** = checkpoints every request/response passes through.
  - Request interceptor: auto-attaches `Authorization: Bearer <token>` before every call.
  - Response interceptor: its 2nd function is the error handler (fires on 4xx/5xx).
  - Write the 401 logic ONCE here → it protects EVERY API call (DRY).
- **Why `window.location.href` not `useNavigate`:** `api.ts` is a plain module, not a React
  component, so Hooks can't run there (Rules of Hooks). Bonus: the full page reload wipes the
  dead session for a clean slate. (Three nav tools: `useNavigate` for onClick, `<Navigate>` for
  render path, `window.location` for anywhere else.)
- **`window`** = the global browser object; `window.location.href = '...'` navigates + reloads.

### 🐛 The bug my test caught (401 vs 403)

Faked a garbage token to trigger the redirect — but got **403, not 401**, so the redirect didn't fire.

- Backend `authenticateToken` distinguished: **no token → 401**, but **invalid/expired token → 403**.
- Convention: **401 = "who are you / bad credentials"** (missing OR invalid token);
  **403 = "I know you, but you can't do THIS"** (authenticated but not permitted).
- An invalid/expired token is a _credentials_ problem → should be **401**, not 403. The backend
  was mislabeling it. (Also: a real _expired_ token throws in `jwt.verify` too → would've been 403
  → redirect never fires. Good thing I tested.)

### ✅ What I actually did

- **Frontend (`services/api.ts`):** 401 branch → `authUtils.removeToken()` + `window.location.href = '/login'`
  (kept `return Promise.reject(error)` so callers still see the failure). Dropped the old `console.log`.
- **Backend (`server.ts`):** `authenticateToken` catch block `res.status(403)` → **`401`** for invalid
  tokens, so all auth failures are 401 and the frontend logic works. (nodemon auto-restarted on save.)

### 🧪 Verified in browser

- Logged in, then `localStorage.setItem("token", "garbage")` in console → clicked View →
  backend returned **401** → interceptor cleared token → **redirected to `/login`** ✅

### 📍 Where I am

Day 19 complete. Auth-failure story is now covered both ways:
Day 18 `ProtectedRoute` = "no token on arrival"; Day 19 interceptor = "token went bad mid-session".

### ⏭️ Next session

- **Day 20 — `Register.tsx`** (currently an empty stub): build a controlled form
  (email + master password + confirm) with client-side validation (email format,
  password ≥ 12 chars to match `server.ts`, passwords match), call `authAPI.register()`,
  and finally add the deferred `/register` route in `App.tsx`.
- Then **Day 21+** (Tailwind + design 21b–21f).

### 📌 Note

General study cheat-sheet of Days 17b–19 concepts written to `doc/note.md`.

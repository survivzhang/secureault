# 📅 Day 18 — ProtectedRoute (finishing React Router)

*2026-07-16* · Completes plan Day 18 (the `/dashboard` route + `useNavigate` were done back in day-17; this closes the guard).

### 🎯 What I was trying to do
Stop a logged-out user from reaching `/dashboard` by typing the URL directly —
build a `ProtectedRoute` wrapper that redirects to `/login` when there's no token.

### 💡 What I learned
- **The `children` prop:** whatever JSX you nest between a component's tags becomes its
  `children` prop automatically — you don't write `children=`. So
  `<ProtectedRoute><Dashboard/></ProtectedRoute>` passes `<Dashboard/>` in as `children`.
  Think "box": ProtectedRoute *receives* the element and decides whether to render it.
- **`React.ReactNode`** is the TypeScript type for "anything renderable" — the standard type
  for `children`. (Typecheck passed without importing React — React 19 types make the
  namespace available.)
- **Wrapper components can conditionally render children:** `if (!isAuthenticated) return <Navigate/>` else `return children`.
- **`<Navigate to="/login" replace />`** redirects by *rendering* (not by calling a function).
  `useNavigate` is for event handlers (onClick); `<Navigate>` is for the render path.
- **`replace`** is a bare boolean prop (`replace` = `replace={true}`, like `fullWidth` on Day 21c).
  It **replaces** the current history entry instead of pushing a new one — so the Back button
  won't bounce the user back into the blocked page.
- **default vs named imports:** `import Dashboard from ...` (default export, no braces) vs
  `import { authUtils } from ...` (named export, braces). The import must match the export style.
- **`return` + JSX parens** are optional — only needed when JSX starts on the line *below*
  `return` (to dodge automatic semicolon insertion).
- **Security recap:** this guard is **UX only**. The real lock is the backend JWT check on every
  route — without a token the API returns 401 regardless. ProtectedRoute just avoids showing a
  broken empty page.

### ✅ What I actually did (`App.tsx`)
- Imported `authUtils`.
- Wrote `ProtectedRoute({ children })`: redirect to `/login` if `!authUtils.isAuthenticated()`,
  else `return children`.
- Wrapped the dashboard route: `element={<ProtectedRoute><Dashboard/></ProtectedRoute>}`.

### 🧪 Verified in browser
- `localStorage.clear()` then visiting `/dashboard` → **redirected to `/login`** ✅
- Logged in (`test@test.com`) → `/dashboard` loads, list + View + Delete all work ✅

### 📍 Where I am
Day 18 complete. Routing done: navigate-after-login + protected dashboard.
(`/register` route deferred to Day 20, when `Register.tsx` actually exists.)

### ⏭️ Next session
- **Day 19** — Axios 401 redirect: in `services/api.ts` response interceptor, the 401 branch
  currently only `console.log`s. Make it `authUtils.removeToken()` + redirect to `/login`
  (pairs perfectly with today's guard — handles the *expired-token-mid-session* case).
- Then **Day 20** (`Register.tsx` + add its route), **Day 21+** (Tailwind + design 21b–21f).
- **Refactor note:** Day 23 replaces ProtectedRoute's raw `localStorage` check with `useAuth()` Context.

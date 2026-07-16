# 📝 Study Notes — Concepts Learned (Days 17b–19)

A cheat-sheet of the reusable knowledge from these sessions. Skim before interviews.

---

## 1. Navigation — three tools, three contexts ⭐

The single most important takeaway. **Which navigation tool depends on WHERE you are:**

| Context | Tool | Example |
|---|---|---|
| Inside a component, on an event (`onClick`) | `useNavigate()` | `const navigate = useNavigate(); navigate('/dashboard')` |
| Inside a component, on the render path | `<Navigate />` | `return <Navigate to="/login" replace />` |
| Anywhere else (plain modules, `api.ts`) | `window.location.href` | `window.location.href = '/login'` |

- `useNavigate` and `<Navigate>` are **React Router** tools — SPA navigation, no page reload, keeps app state.
- `window.location.href` is a **plain browser** API — full page reload, wipes in-memory state, works ANYWHERE.
- **Why `api.ts` must use `window.location`:** it's not a React component, so Hooks like `useNavigate` can't run there (Rules of Hooks). Bonus: the full reload is *good* on a dead session — clean slate.

---

## 2. The `window` object

- `window` = the **global browser object**. Everything the browser offers hangs off it.
- You use it constantly without the prefix: `alert()` = `window.alert()`, `localStorage` = `window.localStorage`, `setTimeout` = `window.setTimeout`.
- `window.location` = the current URL (read + navigate):
  - `.href` (full URL, assign to navigate), `.pathname` (`/dashboard`), `.origin`, `.search` (`?id=5`)
  - `.reload()`, `.replace('/login')` (navigate without a history entry), `.assign('/login')`
- Handy for later: `window.confirm("Delete?")` → returns `true`/`false` (Day 21 delete confirm).

---

## 3. Axios interceptors

- Two checkpoints every request/response passes through:
  - **Request interceptor** — runs BEFORE each request. Auto-attaches `Authorization: Bearer <token>`. (That's why you never add the token manually.)
  - **Response interceptor** — runs AFTER each response. Its 2nd function is the **error handler** (fires on 4xx/5xx).
- Win: write logic ONCE (e.g. 401 → logout + redirect), it protects EVERY API call. This is the point of a centralized API layer (DRY).
- `response.data` = the JSON body the backend sent (`res.json({...})`). The interceptor/methods return `.data` so callers get clean data, not the whole HTTP envelope.

---

## 4. The `children` prop (wrapper components)

- Whatever JSX you nest between a component's tags becomes its `children` prop — **automatically**, you don't write `children=`.
- `<ProtectedRoute><Dashboard/></ProtectedRoute>` → `<Dashboard/>` is passed in as `children`.
- Mental model: a **box**. The wrapper *receives* the element and decides whether to render it (`return children`) or not (`return <Navigate/>`).
- `React.ReactNode` = the TypeScript type for "anything renderable" — the standard type for `children`.

---

## 5. The three-state async pattern ⭐

Every network fetch has three possible states — the UI must handle all:

- `loading` — starts `true`, cleared in **`finally`** (runs whether the fetch succeeds OR throws).
- `error` — request failed.
- `data` — success (and note: **empty ≠ loading** — an empty list is a *success* with no data).
- Order of early returns matters: check `loading` FIRST, then empty, then render. (Else "empty" flashes before data arrives, since state starts as `[]`.)

---

## 6. React / TypeScript small but important

- **`useState` type inference:** `useState(true)` infers `boolean` on its own; `useState([])` can't infer element type → needs a generic: `useState<PasswordItem[]>([])`.
- **`PasswordItem` vs `PasswordItem[]`:** the interface = ONE object's shape; `[]` = an array of them. In JS, "array" IS what other languages call a "list".
- **`===` vs `==`:** always `===` (strict — compares type AND value, no hidden coercion).
- **Bare boolean props:** `<Navigate replace />` = `replace={true}`. A prop with no value defaults to `true`.
- **`replace` (history):** replaces the current history entry instead of pushing → Back button won't return to the blocked/dead page.
- **default vs named imports:** `import Dashboard from ...` (default export, no braces) vs `import { authUtils } from ...` (named export, braces). Must match how the file exported.
- **`return` + JSX parens:** optional — only needed when JSX starts on the line *below* `return` (avoids automatic semicolon insertion returning `undefined`).
- **`onClick` trap:** `onClick={() => handleDelete(p.id)}` (runs on click) — NOT `onClick={handleDelete(p.id)}` (runs immediately on render).

---

## 7. Patterns

- **refetch-after-mutate:** after a change (delete), re-fetch the list so UI matches the server. Simple, always correct, costs one extra round-trip. (Alternative: optimistic update — change local state immediately, roll back on failure.)
- **Lifting a function out of `useEffect`:** define `fetchPassword` at component top level so both the effect (on mount) and event handlers (delete → refetch) can call it.

---

## 8. Security recap (from reading both ends)

- **Least exposure:** `GET /passwords` (getAll) returns metadata only — NO password. Plaintext comes only from `GET /passwords/:id` (getOne) → `data.decryptedPassword`.
- **Parameterized queries:** `WHERE id = $1 AND user_id = $2` — `$1/$2` stop SQL injection.
- **`WHERE` selects rows; `DELETE` removes the whole row** (not just those columns). Use `UPDATE ... SET` to change specific fields.
- **Authentication vs Authorization:** token verify = "who you are" (`authenticateToken`); `AND user_id = ...` = "can you touch THIS row" (can only delete your own).
- **Frontend route guards (`ProtectedRoute`) are UX only.** The real lock is the backend JWT check on every route — no token → 401 regardless.

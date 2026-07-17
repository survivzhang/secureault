# 📅 Day 17b — Dashboard Polish (loading + empty + delete + view)

_2026-07-16_ · Covers plan Day 17b.

### 🎯 What I was trying to do

Turn the bare vault list into a usable dashboard: handle the **three async states**
(loading / empty / data) and add **Delete** and **View** actions per row.

### 💡 What I learned

- **The three-state pattern:** every network fetch can be _loading_, _error_, or _data_.
  The UI must handle all three. `loading` starts `true` and is cleared in `finally`
  (so it turns off whether the fetch succeeds OR throws).
- **Empty ≠ loading:** an empty vault (`passwords.length === 0`) is a _success_ with no
  data — a separate early return, checked **after** the loading check (else it flashes
  "empty" before data arrives, since `passwords` starts as `[]`).
- **`useState` type inference:** `useState(true)` infers `boolean` on its own; `useState([])`
  can't infer element type → needs the generic `useState<PasswordItem[]>([])`.
- **`===` vs `==`:** always use `===` (strict — compares type _and_ value, no hidden
  type coercion).
- **`PasswordItem` vs `PasswordItem[]`:** the interface describes ONE object; the `[]`
  suffix makes it an array of them. In JS the "array" IS what other languages call a "list".
- **Lifting a function out of `useEffect`:** `fetchPassword` moved to the component top level
  so both the effect (on mount) and `handleDelete` (refetch after mutate) can call it.
- **refetch-after-mutate:** `handleDelete` = `await delete(id)` then `await fetchPassword()`.
  Simple and always correct; costs one extra round-trip vs an optimistic update.
- **`onClick` trap:** must be `onClick={() => handleDelete(p.id)}` (a function to run _later_),
  NOT `onClick={handleDelete(p.id)}` (fires immediately on render — would delete everything).
- **Least-exposure security (recap):** `getAll()` returns metadata only, no password.
  Plaintext comes only from `getOne(id)`, at `data.decryptedPassword`.

### 🔌 How the delete flow works end-to-end (learned by reading both sides)

- **Frontend `delete(id)`:** template string `` `/passwords/${id}` `` → `DELETE` request;
  the request interceptor auto-attaches `Authorization: Bearer <token>`; returns `response.data`.
- **Backend `app.delete("/passwords/:id", authenticateToken, ...)`:**
  - `authenticateToken` verifies the JWT first (401 if missing, 403 if invalid), attaches `req.user`, then `next()`.
  - `req.params.id` reads the `:id` route param.
  - `DELETE FROM vault_items WHERE id = $1 AND user_id = $2` — parameterized (`$1/$2`) to
    stop SQL injection; the `AND user_id` clause is **authorization** (can only delete your own row).
  - `WHERE` only _selects which row_ — `DELETE` removes the **whole row**, not just those columns.
  - `result.rowCount === 0` → 404 (id not found, or not yours); else `res.json({ message })`.

### ✅ What I actually did (`Dashboard.tsx`)

- `loading` state → early return `<p>Loading...</p>` while fetching.
- Empty state → early return when `passwords.length === 0`.
- Lifted `fetchPassword` to the component top level; `useEffect` just calls it once.
- `handleDelete(id)` → `passwordAPI.delete(id)` then `fetchPassword()`.
- `handleView(id)` → `passwordAPI.getOne(id)` then `alert(data.decryptedPassword)`.
- Wired a real `<button>` for each (arrow-wrapped `onClick`); renamed setters to camelCase
  (`setPasswords`, `setLoading`).

### 📍 Where I am

Day 17b done. Dashboard now handles loading/empty/data and supports View + Delete per row.
(`alert` for View is intentional — gets prettied up on Day 21.)

### ⏭️ Next session

- **Day 19** — Axios: enhance the 401 branch in the response interceptor (`services/api.ts`)
  to clear the token (`authUtils.removeToken()`) and redirect to `/login`.
- Then **Day 20** (`Register.tsx`), **Day 21+** (Tailwind + design 21b–21f).
- **Startup:** postgres → backend (`:3000`) → frontend (`:5173`). Test login: `test@test.com` / `TestPassword123!`.

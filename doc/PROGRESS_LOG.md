# 📓 Progress Log — Index

One line per day. Click into the day file for full detail (issues faced · what I learned · what we did · next).
**At the start of a session, read this index, then open the latest day file to resume.**
After finishing a day, write a `doc/day-NN.md` file and add its one-line entry at the TOP here.

| Day | File | One-line summary |
|-----|------|------------------|
| 18 | [day-18.md](day-18.md) | Built `ProtectedRoute` wrapper (`children` prop + `<Navigate replace/>`) and wrapped the `/dashboard` route; logged-out users now redirect to `/login`. Browser-verified. Learned children/ReactNode, default-vs-named imports, and `replace` history behavior. |
| 17b | [day-17b.md](day-17b.md) | Dashboard polish: three-state pattern (`loading`/empty/data), lifted `fetchPassword`, added per-row **Delete** (refetch-after-mutate) + **View** (`getOne` → `alert(decryptedPassword)`); learned the full delete flow front-to-back (parameterized query + `user_id` authorization). |
| 17 (+18) | [day-17.md](day-17.md) | Built Dashboard data fetching (`useState`/`useEffect`/`passwordAPI.getAll`), added `/dashboard` route + `useNavigate`, fixed a CORS block with `app.use(cors())`; login now works end-to-end (verified in browser). |

<!-- Add new rows ABOVE this line, newest first. Template:
| NN | [day-NN.md](day-NN.md) | one sentence: what I built + the main thing I learned/fixed. |
-->

# AiO School Manager — React Native App

A complete React Native (Expo) rebuild covering every module in the
`index.html` web app's navigation: Home, Students, Attendance, Fees,
Exams, Staff, Academic Setup, Inventory & Assets, Library, School
Health, Comms, AiO ai, Account, Contact TransApple, Settings, and Trash.

## Structure

```
school-app/
├── App.js                        # Navigation: bottom tabs + "More" stack
├── screens/
│   ├── HomeScreen.js              # Dashboard + quick links to every module
│   ├── StudentsScreen.js
│   ├── AttendanceScreen.js
│   ├── FeesScreen.js
│   ├── MoreScreen.js              # Overflow menu — everything not on the tab bar
│   ├── ExamsScreen.js
│   ├── TeachersScreen.js          # "Staff" in the nav
│   ├── AcademicSetupScreen.js     # Classes, terms, subjects, exam types, grades, ID format
│   ├── InventoryScreen.js
│   ├── LibraryScreen.js
│   ├── SchoolHealthScreen.js      # Fees / attendance / performance rollup
│   ├── CommsScreen.js             # Messages, Meetings, Chat History tabs
│   ├── AioAiScreen.js             # Chat-style AI assistant screen
│   ├── AccountScreen.js           # My Account, Manage Accounts, Departments, Pending Registrations/Requests
│   ├── ContactScreen.js           # Contact TransApple support
│   ├── SettingsScreen.js          # School branding + links to Academic/Account/Trash
│   └── TrashScreen.js             # Restore / permanently delete
├── app.json
├── babel.config.js
└── package.json
```

Bottom tabs: **Home, Students, Attendance, Fees, More** — matching the
web app's `BOTTOMNAV_PRIMARY_IDS`. Everything else lives inside "More",
matching the full web `NAV` array.

## Getting started

```bash
npm install
npx expo start
```

Press `a` (Android), `i` (iOS, Mac only), or `w` (web), or scan the QR
code with Expo Go.

## What's real vs. mocked right now

Every module and screen from the web app's navigation exists here and
is fully interactive (add/edit/delete, tabs, modals, navigation between
screens) — but **all data is local, in-memory mock/seed data**, same
approach as the web app would use before connecting Supabase. Nothing
persists between app restarts yet, and there's no login/auth, no
multi-tenant school switching, and no offline sync — the web app's
`index.html` has all of that (Supabase schema + RPC functions, an
offline outbox/sync engine, subscription gating, a separate parent
portal), but replicating that backend safely requires your actual
Supabase project and careful testing, not something to guess at
blind.

## Recommended next steps, in order

1. **Backend**: stand up the Supabase schema (the SQL in your
   `index.html` — `create_account`, `verify_login`, `link_parent_child`,
   etc. — is a good starting point) and connect this app to it with
   `@supabase/supabase-js`.
2. **Shared data layer**: add a Context or React Query layer so Home,
   School Health, and every module read the same live data instead of
   separate local seed arrays.
3. **Auth**: login screen, PIN unlock, and role/department-based nav
   access (`hasNavAccess`, `deptAccess` in the web app).
4. **Offline support**: local cache + outbox sync if staff need to work
   without connectivity, mirroring the web app's IndexedDB-based queue.
5. **Parent portal**: a second navigation stack (children, fees,
   attendance, meetings, contact, settings) gated behind a parent
   login, once the staff-side data layer is solid.

Tell me which of these to tackle first and we'll build it out for real,
one piece at a time.

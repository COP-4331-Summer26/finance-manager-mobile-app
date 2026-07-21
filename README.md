# \# Finance Manager - Mobile App

# 

# React Native (Expo) mobile frontend for the COP4331 finance management project.

# 

# \## Features Implemented

# 

# \### Authentication

# \- Login and signup screens

# \- JWT-based auth flow with AsyncStorage persistence

# \- AuthContext for global auth state

# \- Change password

# 

# \### Navigation

# \- React Navigation setup (stack + tab navigation)

# \- Auth-gated routing (redirects based on login state)

# 

# \### Dashboard

# \- Overview screen showing balance summary

# \- Custom SVG donut chart for spending breakdown (fixed rendering math — see Bug Fixes)

# \- Auto-refresh on tab focus (no more app reset required to see updated balance)

# 

# \### Transactions

# \- View transaction list

# \- Add, edit, and delete transactions

# \- Category-based transaction organization

# \- Server-side search/filtering by category and sort order (real round-trip requests, not client-side filtering)

# 

# \### Categories

# \- Add, edit, and delete categories

# \- Color picker with fixed swatches instead of manual hex entry

# \- Monthly spending limit per category

# 

# \### Cards

# \- Add and delete linked cards

# 

# \### Profile

# \- User profile screen

# 

# \## Tech Stack

# \- React Native / Expo

# \- React Navigation

# \- AsyncStorage (auth persistence)

# \- Axios (API calls)

# \- Custom SVG components (charts)

# 

# \## Setup

# 

# 1\. Clone the repo and navigate into this folder

# 2\. `npm install`

# 3\. Create a `.env` file with your API base URL (see `.env.example` if present)

# 4\. `npx expo start`

# 

# \## Running on a Physical Device (Expo Go)

# 

# 1\. Install the \*\*Expo Go\*\* app from the App Store (iOS) or Google Play (Android) on your phone

# 2\. Make sure your phone and computer are on the same WiFi network

# 3\. Run `npx expo start` in this folder

# 4\. Scan the QR code shown in the terminal/browser with:

# &#x20;  - iOS: Camera app

# &#x20;  - Android: Expo Go app's built-in scanner

# 5\. The app should load on your phone within a few seconds

# 

# For a standalone installable build (no dev server required), use `npx eas-cli build --platform android --profile preview` for Android.

# 

# \## Bug Fixes — July 21, 2026 testing pass

# 

# \- \*\*Donut chart rendering\*\* — fixed incorrect `strokeDasharray`/`strokeDashoffset` math that caused broken arcs/gaps instead of a clean circle; added a background track ring so the chart always reads as a full circle.

# \- \*\*Category color picker\*\* — replaced manual hex entry with a fixed set of tappable color swatches.

# \- \*\*Add-category button placement\*\* — moved/resized for visibility across screens.

# \- \*\*Category color not saving on edit\*\* — root cause was the backend returning Mongo's `\_id` field while the app expected `id`; added normalization in the API layer.

# \- \*\*Category delete\*\* — did not exist at all (frontend or backend); added `deleteCategory` endpoint, route, and UI (with confirm prompt).

# \- \*\*Category delete freezing the app\*\* — caused by opening a confirmation modal on top of an already-open edit modal (React Native doesn't support stacked Modals); fixed by closing the edit sheet before opening the confirm dialog.

# \- \*\*Only 2 categories showing when adding a transaction\*\* — category list was fetched once on screen mount instead of refreshing when the tab is focused; fixed to refetch on focus.

# \- \*\*Transaction edit/delete not working\*\* — same `\_id`/`id` mismatch as categories; fixed via API normalization.

# \- \*\*Card delete\*\* — did not exist at all; added `deleteCard` endpoint, route, and long-press-to-delete UI.

# \- \*\*Balance/income not updating without a full app reset\*\* — fixed by refreshing dashboard data on tab focus instead of only on initial mount.

# \- \*\*Save button too narrow\*\* — widened for easier tapping.

# \- \*\*Keyboard covering form fields\*\* — forms now use a scrollable, keyboard-avoiding sheet with tap-to-dismiss.

# \- \*\*No visible error on invalid transaction submission\*\* — form now shows inline validation errors instead of silently doing nothing.

# \- \*\*Stuck in Add Transaction screen\*\* — added missing Save and Cancel/back actions.

# 

# \## Known Issues / In Progress

# \- Confirm no leftover keyboard-avoidance issues on the Add Income screen specifically

# \- Investigate a warning banner appearing at the bottom of one screen

# \- Backend not yet connected to the team's shared production MongoDB cluster (currently using a local/test cluster pending access)

# 

# \## Notes

# \- `.env` and `node\_modules` are gitignored — do not commit


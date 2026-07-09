# finance-manager-mobile-app

Finance Manager - Mobile App

React Native (Expo) mobile frontend for the COP4331 finance management project.

Features Implemented

Authentication


Login and signup screens
JWT-based auth flow with AsyncStorage persistence
AuthContext for global auth state


Navigation


React Navigation setup (stack + tab navigation)
Auth-gated routing (redirects based on login state)


Dashboard


Overview screen showing balance summary
Custom SVG donut chart for spending breakdown
Auto-refresh on tab focus


Transactions


View transaction list
Add income entries
Category-based transaction organization


Categories


Category loading and selection
Category-based filtering on transactions


Cards


Card management screen


Profile


User profile screen


Tech Stack


React Native / Expo
React Navigation
AsyncStorage (auth persistence)
Axios (API calls)
Custom SVG components (charts)


Setup


Clone the repo and navigate into this folder
npm install
Create a .env file with your API base URL (see .env.example if present)
npx expo start


Running on a Physical Device (Expo Go)


Install the Expo Go app from the App Store (iOS) or Google Play (Android) on your phone
Make sure your phone and computer are on the same WiFi network
Run npx expo start in this folder
Scan the QR code shown in the terminal/browser with:

iOS: Camera app
Android: Expo Go app's built-in scanner



The app should load on your phone within a few seconds


Notes


Backend API expected running separately (see finance-manager-web / backend repo)
.env and node_modules are gitignored — do not commit

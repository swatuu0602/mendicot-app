# 🃏 Mendikot Card Game

A **React Native** implementation of the classic **Mendikot** (Mindi Cot) card game with full **multiplayer support**, AI opponents, and beautiful UI animations.

---

## 🚀 Features

- ⚔️ Real-time multiplayer gameplay powered by **Supabase**
- 🧠 AI opponents with **adjustable difficulty**
- 🎨 Stunning UI built with **Styled Components** and **Reanimated**
- 🔁 Game state synchronization across players
- 📊 Score tracking and player statistics

---

## 🛠 Tech Stack

- **React Native** + **TypeScript**
- **Supabase** (Realtime WebSocket) for multiplayer backend
- **Styled Components** for UI styling
- **React Native Reanimated 3** for animations
- **Zustand** or **Jotai** for state management (planned)
- **MongoDB** as backend database

---
## 🗓️ Development Schedule (May 5 – May 9)

A timeline for building and completing the Mendikot card game app.

---

### ✅ **May 5: Project Setup & Core Structure**
- [x] Initialize React Native project using Expo
- [x] Set up Supabase project and obtain Realtime API keys
- [x] Create folder structure (`components`, `engine`, `hooks`, etc.)
- [x] Install dependencies:
  - Supabase JS client
  - Zustand or Jotai
  - React Native Reanimated
  - Styled Components
- [x] Configure `.env` file and Supabase client

---

### ✅ **May 6: Game Engine & State Management**
- [x] Implement card deck logic (shuffle, distribute, etc.)
- [x] Set up global game state using context or Zustand
- [x] Define TypeScript types (`Player`, `Card`, `Trick`, etc.)
- [x] Implement turn-based logic and trick resolution
- [x] Integrate Supabase Realtime for syncing game state

---

### ✅ **May 7: Multiplayer & UI Foundation**
- [x] Build the main game screen and layout
- [x] Implement lobby and game room creation
- [x] Sync player actions and turns via Supabase
- [x] Add UI for turn indicators and trick display
- [x] Use Reanimated to animate card movements

---

### 🔄 **May 8: AI Players, Scoring & Polish**
- [ ] Add basic AI logic for single-player and mixed games
- [ ] Implement score tracking and round history
- [ ] Handle special game rules (trump reveal, tens scoring)
- [ ] Improve UI with Styled Components
- [ ] Add animations for score updates and card actions

---

### 🧪 **May 9: Final Testing & Deployment**
- [ ] Full multiplayer gameplay testing (2–4 players)
- [ ] Debug and fix edge cases (disconnects, rule conflicts)
- [ ] Optimize for performance and responsiveness
- [ ] Finalize README and documentation
- [ ] Publish APK or submit to app stores (optional)

---

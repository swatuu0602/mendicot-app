# Mendikot (Mindi Cot) Digital Game Implementation Prompt

## 🎯 Core Objective
Develop an authentic digital adaptation of the traditional Indian card game Mendikot (Band Hukum mode) that:
- Supports 4 players in online multiplayer and offline vs AI modes
- Precisely replicates all original gameplay mechanics
- Delivers intuitive UI/UX with cultural authenticity
- Implements closed trump (Band Hukum) logic per specified rules

## 🎮 Game Specifications

### 🃏 Card System Requirements
- Standard 52-card deck (no jokers)
- Card ranking: A > K > Q > J > 10 > 9 > ... > 2
- Deal sequence: 
  - First 5 cards to each player
  - Then two batches of 4 cards (total 13 cards/player)
- Anticlockwise dealing direction

### 👥 Player Configuration
- 4 players forming 2 fixed teams (partners sit opposite)
- Team assignment persists throughout game session

### 🏆 Winning Conditions
**Primary Objective:** Capture majority of 10s
- Win round by capturing 3 or 4 tens
- Tiebreaker (2 tens each): Team with ≥7 tricks wins
- Special victories:
  - Mendikot: Capture all four 10s
  - Whitewash (52-card Mendikot): Win all 13 tricks

### ♠️ Band Hukum (Closed Trump) Mechanics
**Version (a) Implementation:**
1. Player to dealer's right places 1 card face down (trump suit)
2. Trump revealed ONLY when:
   - First player cannot follow suit
3. Post-reveal rules:
   - Trump suit becomes active immediately
   - Revealed card returns to owner's hand
   - Players may (but aren't required to) play trump cards

### 🔄 Game Flow Logic
- First trick led by player to dealer's right
- Must follow suit when possible
- Trick winner:
  - No trump: Highest card of led suit wins
  - Trump active: Highest trump card wins
- Winner leads next trick

### 🔄 Dealing Rotation Rules
- Dealer's team loses: Same dealer continues (except whitewash)
- Dealer's team wins: Deal passes right
- Whitewash loss: Dealer's partner deals next

## 💻 Technical Implementation Requirements

### 🖥️ UI/UX Components
1. **Visual Elements:**
   - Clear Band Hukum card placement area
   - Trump reveal animation/notification
   - Team score display (tens captured + trick count)
   - Turn indication system

2. **Game States:**
   - Pre-reveal (normal play)
   - Post-reveal (trump active)
   - End-round summary
   


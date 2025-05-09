# Mendikot (Band Hukum) Digital Game Technical Specification

## 🎮 Core Gameplay Architecture

### 🔄 Game State Machine
1. **Initialization Phase**
   - Player seating arrangement (fixed N-E-S-W positions)
   - Team assignment (N+S vs E+W)
   - First dealer randomization

2. **Dealing Phase**
   - Strict anticlockwise card distribution:
     ```python
     deal_sequence = [5 cards] + [4 cards] + [4 cards]
     ```
   - Visual dealing animation with card trajectory physics

3. **Band Hukum Placement**
   - Designated UI zone for face-down trump card
   - Forced wait state until placement confirmed
   - Visual indicator of remaining placement time

4. **Pre-Reveal Gameplay**
   - Modified trick-taking logic:
     - No trump suit awareness in card sorting
     - Disabled trump suit UI indicators

5. **Trump Revelation**
   - Trigger conditions:
     - Active player has no cards of led suit
     - AND has not previously seen trump
   - Animation sequence:
     1. Trump card flip (3D animation)
     2. Glow effect on trump suit indicator
     3. Sound effect (traditional damaru sound)

6. **Post-Reveal Gameplay**
   - Immediate UI updates:
     - Trump suit highlight on all cards
     - Revealed card returns to owner's hand
   - Modified rule enforcement:
     - Optional trump play allowed
     - Must follow suit if possible (trump ≠ suit)

## ♟️ Advanced Rule Logic

### 🃏 Card Comparison Matrix
| Situation          | Comparison Logic                          | Win Condition                     |
|--------------------|-------------------------------------------|-----------------------------------|
| No trump active    | Highest card of led suit                  | Standard trick rules              |
| Trump revealed     | Trump > Any non-trump                     | Highest trump wins                |
| Multiple trumps    | Highest trump value (Ace high)            | Standard ranking                 |
| Mendikot achieved  | Immediate round termination               | 4×10s captured                   |

### 🔢 Scoring System
```javascript
const scoreRules = {
  normalWin: {
    condition: "capturedTens >= 3",
    points: 1,
    dealTransition: "nextPlayer" 
  },
  tie: {
    condition: "tensCaptured == 2 && tricks >= 7",
    points: 1,
    dealTransition: "nextPlayer"
  },
  mendikot: {
    condition: "capturedTens == 4",
    points: 2,
    dealTransition: "nextPlayer",
    specialAnimation: true
  },
  whitewash: {
    condition: "tricks == 13",
    points: 3,
    dealTransition: "partnerDeals",
    fullAnimationSequence: true
  }
};
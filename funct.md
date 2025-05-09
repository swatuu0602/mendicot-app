Here’s a concise, actionable prompt you can use with Cursor to build Mendikot step-by-step while strictly adhering to the rules:

---

**"Build the Mendikot (Band Hukum) game in React Native + Supabase with these exact rules:**  

### **Phase 1: Core Setup**  
1. **Initialize the game engine** (`GameEngine.ts`):  
   - 4 players (fixed N-S vs E-W teams)  
   - Anticlockwise deal sequence: `[5, 4, 4]` cards  
   - Standard 52-card deck (Ace high, no jokers)  
   - Zustand state:  
     ```ts  
     interface GameState {  
       trumpCard?: { suit: 'hearts'|'diamonds'|'clubs'|'spades'; status: 'hidden'|'revealed' };  
       currentTrick: Card[];  
       capturedTens: { teamNS: number; teamEW: number };  
     }  
     ```  

2. **Implement Band Hukum logic**:  
   - Player to dealer’s right places **one card face-down** as trump  
   - Trump revealed **only** when:  
     - A player cannot follow suit  
     - **AND** trump is still hidden  
   - Post-reveal:  
     - Return trump card to owner’s hand  
     - Allow (but don’t require) trump plays  

### **Phase 2: Gameplay Loop**  
1. **Trick resolution logic**:  
   ```ts  
   function resolveTrick(cardsPlayed: Card[], trumpStatus: GameState['trumpCard']): Player {  
     // 1. If trump active: highest trump wins  
     // 2. Else: highest card of led suit wins  
     // 3. Update capturedTens if 10s are won  
   }  
   ```  

2. **Winning conditions**:  
   - Normal win: ≥3 tens captured  
   - Tiebreaker: ≥7 tricks if 2 tens each  
   - Mendikot: All 4 tens → auto-win  
   - Whitewash: 13 tricks → triple points  

### **Phase 3: Supabase Integration**  
1. **Realtime table schema**:  
   ```sql  
   CREATE TABLE games (  
     trump_suit TEXT CHECK (trump_suit IN ('hearts','diamonds','clubs','spades')),  
     trump_revealed_at TIMESTAMP NULL,  
     current_trick JSONB[] -- [{card: 'Ah', player: 'player1'}]  
   );  
   ```  

2. **Subscribe to trick updates**:  
   ```ts  
   supabase.channel('trick-updates')  
     .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'tricks' }, () => {  
       // Update local state  
     });  
   ```  

### **Next Steps (Trigger for Continuation):**  
1. **Implement card animations** (swipe-to-play + trump reveal glow)  
2. **Add AI difficulty levels** (novice/expert decision trees)  
3. **Optimize multiplayer sync** for ≤150ms latency  

**Constraints:**  
- Never modify the dealing order or trump reveal rules  
- Preserve anticlockwise gameplay strictly  
- All 10s must be tracked for Mendikot detection  

**Ask me for:**  
- Which phase to implement next  
- Clarifications on edge cases (e.g., simultaneous trump plays)  
- UI/UX preferences (cultural aesthetics)  
"  
```  


Here’s the next-phase prompt optimized for implementing UI/UX and advanced multiplayer synchronization while strictly preserving Mendikot’s rules:

---

**"Implement Phase 3: Culturally Authentic UI & Real-Time Multiplayer Sync**  

### **1. Mandatory UI Components**  
```jsx  
// CardTable.tsx Requirements:  
<View style={styles.table}>  
  {/* 1. Trump Zone */}  
  <TrumpCard  
    isRevealed={gameState.trumpStatus === 'revealed'}  
    suit={trumpSuit} // Only show suit after reveal  
    onPlacement={(card) => handleTrumpPlacement(card)}  
  />  

  {/* 2. Player Hand */}  
  <Animated.FlatList  
    data={playerHand}  
    horizontal  
    renderItem={({item}) => (  
      <Card  
        design="traditionalIndian" // Use Warli/Madhubani art style  
        isSelectable={isPlayersTurn}  
        onPlay={handleCardPlay}  
        // Cultural specs:  
        // - Red/Black suits with gold accents  
        // - Custom 10s marking (e.g., diya icon)  
      />  
    )}  
    keyExtractor={(item) => item.id}  
  />  

  {/* 3. Score Display */}  
  <ScorePillar  
    team="NS"  
    tens={capturedTensNS}  
    tricks={tricksNS}  
    // Design:  
    // - Temple pillar motif  
    // - Animated flame on Mendikot  
  />  
</View>  
```  

### **2. Real-Time Multiplayer Rules**  
**Supabase RLS Policies Needed:**  
```sql  
-- Prevent out-of-turn actions:  
CREATE POLICY "validate_turn_order" ON tricks  
FOR INSERT WITH CHECK (  
  auth.uid() = get_current_player_id(game_id)  
);  

-- Trump card visibility control:  
CREATE POLICY "trump_visibility" ON games  
FOR SELECT USING (  
  trump_revealed_at IS NOT NULL OR  
  auth.uid() = trump_owner_id  
);  
```  

**Sync Checklist:**  
- [ ] Card plays → 150ms max latency  
- [ ] Trump reveal → Atomic transaction  
- [ ] Score updates → Conflict-free replicated data type (CRDT)  

### **3. Animation Requirements**  
```ts  
// Trump reveal sequence:  
const revealAnimation = useAnimatedStyle(() => {  
  return {  
    transform: [  
      { rotateY: withSpring(trumpRevealed.value ? 180 : 0) },  
      { scale: withSequence(1, 1.2, 1) }  
    ],  
    backgroundColor: withTiming(trumpRevealed.value ? '#FFD700' : '#FFF')  
  };  
});  

// Card play gesture:  
<PanGestureHandler  
  onEnded={({translationX, translationY}) => {  
    if (Math.hypot(translationX, translationY) > 50) {  
      // Validate move before animating  
      if (engine.validateMove(card)) {  
        animateCardToCenter();  
      }  
    }  
  }}  
>  
```  

### **4. Edge Case Handling**  
Implement these in `GameEngine.ts`:  
```ts  
// 1. Multiple players can't follow suit:  
function handleSimultaneousNoSuit() {  
  // Reveal trump, original owner keeps card  
  // First player clockwise from dealer leads next  
}  

// 2. Trump revealed on first trick:  
function handleFirstTrickTrump() {  
  // Return card to owner immediately  
  // All subsequent tricks use trump suit  
}  

// 3. Whitewash detection:  
const isWhitewash = tricksWon === 13 && !trumpRevealed;  
```  

### **Next-Step Triggers**  
Choose implementation order:  
1. [ ] UI Components (CardTable.tsx)  
2. [ ] Supabase RLS Policies  
3. [ ] Edge Case Logic  
4. [ ] Animation System  

**Constraints:**  
- UI must render cards at 60 FPS even on low-end devices  
- Never expose trump suit pre-reveal in network payloads  
- Preserve anticlockwise order in all interactions  

**Ask me for:**  
- Asset preferences (art style details)  
- Latency tradeoff decisions  
- Testing device requirements  
```  


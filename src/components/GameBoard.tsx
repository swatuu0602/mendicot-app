import React, { useState } from 'react';
import { View, SafeAreaView, Modal, Text, Button } from 'react-native';
import styled from 'styled-components/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GameState, PlayerPosition, Card as CardType } from '../types/game';
import { useGame } from '../contexts/GameContext';
import Card from './Card';
import PlayerHand from './PlayerHand';
import OpponentHand from './OpponentHand';
import TrickArea from './TrickArea';
import TrumpCardArea from './TrumpCardArea';
import TeamScoreDisplay from './TeamScoreDisplay';
import TurnIndicator from './TurnIndicator';
import GameControls from './GameControls';
import GameMessage from './GameMessage';

const BoardContainer = styled(SafeAreaView)`
  flex: 1;
  background-color: #f0f0f0;
`;

const GameArea = styled.View`
  flex: 1;
  padding: 10px;
`;

const ScoreArea = styled.View`
  flex-direction: row;
  justify-content: space-between;
  padding: 10px;
  background-color: white;
  border-top-width: 1px;
  border-top-color: #ddd;
`;

const GameBoard: React.FC = () => {
  const { state: gameState, dispatch } = useGame();
  const insets = useSafeAreaInsets();
  const [showEndRoundSummary, setShowEndRoundSummary] = useState(false);
  const [selectedCard, setSelectedCard] = useState<CardType | undefined>();
  const [message, setMessage] = useState<{ text: string; type: 'info' | 'success' | 'error' | 'warning' } | undefined>();

  const currentPlayer = gameState.currentPlayer;
  const isCurrentPlayer = true; // TODO: Implement multiplayer logic

  const handleCardSelect = (card: CardType) => {
    setSelectedCard(card);
    dispatch({ type: 'PLAY_CARD', payload: card });
  };

  const handleNewGame = () => {
    dispatch({ type: 'NEW_GAME' });
    setMessage({ text: 'New game started!', type: 'info' });
  };

  const handleUndo = () => {
    dispatch({ type: 'UNDO' });
  };

  const handleHint = () => {
    dispatch({ type: 'GET_HINT' });
  };

  const handleDismissMessage = () => {
    setMessage(undefined);
  };

  const handleEndRound = () => {
    setShowEndRoundSummary(true);
  };

  const closeEndRoundSummary = () => {
    setShowEndRoundSummary(false);
  };

  const opponentHands = gameState.players.reduce((hands, player) => {
    if (player.position !== currentPlayer) {
      hands[player.position] = player.hand.length;
    }
    return hands;
  }, {} as Record<PlayerPosition, number>);

  const playerHand = gameState.players.find(player => player.position === currentPlayer)?.hand || [];

  return (
    <BoardContainer style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}>
      <GameArea>
        <TurnIndicator
          currentPlayer={currentPlayer}
          isCurrentPlayer={isCurrentPlayer}
        />
        <OpponentHand
          position="N"
          cardCount={opponentHands['N']}
        />
        <OpponentHand
          position="E"
          cardCount={opponentHands['E']}
        />
        <OpponentHand
          position="W"
          cardCount={opponentHands['W']}
        />
        <TrickArea
          cards={gameState.currentTrick.cards}
          leadingSuit={gameState.currentTrick.leader ? gameState.trumpSuit : null}
          trumpSuit={gameState.trumpSuit}
        />
        <TrumpCardArea
          trumpCard={gameState.trumpRevealed ? { suit: gameState.trumpSuit!, rank: 'A', status: 'revealed' } : undefined}
          onTrumpPlace={() => {}}
          isCurrentPlayer={isCurrentPlayer}
          canPlaceTrump={false}
        />
        <PlayerHand
          cards={playerHand}
          playableCards={gameState.playableCards}
          selectedCard={selectedCard}
          onCardSelect={handleCardSelect}
        />
      </GameArea>
      <ScoreArea>
        <TeamScoreDisplay
          team="NS"
          capturedTens={gameState.capturedTens.NS}
          tricksWon={gameState.tricksWon.NS}
          roundsWon={gameState.roundsWon.NS}
          isCurrentTeam={currentPlayer === 'N' || currentPlayer === 'S'}
        />
        <TeamScoreDisplay
          team="EW"
          capturedTens={gameState.capturedTens.EW}
          tricksWon={gameState.tricksWon.EW}
          roundsWon={gameState.roundsWon.EW}
          isCurrentTeam={currentPlayer === 'E' || currentPlayer === 'W'}
        />
      </ScoreArea>
      <GameControls
        onNewGame={handleNewGame}
        onUndo={handleUndo}
        onHint={handleHint}
        canUndo={gameState.status === 'playing'}
        canGetHint={isCurrentPlayer}
      />
      {message && (
        <GameMessage
          message={message.text}
          type={message.type}
          onDismiss={handleDismissMessage}
        />
      )}
      <Modal
        visible={showEndRoundSummary}
        transparent={true}
        animationType="slide"
        onRequestClose={closeEndRoundSummary}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <View style={{ width: 300, padding: 20, backgroundColor: 'white', borderRadius: 10 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>End of Round Summary</Text>
            <Text>NS Team: {gameState.capturedTens.NS} Tens, {gameState.tricksWon.NS} Tricks</Text>
            <Text>EW Team: {gameState.capturedTens.EW} Tens, {gameState.tricksWon.EW} Tricks</Text>
            <Button title="Close" onPress={closeEndRoundSummary} />
          </View>
        </View>
      </Modal>
    </BoardContainer>
  );
};

export default GameBoard; 
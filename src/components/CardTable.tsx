import React from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, Text, Image, ViewProps } from 'react-native';
import { useGameEngine } from '../hooks/useGameEngine';
import { Card } from '../engine/GameEngine';
import { Player } from '../types/Player';
import { 
  View as AnimatedView,
  useAnimatedStyle, 
  withSpring,
  useSharedValue,
  withTiming,
  AnimatedProps
} from 'react-native-reanimated';
import styled from 'styled-components/native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const CARD_WIDTH = 80;
const CARD_HEIGHT = 120;
const CARD_MARGIN = 10;

interface CardTableProps {
  onCardPress: ((card: Card) => void) | undefined;
  onPlayerPress: ((player: Player) => void) | undefined;
}

const TableContainer = styled.View`
  flex: 1;
  background-color: #2e7d32;
  position: relative;
`;

const AnimatedViewWrapper = styled(AnimatedView)`
  position: absolute;
`;

const PLAYER_POSITIONS = ['N', 'E', 'S', 'W'] as const;

export const CardTable: React.FC<CardTableProps> = ({ 
  onCardPress,
  onPlayerPress
}: CardTableProps) => {
  const { gameState, currentPlayer, playCard, drawCard, endTurn } = useGameEngine();
  const cardAnimations = React.useRef<{ [key: string]: ReturnType<typeof useSharedValue> }>({}).current;

  React.useEffect(() => {
    // Initialize animations for new cards
    PLAYER_POSITIONS.forEach(position => {
      gameState.hands[position].forEach((card: Card) => {
        if (!cardAnimations[card.id]) {
          cardAnimations[card.id] = useSharedValue(0);
        }
      });
    });
  }, [gameState.hands]);

  const getCardPosition = (index: number, totalCards: number) => {
    const startX = (SCREEN_WIDTH - (totalCards * (CARD_WIDTH + CARD_MARGIN))) / 2;
    return {
      x: startX + (index * (CARD_WIDTH + CARD_MARGIN)),
      y: SCREEN_HEIGHT - CARD_HEIGHT - 20
    };
  };

  const getPlayerPosition = (index: number) => {
    const angle = (index * (360 / PLAYER_POSITIONS.length)) * (Math.PI / 180);
    const radius = Math.min(SCREEN_WIDTH, SCREEN_HEIGHT) * 0.35;
    return {
      x: SCREEN_WIDTH / 2 + radius * Math.cos(angle),
      y: SCREEN_HEIGHT / 2 + radius * Math.sin(angle)
    };
  };

  const renderCard = (card: Card, index: number, totalCards: number) => {
    const position = getCardPosition(index, totalCards);
    const animatedStyle = useAnimatedStyle(() => ({
      transform: [
        { translateX: withSpring(position.x) },
        { translateY: withSpring(position.y) }
      ]
    }));

    return (
      <AnimatedViewWrapper
        key={card.id}
        style={[
          styles.card,
          {
            width: CARD_WIDTH,
            height: CARD_HEIGHT,
            position: 'absolute',
            left: 0,
            top: 0,
          },
          animatedStyle
        ]}
      >
        <TouchableOpacity
          style={styles.cardContent}
          onPress={() => onCardPress?.(card)}
          disabled={!onCardPress}
        >
          <Image
            source={{ uri: card.imageUrl }}
            style={styles.cardImage}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </AnimatedViewWrapper>
    );
  };

  const renderPlayer = (position: typeof PLAYER_POSITIONS[number], index: number) => {
    const position3D = getPlayerPosition(index);
    const animatedStyle = useAnimatedStyle(() => ({
      transform: [
        { translateX: withSpring(position3D.x) },
        { translateY: withSpring(position3D.y) }
      ]
    }));

    const player: Player = {
      id: position,
      name: position,
      hand: gameState.hands[position],
      score: 0,
      isCurrentPlayer: position === currentPlayer
    };

    return (
      <AnimatedViewWrapper
        key={position}
        style={[
          styles.player,
          {
            position: 'absolute',
            left: 0,
            top: 0,
          },
          animatedStyle
        ]}
      >
        <TouchableOpacity
          style={styles.playerContent}
          onPress={() => onPlayerPress?.(player)}
          disabled={!onPlayerPress}
        >
          <Text style={styles.playerName}>{player.name}</Text>
          <Text style={styles.playerScore}>Score: {player.score}</Text>
        </TouchableOpacity>
      </AnimatedViewWrapper>
    );
  };

  return (
    <View style={styles.container}>
      {PLAYER_POSITIONS.map((position, index) => renderPlayer(position, index))}
      {gameState.hands[currentPlayer].map((card: Card, index: number) => 
        renderCard(card, index, gameState.hands[currentPlayer].length)
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2c3e50',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardContent: {
    flex: 1,
    padding: 5,
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  player: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 10,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  playerContent: {
    alignItems: 'center',
  },
  playerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  playerScore: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 4,
  },
});

import * as React from 'react';
import { TouchableOpacity as RNTouchableOpacity, ViewStyle, View, Dimensions } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withTiming,
  withSequence,
  withSpring,
  useSharedValue,
} from 'react-native-reanimated';
import styled from 'styled-components/native';
import { Card } from '../types/game';

type TrumpCardStatus = 'hidden' | 'revealed' | 'revealing';

interface TrumpCard extends Card {
  status: TrumpCardStatus;
}

interface TrumpCardAreaProps {
  trumpCard?: TrumpCard;
  onTrumpPlace: (card: Card) => void;
  onTrumpReveal?: () => void;
  onTrumpReturn?: () => void;
  isCurrentPlayer: boolean;
  canPlaceTrump: boolean;
  canRevealTrump?: boolean;
}

const { width } = Dimensions.get('window');

const TouchableOpacity = styled(RNTouchableOpacity)``;

const TrumpArea = styled.View`
  position: relative;
  width: 120px;
  height: 180px;
  margin: 20px;
`;

const CardContainer = styled(Animated.View)`
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
`;

const CardFace = styled.View<{ isBack?: boolean }>`
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 10px;
  background-color: ${props => props.isBack ? '#2c3e50' : 'white'};
  align-items: center;
  justify-content: center;
  border-width: 1px;
  border-color: ${props => props.isBack ? '#34495e' : '#ddd'};
  elevation: 5;
`;

const CardText = styled.Text<{ isBack?: boolean }>`
  font-size: 24px;
  color: ${props => props.isBack ? 'white' : 'black'};
`;

const RevealButton = styled(TouchableOpacity)`
  position: absolute;
  bottom: -30px;
  left: 0;
  right: 0;
  padding: 5px;
  background-color: #e74c3c;
  border-radius: 5px;
  align-items: center;
`;

const RevealText = styled.Text`
  color: white;
  font-size: 12px;
  font-weight: bold;
`;

const TrumpCardArea = React.forwardRef<View, TrumpCardAreaProps>((props: TrumpCardAreaProps, ref: React.Ref<View>) => {
  const { 
    trumpCard, 
    onTrumpPlace, 
    onTrumpReveal,
    onTrumpReturn,
    isCurrentPlayer, 
    canPlaceTrump,
    canRevealTrump 
  } = props;

  const rotation = useSharedValue(0);
  const scale = useSharedValue(1);
  const translateY = useSharedValue(0);

  const handleCardClick = (card: Card) => {
    if (isCurrentPlayer && canPlaceTrump) {
      scale.value = withSequence(
        withSpring(1.2),
        withSpring(1)
      );
      onTrumpPlace(card);
    }
  };

  const handleTrumpReveal = () => {
    if (canRevealTrump && onTrumpReveal) {
      rotation.value = withSequence(
        withTiming(90),
        withTiming(180)
      );
      setTimeout(onTrumpReveal, 600);
    }
  };

  const handleTrumpReturn = () => {
    if (trumpCard?.status === 'revealed' && onTrumpReturn) {
      translateY.value = withSequence(
        withSpring(-100),
        withSpring(0)
      );
      setTimeout(onTrumpReturn, 500);
    }
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scale.value },
        { translateY: translateY.value },
        { rotateY: `${rotation.value}deg` }
      ]
    } as unknown as ViewStyle;
  });

  return (
    <TrumpArea ref={ref}>
      {trumpCard ? (
        <>
          <CardContainer style={animatedStyle}>
            <CardFace isBack={trumpCard.status === 'hidden'}>
              <CardText isBack={trumpCard.status === 'hidden'}>
                {trumpCard.status === 'hidden' ? '?' : trumpCard.suit}
              </CardText>
            </CardFace>
          </CardContainer>
          {canRevealTrump && trumpCard.status === 'hidden' && (
            <RevealButton onPress={handleTrumpReveal}>
              <RevealText>Reveal Trump</RevealText>
            </RevealButton>
          )}
          {trumpCard.status === 'revealed' && (
            <RevealButton onPress={handleTrumpReturn}>
              <RevealText>Return to Hand</RevealText>
            </RevealButton>
          )}
        </>
      ) : (
        <TouchableOpacity
          onPress={() => handleCardClick({ suit: 'hearts', rank: 'A' })}
          disabled={!isCurrentPlayer || !canPlaceTrump}
        >
          <CardFace isBack>
            <CardText isBack>Place Trump</CardText>
          </CardFace>
        </TouchableOpacity>
      )}
    </TrumpArea>
  );
});

TrumpCardArea.displayName = 'TrumpCardArea';

export default TrumpCardArea; 
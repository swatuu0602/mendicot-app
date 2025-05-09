import React from 'react';
import { TouchableOpacity, ViewStyle } from 'react-native';
import styled from 'styled-components/native';
import { Card as CardType, Suit } from '../types/game';

interface CardProps {
  card: CardType;
  isPlayable?: boolean;
  isSelected?: boolean;
  onClick?: () => void;
  style?: ViewStyle;
}

const CardContainer = styled(TouchableOpacity)<{ isPlayable: boolean; isSelected: boolean }>`
  width: 80px;
  height: 120px;
  border-radius: 8px;
  background-color: white;
  border-width: 2px;
  border-color: ${props => props.isSelected ? '#2196f3' : '#ddd'};
  opacity: ${props => props.isPlayable ? 1 : 0.7};
  elevation: ${props => props.isSelected ? 8 : 2};
  transform: ${props => props.isSelected ? 'translateY(-10px)' : 'none'};
`;

const CardContent = styled.View`
  flex: 1;
  padding: 5px;
  justify-content: space-between;
`;

const CardCorner = styled.View`
  align-items: center;
`;

const CardValue = styled.Text<{ suit: Suit }>`
  font-size: 16px;
  font-weight: bold;
  color: ${props => props.suit === 'hearts' || props.suit === 'diamonds' ? '#f44336' : '#000'};
`;

const CardSuit = styled.Text<{ suit: Suit }>`
  font-size: 20px;
  color: ${props => props.suit === 'hearts' || props.suit === 'diamonds' ? '#f44336' : '#000'};
`;

const CardCenter = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const Card: React.FC<CardProps> = ({
  card,
  isPlayable = true,
  isSelected = false,
  onClick,
  style
}) => {
  const { suit, rank } = card;

  return (
    <CardContainer
      isPlayable={isPlayable}
      isSelected={isSelected}
      onPress={isPlayable ? onClick : undefined}
      style={style}
    >
      <CardContent>
        <CardCorner>
          <CardValue suit={suit}>{rank}</CardValue>
          <CardSuit suit={suit}>{suit}</CardSuit>
        </CardCorner>
        <CardCenter>
          <CardSuit suit={suit}>{suit}</CardSuit>
        </CardCenter>
        <CardCorner style={{ transform: [{ rotate: '180deg' }] }}>
          <CardValue suit={suit}>{rank}</CardValue>
          <CardSuit suit={suit}>{suit}</CardSuit>
        </CardCorner>
      </CardContent>
    </CardContainer>
  );
};

export default Card; 
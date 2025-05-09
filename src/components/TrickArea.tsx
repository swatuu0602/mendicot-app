import React from 'react';
import { View } from 'react-native';
import styled from 'styled-components/native';
import { Card as CardType, PlayerPosition } from '../types/game';
import Card from './Card';

interface TrickAreaProps {
  cards: Partial<Record<PlayerPosition, CardType>>;
  leadingSuit?: string;
  trumpSuit?: string;
}

const TrickContainer = styled.View`
  width: 300px;
  height: 300px;
  position: relative;
  margin: 20px auto;
`;

const CardPosition = styled.View<{ position: PlayerPosition }>`
  position: absolute;
  ${props => {
    switch (props.position) {
      case 'N':
        return 'top: 0; left: 50%; transform: translateX(-50%);';
      case 'E':
        return 'right: 0; top: 50%; transform: translateY(-50%);';
      case 'S':
        return 'bottom: 0; left: 50%; transform: translateX(-50%);';
      case 'W':
        return 'left: 0; top: 50%; transform: translateY(-50%);';
    }
  }}
`;

const TrickArea: React.FC<TrickAreaProps> = ({
  cards,
  leadingSuit,
  trumpSuit
}) => {
  const positions: PlayerPosition[] = ['N', 'E', 'S', 'W'];

  return (
    <TrickContainer>
      {positions.map(position => {
        const card = cards[position];
        if (!card) return null;

        const isLeading = card.suit === leadingSuit;
        const isTrump = card.suit === trumpSuit;

        return (
          <CardPosition key={position} position={position}>
            <Card
              card={card}
              style={{
                transform: [
                  { rotate: position === 'E' ? '90deg' : position === 'W' ? '-90deg' : '0deg' }
                ]
              }}
            />
          </CardPosition>
        );
      })}
    </TrickContainer>
  );
};

export default TrickArea; 
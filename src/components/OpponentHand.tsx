import React from 'react';
import { View } from 'react-native';
import styled from 'styled-components/native';
import { PlayerPosition } from '../types/game';

interface OpponentHandProps {
  position: PlayerPosition;
  cardCount: number;
}

const HandContainer = styled.View<{ position: PlayerPosition }>`
  position: absolute;
  ${props => {
    switch (props.position) {
      case 'N':
        return 'top: 20px; left: 50%; transform: translateX(-50%);';
      case 'E':
        return 'right: 20px; top: 50%; transform: translateY(-50%);';
      case 'W':
        return 'left: 20px; top: 50%; transform: translateY(-50%);';
      default:
        return '';
    }
  }}
`;

const CardsContainer = styled.View<{ position: PlayerPosition }>`
  flex-direction: ${props => props.position === 'E' || props.position === 'W' ? 'column' : 'row'};
  gap: 2px;
`;

const CardBack = styled.View<{ position: PlayerPosition }>`
  width: 40px;
  height: 60px;
  background-color: #2196f3;
  border-radius: 4px;
  border-width: 1px;
  border-color: #1976d2;
  transform: ${props => {
    if (props.position === 'E') return 'rotate(90deg)';
    if (props.position === 'W') return 'rotate(-90deg)';
    return 'none';
  }};
`;

const CardCount = styled.Text`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-weight: bold;
  font-size: 12px;
`;

const OpponentHand: React.FC<OpponentHandProps> = ({ position, cardCount }) => {
  return (
    <HandContainer position={position}>
      <CardsContainer position={position}>
        {Array.from({ length: cardCount }).map((_, index) => (
          <CardBack key={index} position={position}>
            <CardCount>{cardCount}</CardCount>
          </CardBack>
        ))}
      </CardsContainer>
    </HandContainer>
  );
};

export default OpponentHand; 
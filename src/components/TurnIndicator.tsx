import React from 'react';
import { View } from 'react-native';
import styled from 'styled-components/native';
import { PlayerPosition } from '../types/game';

interface TurnIndicatorProps {
  currentPlayer: PlayerPosition;
  isCurrentPlayer: boolean;
}

const IndicatorContainer = styled.View`
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(0, 0, 0, 0.8);
  padding: 10px 20px;
  border-radius: 20px;
  flex-direction: row;
  align-items: center;
  gap: 10px;
  z-index: 1000;
`;

const PlayerDot = styled.View<{ isActive: boolean }>`
  width: 12px;
  height: 12px;
  border-radius: 6px;
  background-color: ${props => props.isActive ? '#4caf50' : '#666'};
`;

const PlayerLabel = styled.Text<{ isActive: boolean }>`
  color: ${props => props.isActive ? '#4caf50' : 'white'};
  font-weight: ${props => props.isActive ? 'bold' : 'normal'};
`;

const TurnIndicator: React.FC<TurnIndicatorProps> = ({
  currentPlayer,
  isCurrentPlayer
}) => {
  const positions: PlayerPosition[] = ['N', 'E', 'S', 'W'];
  
  return (
    <IndicatorContainer>
      {positions.map((position) => (
        <React.Fragment key={position}>
          <PlayerDot isActive={position === currentPlayer} />
          <PlayerLabel isActive={position === currentPlayer}>
            {position} {position === currentPlayer && isCurrentPlayer ? '(Your Turn)' : ''}
          </PlayerLabel>
        </React.Fragment>
      ))}
    </IndicatorContainer>
  );
};

export default TurnIndicator; 
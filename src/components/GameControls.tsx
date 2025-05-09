import React from 'react';
import { View } from 'react-native';
import styled from 'styled-components/native';

interface GameControlsProps {
  onNewGame: () => void;
  onUndo: () => void;
  onHint: () => void;
  canUndo: boolean;
  canGetHint: boolean;
}

const ControlsContainer = styled.View`
  flex-direction: row;
  justify-content: center;
  gap: 10px;
  padding: 10px;
  background-color: #f5f5f5;
  border-top-width: 1px;
  border-top-color: #ddd;
`;

const ControlButton = styled.TouchableOpacity<{ disabled?: boolean }>`
  padding: 10px 20px;
  border-radius: 5px;
  background-color: ${props => props.disabled ? '#ccc' : '#2196f3'};
  opacity: ${props => props.disabled ? 0.7 : 1};
`;

const ButtonText = styled.Text`
  color: white;
  font-weight: bold;
  text-align: center;
`;

const GameControls: React.FC<GameControlsProps> = ({
  onNewGame,
  onUndo,
  onHint,
  canUndo,
  canGetHint
}) => {
  return (
    <ControlsContainer>
      <ControlButton onPress={onNewGame}>
        <ButtonText>New Game</ButtonText>
      </ControlButton>
      <ControlButton onPress={onUndo} disabled={!canUndo}>
        <ButtonText>Undo</ButtonText>
      </ControlButton>
      <ControlButton onPress={onHint} disabled={!canGetHint}>
        <ButtonText>Hint</ButtonText>
      </ControlButton>
    </ControlsContainer>
  );
};

export default GameControls; 
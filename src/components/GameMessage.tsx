import React from 'react';
import { TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';

type MessageType = 'info' | 'success' | 'error' | 'warning';

interface GameMessageProps {
  message: string;
  type: MessageType;
  onDismiss?: () => void;
}

const MessageContainer = styled.View<{ type: MessageType }>`
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  padding: 15px 25px;
  border-radius: 8px;
  background-color: ${props => {
    switch (props.type) {
      case 'success':
        return '#4caf50';
      case 'error':
        return '#f44336';
      case 'warning':
        return '#ff9800';
      default:
        return '#2196f3';
    }
  }};
  flex-direction: row;
  align-items: center;
  gap: 10px;
  z-index: 1000;
  min-width: 200px;
  max-width: 80%;
`;

const MessageText = styled.Text`
  color: white;
  font-size: 16px;
  flex: 1;
  text-align: center;
`;

const DismissButton = styled(TouchableOpacity)`
  padding: 5px;
`;

const DismissText = styled.Text`
  color: white;
  font-size: 20px;
  font-weight: bold;
`;

const GameMessage: React.FC<GameMessageProps> = ({
  message,
  type,
  onDismiss
}) => {
  return (
    <MessageContainer type={type}>
      <MessageText>{message}</MessageText>
      {onDismiss && (
        <DismissButton onPress={onDismiss}>
          <DismissText>×</DismissText>
        </DismissButton>
      )}
    </MessageContainer>
  );
};

export default GameMessage; 
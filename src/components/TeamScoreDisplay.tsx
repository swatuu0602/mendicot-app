import React from 'react';
import { View } from 'react-native';
import styled from 'styled-components/native';
import { Team } from '../types/game';

interface TeamScoreDisplayProps {
  team: Team;
  capturedTens: number;
  tricksWon: number;
  roundsWon: number;
  isCurrentTeam: boolean;
}

const ScoreContainer = styled.View<{ isCurrentTeam: boolean }>`
  padding: 15px;
  border-radius: 8px;
  background-color: ${props => props.isCurrentTeam ? '#e3f2fd' : '#f5f5f5'};
  margin: 10px;
  border-width: 2px;
  border-color: ${props => props.isCurrentTeam ? '#2196f3' : 'transparent'};
`;

const TeamName = styled.Text`
  margin-bottom: 10px;
  color: #333;
  font-size: 18px;
  font-weight: bold;
`;

const ScoreGrid = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

const ScoreItem = styled.View`
  align-items: center;
`;

const ScoreLabel = styled.Text`
  font-size: 12px;
  color: #666;
  margin-bottom: 4px;
`;

const ScoreValue = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: #2196f3;
`;

const TeamScoreDisplay: React.FC<TeamScoreDisplayProps> = ({
  team,
  capturedTens,
  tricksWon,
  roundsWon,
  isCurrentTeam
}) => {
  return (
    <ScoreContainer isCurrentTeam={isCurrentTeam}>
      <TeamName>Team {team}</TeamName>
      <ScoreGrid>
        <ScoreItem>
          <ScoreLabel>Tens Captured</ScoreLabel>
          <ScoreValue>{capturedTens}</ScoreValue>
        </ScoreItem>
        <ScoreItem>
          <ScoreLabel>Tricks Won</ScoreLabel>
          <ScoreValue>{tricksWon}</ScoreValue>
        </ScoreItem>
        <ScoreItem>
          <ScoreLabel>Rounds Won</ScoreLabel>
          <ScoreValue>{roundsWon}</ScoreValue>
        </ScoreItem>
      </ScoreGrid>
    </ScoreContainer>
  );
};

export default TeamScoreDisplay; 
import React from 'react';
import { View, ScrollView } from 'react-native';
import styled from 'styled-components/native';
import { Card as CardType } from '../types/game';
import Card from './Card';

interface PlayerHandProps {
  cards: CardType[];
  playableCards: CardType[];
  selectedCard?: CardType;
  onCardSelect: (card: CardType) => void;
}

const HandContainer = styled.View`
  padding: 10px;
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 10px;
`;

const CardsContainer = styled(ScrollView)`
  flex-direction: row;
  padding: 10px;
`;

const CardWrapper = styled.View`
  margin-right: -40px;
`;

const PlayerHand: React.FC<PlayerHandProps> = ({
  cards,
  playableCards,
  selectedCard,
  onCardSelect
}) => {
  return (
    <HandContainer>
      <CardsContainer horizontal showsHorizontalScrollIndicator={false}>
        {cards.map((card, index) => (
          <CardWrapper key={`${card.suit}-${card.value}`}>
            <Card
              card={card}
              isPlayable={playableCards.some(
                c => c.suit === card.suit && c.value === card.value
              )}
              isSelected={
                selectedCard?.suit === card.suit &&
                selectedCard?.value === card.value
              }
              onClick={() => onCardSelect(card)}
              style={{ zIndex: cards.length - index }}
            />
          </CardWrapper>
        ))}
      </CardsContainer>
    </HandContainer>
  );
};

export default PlayerHand; 
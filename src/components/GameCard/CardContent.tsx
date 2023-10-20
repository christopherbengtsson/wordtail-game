import { styled } from 'styled-components';
import { Avatar, Body, BodyBold, Subtitle } from '..';
import { getUniqueUserAvatar } from '../../utils';
import { getCardSubtitle } from './utils';
import { GameListItem } from '../../services';

export interface CardContentProps {
  game: GameListItem;
  userId: string;
}

export function CardContent({ game, userId }: CardContentProps) {
  return (
    <FlexContainer>
      <Avatar lazyLoad src={getUniqueUserAvatar(game.currentTurnProfileId)} />
      {game.status === 'pending' ? (
        <PendingContent game={game} userId={userId} />
      ) : game.playerStatus === 'out' ? (
        <Body>{`You're out`}</Body>
      ) : (
        <Subtitle>{getCardSubtitle(game, userId)}</Subtitle>
      )}
    </FlexContainer>
  );
}

const PendingContent = ({ game, userId }: CardContentProps) => {
  if (game.creatorProfileId === userId) {
    return <Body>Your newly created game</Body>;
  }

  return (
    <Body>
      <BodyBold>{game.creatorUsername}</BodyBold> wants to start a game
    </Body>
  );
};

const FlexContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${(p) => p.theme.spacing.xs};
`;

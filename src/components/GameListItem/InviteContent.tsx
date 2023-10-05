import { styled } from 'styled-components';
import { TGameListItem } from '../../services';
import { Button, Subtitle } from '..';
import { getCardSubtitle } from './utils';

export const InviteContent = ({
  game,
  userId,
  onClick,
}: {
  game: TGameListItem;
  userId: string;
  onClick: (p: boolean) => void;
}) => {
  return (
    <SpaceAroundContainer>
      {game.waitingForUsers.includes(userId) ? (
        <>
          <Button onClick={() => onClick(true)}>Accept</Button>
          <Button onClick={() => onClick(false)}>Decline</Button>
        </>
      ) : (
        <Subtitle>{getCardSubtitle(game, userId)}</Subtitle>
      )}
    </SpaceAroundContainer>
  );
};

const SpaceAroundContainer = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  z-index: 1;
`;

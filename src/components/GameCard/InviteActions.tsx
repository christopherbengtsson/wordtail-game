import { styled } from 'styled-components';
import { Button, Subtitle } from '..';
import { getCardSubtitle } from './utils';
import { TGameListItem } from '../../services';

export interface InviteActionsProps {
  game: TGameListItem;
  userId: string;
  handleInvite: (accept: boolean) => void;
}
export function InviteActions({
  game,
  userId,
  handleInvite,
}: InviteActionsProps) {
  return (
    <SpaceAroundContainer>
      {game.waitingForUsers.includes(userId) ? (
        <>
          <Button colorVariant="success" onClick={() => handleInvite(true)}>
            Accept
          </Button>
          <Button colorVariant="error" onClick={() => handleInvite(false)}>
            Decline
          </Button>
        </>
      ) : (
        <Subtitle>{getCardSubtitle(game, userId)}</Subtitle>
      )}
    </SpaceAroundContainer>
  );
}

const SpaceAroundContainer = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  z-index: 1;
`;

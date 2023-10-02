import { Avatar, Button, Card } from 'antd';
import { styled } from 'styled-components';
import type { TGameListItem, TGameStatus } from '../../services';
import { UseMutationResult } from '@tanstack/react-query';
import { PostgrestSingleResponse } from '@supabase/supabase-js';

const handleCardSubtitle = (game: TGameListItem, userId: string) => {
  if (game.status === 'active') {
    if (game.currentTurnProfileId === userId) {
      return 'Your turn';
    }
    return `Waiting for ${game.currentTurnUsername ?? 'next player'}`;
  } else if (game.status === 'pending') {
    return 'Waiting for players to accept';
  } else if (game.status === 'abandoned') {
    return 'Not enough users accepted';
  }

  return `${game.winnerUsername ?? 'Anonymous'} won`;
};
export function GameListItem({
  game,
  userId,
  handleGameInvitation,
  handleOnClick,
}: {
  game: TGameListItem;
  userId: string;
  handleOnClick: (game: TGameListItem) => void;
  handleGameInvitation: UseMutationResult<
    PostgrestSingleResponse<TGameStatus>,
    unknown,
    {
      gameId: string;
      accept: boolean;
    },
    unknown
  >;
}) {
  return (
    <StyledCard
      hoverable
      title={game.waitingForUsers?.includes(userId) && 'New invitation!'}
      onClick={() => handleOnClick(game)}
      extra={
        game.waitingForUsers?.includes(userId) && (
          <>
            <Button
              type="primary"
              onClick={() =>
                handleGameInvitation.mutate({
                  gameId: game.id,
                  accept: true,
                })
              }
            >
              Accept
            </Button>
            <Button
              type="link"
              onClick={() =>
                handleGameInvitation.mutate({
                  gameId: game.id,
                  accept: false,
                })
              }
            >
              Decline
            </Button>
          </>
        )
      }
    >
      <Card.Meta
        avatar={
          <Avatar src="https://xsgames.co/randomusers/avatar.php?g=pixel&key=1" />
        }
        title={game.name ?? 'Nameless game'}
        description={handleCardSubtitle(game, userId)}
      />
    </StyledCard>
  );
}

const StyledCard = styled(Card)`
  width: 100%;
`;

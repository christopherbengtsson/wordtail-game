import { styled } from 'styled-components';
import type { TGameListItem, TGameStatus } from '../../services';
import { UseMutationResult } from '@tanstack/react-query';
import { PostgrestSingleResponse } from '@supabase/supabase-js';

function InviteButtons(game: TGameListItem, userId: string) {
  return (
    game.waitingForUsers?.includes(userId) && (
      <>
        <button
          onClick={() =>
            handleGameInvitation.mutate({
              gameId: game.id,
              accept: true,
            })
          }
        >
          Accept
        </button>
        <button
          onClick={() =>
            handleGameInvitation.mutate({
              gameId: game.id,
              accept: false,
            })
          }
        >
          Decline
        </button>
      </>
    )
  );
}

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
    <StyledDivContainer
      status={game.status}
    >
      <OnClickListener
        role="button"
        tabIndex={0}
        onClick={() => handleOnClick(game)}
      />

      <h2>{game.name ?? 'Nameless game'}</h2>
      <h4>{game.waitingForUsers?.includes(userId) && 'New invitation!'}</h4>
      <StyledImg src="https://xsgames.co/randomusers/avatar.php?g=pixel&key=1" />
      <h6>{handleCardSubtitle(game, userId)}</h6>
      <p>{game.updatedAt}</p>
    </StyledDivContainer>
  );
}

const StyledDivContainer = styled.div<{ status: TGameStatus }>`
  position: relative;
  width: 100%;

  padding: 8px 16px;

  ${(p) => {
    const status = p.status;

    switch (status) {
      case 'active':
        return {
          background: p.theme.colors.secondary,
          color: p.theme.colors.highlight,
        };

      case 'pending':
      case 'abandoned':
      case 'finished':
        return {
          background: p.theme.colors.gray,
          color: p.theme.colors.textColor,
        };
    }
  }}

  margin-bottom: 24px;

  :hover {
    cursor: pointer;
  }

  border-style: solid;
  border-width: 2px;
  border-color: rgb(254, 254, 254) rgb(132, 133, 132) rgb(132, 133, 132)
    rgb(254, 254, 254);

  &:focus,
  &:active {
    border-style: solid;
    border-width: 2px;
    border-color: rgb(132, 133, 132) rgb(254, 254, 254) rgb(254, 254, 254)
      rgb(132, 133, 132);
  }
`;

const OnClickListener = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
`;

const StyledImg = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
`;

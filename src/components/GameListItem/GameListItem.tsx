import { styled } from 'styled-components';
import type { TGameListItem, TGameStatus } from '../../services';
import { UseMutationResult } from '@tanstack/react-query';
import { PostgrestSingleResponse } from '@supabase/supabase-js';
import { formatDistanceToNow } from 'date-fns';
import { Caption, PrimaryTitleWrapper, Subtitle } from '..';
import { getUniqueUserAvatar } from '../../utils';

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

const getCardTitle = (game: TGameListItem, userId: string) => {
  if (game.status === 'pending' && game.waitingForUsers.includes(userId)) {
    return 'New invitation!';
  }

  return game.name;
};

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
  handleOnClick,
  handleGameInvitation,
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
  const onKeyDown = (event: React.KeyboardEvent, game: TGameListItem) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleOnClick(game);
    }
  };

  return (
    <StyledDivContainer
      id={game.id}
      status={game.status}
      role="button"
      tabIndex={0}
      onClick={() => handleOnClick(game)}
      onKeyDown={(ev) => onKeyDown(ev, game)}
    >
      <PrimaryTitleWrapper>{getCardTitle(game, userId)}</PrimaryTitleWrapper>

      <StyledImg src={getUniqueUserAvatar(game.currentTurnProfileId)} />
      <Subtitle>{handleCardSubtitle(game, userId)}</Subtitle>
      <Caption>
        last updated {formatDistanceToNow(new Date(game.updatedAt))} ago
      </Caption>
    </StyledDivContainer>
  );
}

const StyledDivContainer = styled.div<{ status: TGameStatus }>`
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: ${(p) => p.theme.spacing.xs};
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

  border-style: solid;
  border-width: 2px;
  border-color: rgb(254, 254, 254) rgb(132, 133, 132) rgb(132, 133, 132)
    rgb(254, 254, 254);

  &:after {
    content: '';
    position: absolute;
    display: block;
    top: 0px;
    left: 0px;
    height: 100%;
    width: 100%;
  }

  &:hover {
    cursor: pointer;

    > * {
      text-decoration: underline;
    }
  }

  &:active {
    border-style: solid;
    border-width: 2px;
    border-color: rgb(132, 133, 132) rgb(254, 254, 254) rgb(254, 254, 254)
      rgb(132, 133, 132);
  }

  &:focus {
    &:after {
      outline: rgb(10, 10, 10) dotted 2px;
      outline-offset: -4px;
    }
  }
`;

const StyledImg = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
`;

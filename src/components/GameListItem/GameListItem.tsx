import { styled } from 'styled-components';
import type { TGameListItem, TGameStatus } from '../../services';
import { UseMutationResult } from '@tanstack/react-query';
import { PostgrestSingleResponse } from '@supabase/supabase-js';
import { formatDistanceToNow } from 'date-fns';
import { Avatar, Caption, PrimaryTitleWrapper, Subtitle } from '..';
import { getUniqueUserAvatar } from '../../utils';
import { InviteContent } from './InviteContent';
import { getCardTitle, getCardSubtitle } from './utils';

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

  const handleInvite = (accept: boolean) => {
    handleGameInvitation.mutate({ accept, gameId: game.id });
  };

  return (
    <StyledDivContainer
      id={game.id}
      status={game.status}
      role="button"
      tabIndex={0}
      onClick={() => game.status !== 'pending' && handleOnClick(game)}
      onKeyDown={(ev) => onKeyDown(ev, game)}
    >
      <PrimaryTitleWrapper>{getCardTitle(game, userId)}</PrimaryTitleWrapper>

      {game.status === 'pending' ? (
        <InviteContent onClick={handleInvite} game={game} userId={userId} />
      ) : (
        <>
          <Avatar
            lazyLoad
            src={getUniqueUserAvatar(game.currentTurnProfileId)}
          />
          <Subtitle>{getCardSubtitle(game, userId)}</Subtitle>
        </>
      )}
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
  padding: ${(p) => p.theme.spacing.s} ${(p) => p.theme.spacing.m};

  ${(p) => {
    const status = p.status;

    switch (status) {
      case 'active':
        return {
          background: p.theme.desktopBackground,
          color: p.theme.materialText,
        };

      case 'pending':
      case 'abandoned':
      case 'finished':
        return {
          background: p.theme.material,
          color: p.theme.materialText,
        };
    }
  }}

  margin-bottom: ${(p) => p.theme.spacing.m};

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

  ${(p) =>
    p.status !== 'pending' &&
    ` 
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
  }`}
`;

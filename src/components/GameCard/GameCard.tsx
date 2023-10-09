import { styled } from 'styled-components';
import type { TGameListItem, TGameStatus } from '../../services';
import { UseMutationResult } from '@tanstack/react-query';
import { PostgrestSingleResponse } from '@supabase/supabase-js';
import { SecondaryTitle } from '..';
import { getCardTitle } from './utils';
import {
  createBorderStyles,
  focusOutline,
  CommonThemeProps,
} from '../shared/common';
import { CardContent } from './CardContent';
import { InviteActions } from './InviteActions';
import { CardFooter } from './CardFooter';

export interface GameListItemProps {
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
}

export function GameListItem({
  game,
  userId,
  handleOnClick,
  handleGameInvitation,
}: GameListItemProps) {
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
    <li>
      <StyledListDiv
        id={game.id}
        status={game.status}
        role="button"
        tabIndex={0}
        // TODO: Should be clickable on pending but not on invite
        onClick={() => game.status !== 'pending' && handleOnClick(game)}
        onKeyDown={(ev) => onKeyDown(ev, game)}
      >
        <SecondaryTitle>{getCardTitle(game, userId)}</SecondaryTitle>
        <CardContent game={game} userId={userId} />
        {game.status === 'pending' && (
          <InviteActions
            game={game}
            userId={userId}
            handleInvite={handleInvite}
          />
        )}
        <CardFooter game={game} />
      </StyledListDiv>
    </li>
  );
}

const StyledListDiv = styled.div<CommonThemeProps & { status: TGameStatus }>`
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: ${(p) => p.theme.spacing.xs};
  padding: ${(p) => p.theme.spacing.s};

  ${(p) => {
    const status = p.status;

    switch (status) {
      case 'active':
        return {
          background: p.theme.desktopBackground,
          color: p.theme.materialTextInvert,
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

  ${createBorderStyles({ style: 'button' })}

  &:after {
    content: '';
    position: absolute;
    display: block;
    top: 0px;
    left: 0px;
    height: 100%;
    width: 100%;
  }

  &:active {
    ${(p) =>
      p.status !== 'pending' && createBorderStyles({ style: 'buttonPressed' })}
  }

  &:focus {
    &:after {
      ${(p) => p.status !== 'pending' && focusOutline}
    }
  }

  &:hover {
    ${(p) =>
      p.status !== 'pending' &&
      `
      cursor: pointer;

      > * {
        text-decoration: underline;
      }
    `}
`;

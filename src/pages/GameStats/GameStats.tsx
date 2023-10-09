import { useQuery } from '@tanstack/react-query';
import { observer } from 'mobx-react';
import { useParams } from 'react-router-dom';
import { useMainStore } from '../../stores';
import {
  Body,
  CenterContainer,
  PrimaryTitleWrapper,
  Subtitle,
} from '../../components';
import { useDelayedVisible } from '../../hooks';
import { formatDistanceToNow } from 'date-fns';

/**
 * TODOS:
 * Handle Active games
 *  User clicks from Landing page
 *  User gets redirected from Game by making a move
 * Handle Pending games
 * Handle Finished games
 */
export const GameStats = observer(function GameStats() {
  const { gameId } = useParams();
  const { gameStore } = useMainStore();

  const {
    data: gameResponse,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['game', gameId],
    queryFn: () => gameStore.getGameById(gameId),
  });

  const shouldShowLoading = useDelayedVisible(isLoading, true);

  if (shouldShowLoading) {
    return (
      <CenterContainer>
        <PrimaryTitleWrapper>Loading game stats...</PrimaryTitleWrapper>
      </CenterContainer>
    );
  }

  if (isError) {
    <CenterContainer>
      <PrimaryTitleWrapper>Something went wrong</PrimaryTitleWrapper>
      <Body color="error">
        {gameResponse?.error?.message ?? 'Unknown error'}
      </Body>
    </CenterContainer>;
  }

  if (gameResponse?.data) {
    const game = gameResponse.data;
    return (
      <CenterContainer>
        <PrimaryTitleWrapper>{game.name}</PrimaryTitleWrapper>
        <Subtitle>{game.status}</Subtitle>
        <Body>
          Last updated {formatDistanceToNow(new Date(game.updatedAt))}
        </Body>
      </CenterContainer>
    );
  }
});

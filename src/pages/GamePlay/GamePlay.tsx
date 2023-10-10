import { useQuery } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { useMainStore } from '../../stores';
import { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import { Play } from './Play';
import {
  Body,
  Button,
  CenterContainer,
  PrimaryTitleWrapper,
  Subtitle,
} from '../../components';
import { useDelayedVisible } from '../../hooks';
import { TActiveGame } from '../../services';
import { numberToWord } from '../../utils';

const getReadyToPlayBody = (game: TActiveGame): string => {
  const lastMove = game.previousMoveType;

  if (
    lastMove === 'add_letter' ||
    (!game.previousPlayerId && !game.previousMoveType)
  ) {
    const numberOfLetters = game.lettersSoFar.length;

    return numberOfLetters
      ? `${numberToWord(numberOfLetters)} letter${
          numberOfLetters > 1 ? 's' : ''
        } has placed so far`
      : "You're starting this round!";
  }

  if (lastMove === 'call_bluff') {
    return `${game.previousPlayerUsername} thinks you're bluffing! Prepare to come clean`;
  }

  return 'TODO: No yet implemented';
};

export const GamePlay = observer(function GamePlay() {
  // unstable_usePrompt({
  //   when: true,
  //   message: 'TODO: unstable_useBlocker with custom dialog?',
  // });
  const { gameId } = useParams();
  const navigate = useNavigate();
  const { gameStore } = useMainStore();

  const [start, setStart] = useState(false);

  const {
    data: response,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['game', gameId],
    queryFn: () => gameStore.getActiveGameById(gameId),
    enabled: !!gameId,
  });

  const shouldShowLoading = useDelayedVisible(isLoading, true);

  useEffect(() => {
    if (!gameId) {
      navigate('/', { replace: true });
    }
  }, [gameId, navigate]);

  if (shouldShowLoading) {
    return (
      <CenterContainer>
        <PrimaryTitleWrapper>Loading game...</PrimaryTitleWrapper>
      </CenterContainer>
    );
  }

  if (isError) {
    <CenterContainer>
      <PrimaryTitleWrapper>Something went wrong</PrimaryTitleWrapper>
      <Body color="error">{response?.error?.message ?? 'Unknown error'}</Body>
    </CenterContainer>;
  }

  if (!start && response?.data) {
    return (
      <CenterContainer>
        <PrimaryTitleWrapper>
          Round {response.data.currentRoundNumber}
        </PrimaryTitleWrapper>
        <Subtitle>{getReadyToPlayBody(response.data)}</Subtitle>
        <Button
          primary
          size="lg"
          disabled={isLoading}
          onClick={() => setStart(true)}
        >{`I'm ready, let's go`}</Button>
      </CenterContainer>
    );
  }

  if (start && gameId && response?.data) {
    return (
      <CenterContainer>
        <Play gameId={gameId} game={response.data} />
      </CenterContainer>
    );
  }
});

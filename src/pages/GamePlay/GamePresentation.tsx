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
  TranslationMap,
  useTranslation,
} from '../../components';
import { useDelayedVisible } from '../../hooks';
import { ActiveGame } from '../../services';
import { numberToWord } from '../../utils';
import { RevealBluff } from './RevealBluff';

const STRINGS = {
  firstRound: 'game.presentation.body.first.round',
  multiLettersPlaced: 'game.presentation.body.letters',
  oneLetterPlaced: 'game.presentation.body.letter',
  calledBluff: 'game.presentation.body.bluff',
  loading: 'game.presentation.loading',
  error: 'general.error',
  readyToPlay: 'game.presentation.cta',
} satisfies TranslationMap;

export const GamePresentation = observer(function GamePresentation() {
  // unstable_usePrompt({
  //   when: true,
  //   message: 'TODO: unstable_useBlocker with custom dialog?',
  // });
  const t = useTranslation();
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

  const getReadyToPlayBody = (game: ActiveGame): string => {
    const lastMove = game.previousMoveType;

    // Starting player of a new round
    if (!game.previousPlayerId) {
      return t(STRINGS.firstRound);
    }

    if (game.previousMoveType === 'add_letter') {
      const numberOfLetters = game.lettersSoFar.length;

      if (numberOfLetters > 1) {
        return t(STRINGS.multiLettersPlaced, {
          values: [numberToWord(numberOfLetters)],
        });
      }

      return t(STRINGS.oneLetterPlaced);
    }

    if (lastMove === 'call_bluff') {
      return t(STRINGS.calledBluff, {
        values: [game.previousPlayerUsername],
      });
    }

    // We should not reach this far. If latest game move is 'claim_finished_word' or reveal_bluff,
    // new rounds should have been initiated.
    throw new Error(
      'Function `getReadyToPlayBody` could not predict text presentation',
    );
  };

  if (shouldShowLoading) {
    return (
      <CenterContainer>
        <PrimaryTitleWrapper>{t(STRINGS.loading)}</PrimaryTitleWrapper>
      </CenterContainer>
    );
  }

  if (isError) {
    <CenterContainer>
      <PrimaryTitleWrapper>Something went wrong</PrimaryTitleWrapper>
      <Body color="error">{response?.error?.message ?? t(STRINGS.error)}</Body>
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
        >
          {t(STRINGS.readyToPlay)}
        </Button>
      </CenterContainer>
    );
  }

  if (start && gameId && response?.data) {
    return (
      <CenterContainer>
        {response.data.previousMoveType === 'call_bluff' ? (
          <RevealBluff
            gameId={gameId}
            letters={response.data.lettersSoFar.join('')}
          />
        ) : (
          <Play gameId={gameId} game={response.data} />
        )}
      </CenterContainer>
    );
  }
});

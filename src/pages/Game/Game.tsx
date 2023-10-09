import { useQuery } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { useMainStore } from '../../stores';
import { useEffect, useState } from 'react';
import { styled } from 'styled-components';
import { observer } from 'mobx-react';
import { Play } from './Play';
import { Body, Button, PrimaryTitleWrapper, Subtitle } from '../../components';
import { useDelayedVisible } from '../../hooks';
import { TActiveGame } from '../../services';

const getReadyToPlayBody = (game: TActiveGame) => {
  if (game.lettersSoFar.length) {
    return `${game.lettersSoFar.length} are placed so far`;
  }

  return "You're starting this round!";
};

export const Game = observer(function Game() {
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
    queryFn: () => gameStore.getGameById(gameId),
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
      <StyledContainer>
        <PrimaryTitleWrapper>Loading game...</PrimaryTitleWrapper>
      </StyledContainer>
    );
  }

  if (isError) {
    <StyledContainer>
      <PrimaryTitleWrapper>Something went wrong</PrimaryTitleWrapper>
      <Body color="error">{response?.error?.message ?? 'Unknown error'}</Body>
    </StyledContainer>;
  }

  if (!start && response?.data) {
    return (
      <StyledContainer>
        <FlexContainer>
          <PrimaryTitleWrapper>
            Round {response.data.currentRoundNumber}
          </PrimaryTitleWrapper>
          <Subtitle>{getReadyToPlayBody(response.data)}</Subtitle>
          <Button
            primary
            size="lg"
            onClick={() => setStart(true)}
          >{`I'm ready, let's go`}</Button>
        </FlexContainer>
      </StyledContainer>
    );
  }

  if (start && gameId && response?.data) {
    return (
      <StyledContainer>
        <Play gameId={gameId} game={response.data} />
      </StyledContainer>
    );
  }
});

const StyledContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1 1 auto;
`;

const FlexContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${(p) => p.theme.spacing.m};
`;

import { useQuery } from '@tanstack/react-query';
import { useMainStore } from '../../stores';
import {
  Body,
  BodyBold,
  CenterContainer,
  PrimaryTitleWrapper,
} from '../../components';
import { useDelayedVisible } from '../../hooks';

import { CommonStatsProps } from '.';
import { Standings } from './Standings';

export function ExtendedStats({ gameId }: CommonStatsProps) {
  const { gameStore } = useMainStore();

  const {
    data: gameResponse,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['gameStats', gameId],
    queryFn: () => gameStore.getGameStatsById(gameId),
  });

  const shouldShowLoading = useDelayedVisible(isLoading, true);

  if (shouldShowLoading) {
    return (
      <CenterContainer>
        <PrimaryTitleWrapper>Hämtar speldata...</PrimaryTitleWrapper>
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
        <PrimaryTitleWrapper>
          {game.moveType === 'add_letter'
            ? `Du la bokstaven "${game.letter}"`
            : `TODO: ${game.moveType}`}
        </PrimaryTitleWrapper>

        <Body>
          Nu är det
          <BodyBold>{` ${game.currentPlayerUsername}`}</BodyBold>{`'s tur`}
        </Body>

        <Standings game={game} />
      </CenterContainer>
    );
  }
}

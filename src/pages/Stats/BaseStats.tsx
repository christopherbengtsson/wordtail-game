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

export function BaseStats({ gameId }: CommonStatsProps) {
  const { gameStore } = useMainStore();

  const {
    data: gameResponse,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['gameBaseStats', gameId],
    queryFn: () => gameStore.getBaseGameStatsById(gameId),
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
        <Body>
          Väntar på
          <BodyBold>{` ${game.currentPlayerUsername}`}</BodyBold>
        </Body>

        <Standings game={game} />
      </CenterContainer>
    );
  }
}

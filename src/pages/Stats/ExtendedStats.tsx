import { useQuery } from '@tanstack/react-query';
import { useMainStore } from '../../stores';
import {
  Avatar,
  Body,
  BodyBold,
  CenterContainer,
  List,
  PrimaryTitleWrapper,
} from '../../components';
import { useDelayedVisible } from '../../hooks';
import { styled } from 'styled-components';
import { getUniqueUserAvatar } from '../../utils';
import { CommonStatsProps } from '.';

export interface Standing {
  marks: number;
  playerId: string;
  username: string;
}
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
    console.log(game);
    return (
      <CenterContainer>
        <PrimaryTitleWrapper>
          {game.moveType === 'add_letter'
            ? `Du la bokstaven "${game.letter}"`
            : `TODO: ${game.moveType}`}
        </PrimaryTitleWrapper>

        <Body>
          Nu är det
          <BodyBold>{` ${game.currentPlayerUsername}`}</BodyBold>s tur
        </Body>

        <FlexStartContainer>
          <BodyBold>Prickar:</BodyBold>
          <List
            items={
              game.standings as {
                marks: number;
                playerId: string;
                username: string;
              }[]
            }
            render={(standing: Standing) => (
              <StyledListItem key={standing.playerId}>
                <Avatar lazyLoad src={getUniqueUserAvatar(standing.playerId)} />
                <Body>
                  {standing.username}: <BodyBold>{standing.marks}</BodyBold>
                </Body>
              </StyledListItem>
            )}
          />
        </FlexStartContainer>
      </CenterContainer>
    );
  }
}

const StyledListItem = styled.li`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: ${(p) => p.theme.spacing.s};
`;

const FlexStartContainer = styled.div`
  gap: ${(p) => p.theme.spacing.s};
`;

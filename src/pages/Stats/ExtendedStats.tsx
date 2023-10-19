import { useQuery } from '@tanstack/react-query';
import { useMainStore } from '../../stores';
import {
  Body,
  BodyBold,
  Caption,
  CenterContainer,
  PrimaryTitleWrapper,
  Tree,
} from '../../components';
import { useDelayedVisible } from '../../hooks';
import { CommonStatsProps } from '.';
import { Standings } from './Standings';
import { TMoveType } from '../../services';
import { distanceToNow } from '../../utils';

export interface GameRound {
  roundNumber: number;
  moves: {
    playerId: string;
    username: string;
    moveType: TMoveType;
    createdAt: string;
    letter?: string;
    word?: string;
  }[];
}

export function ExtendedStats({ gameId }: CommonStatsProps) {
  const { gameStore, authStore } = useMainStore();

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
    console.log(game);
    const gameRounds = game.rounds as unknown as GameRound[];

    return (
      <CenterContainer>
        <PrimaryTitleWrapper>
          {game.moveType === 'add_letter'
            ? `Du la bokstaven "${game.letter}"`
            : `TODO: ${game.moveType}`}
        </PrimaryTitleWrapper>

        <Body>
          Nu är det
          <BodyBold>{` ${game.currentPlayerUsername}`}</BodyBold>
          {`'s tur`}
        </Body>

        <Standings game={game} />

        {gameRounds.length && (
          <Tree
            title="Rundor"
            items={gameRounds.map(({ moves, roundNumber }) => ({
              id: `round-${roundNumber}`,
              label: `Runda ${roundNumber}`,
              expandable: true,
              items: moves.map((move) => ({
                id: move.playerId,
                label: (
                  <>
                    {move.playerId === authStore.userId ? 'Du' : move.username},
                    <Caption>
                      {' '}
                      {distanceToNow(move.createdAt, {
                        addSuffix: true,
                      })}
                    </Caption>
                  </>
                ),
                expandable: true,
                items: [
                  {
                    id: `move-${move.createdAt}`,
                    label: `${
                      move.moveType === 'add_letter'
                        ? `La bokstav ${move.letter}`
                        : move.moveType === 'call_bluff'
                        ? 'Synade bluff'
                        : move.moveType === 'claim_finished_word'
                        ? 'Synade färdigt ord'
                        : move.moveType === 'give_up'
                        ? 'Gav upp'
                        : move.moveType === 'reveal_bluff'
                        ? 'Besvarade bluff'
                        : ''
                    }`,
                  },
                ],
              })),
            }))}
          />
        )}
      </CenterContainer>
    );
  }
}

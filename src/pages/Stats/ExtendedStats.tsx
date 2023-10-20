import { useQuery } from '@tanstack/react-query';
import { useMainStore } from '../../stores';
import {
  Body,
  BodyBold,
  Caption,
  CenterContainer,
  PrimaryTitleWrapper,
  Tree,
  TreeItem,
} from '../../components';
import { useDelayedVisible } from '../../hooks';
import { CommonStatsProps } from '.';
import { Standings } from './Standings';
import { ExtendedGameStats, MoveType } from '../../services';
import { distanceToNow } from '../../utils';
import { SAOL_WEBSITE_URL } from '../../Constants';

export interface GameRound {
  roundNumber: number;
  moves: {
    playerId: string;
    username: string;
    moveType: MoveType;
    createdAt: string;
    letter?: string;
    word?: string;
  }[];
}

const getStatsTitle = (stats: ExtendedGameStats) => {
  let title = '';

  switch (stats.moveType) {
    case 'add_letter':
      title = `Du la bokstaven "${stats.letter}"`;
      break;

    case 'give_up':
      title = 'Du gav upp denn runda';
      break;

    case 'call_bluff':
      title = 'Du synade bluff';
      break;

    case 'reveal_bluff':
      title = 'Du besvarade synad bluff';
      break;

    case 'claim_finished_word':
      title = 'Du synade färdigt ord';
      break;
  }

  return <PrimaryTitleWrapper>{title}</PrimaryTitleWrapper>;
};

const getStatsBody = (stats: ExtendedGameStats) => {
  // TODO
  if (stats.gameStatus === 'active') {
    return (
      <Body>
        Nu är det
        <BodyBold>{` ${stats.currentPlayerUsername}`}</BodyBold>
        {`'s tur`}
      </Body>
    );
  }

  if (stats.gameStatus === 'finished') {
    return <Body>Spelet avslutad</Body>;
  }

  if (stats.roundStatus === 'finished') {
    return <Body>Runda avslutad</Body>;
  }
};

const getMoveLabel = (move: GameRound['moves'][0]) => {
  switch (move.moveType) {
    case 'add_letter':
      return (
        <>
          La bokstav <BodyBold>{move.letter}</BodyBold>
        </>
      );

    case 'call_bluff':
      return `Synade bluff`;

    case 'claim_finished_word':
      return `Synade färdigt ord`;

    case 'give_up':
      return `Gav upp`;

    case 'reveal_bluff':
      return `Besvarade bluff`;

    default:
      return '';
  }
};

const getMoveDetails = (move: GameRound['moves'][0]) => {
  const label = getMoveLabel(move);

  const treeItem: TreeItem = {
    id: `move-${move.createdAt}`,
    label,
  };

  if (
    move.moveType === 'claim_finished_word' ||
    move.moveType === 'reveal_bluff'
  ) {
    treeItem.expandable = true;
    treeItem.items = [
      {
        id: `word-${move.createdAt}`,
        label: move.word,
      },
      {
        id: `saol-link-${move.createdAt}`,
        label: (
          <a
            href={`${SAOL_WEBSITE_URL}${move.word}`}
            rel="noreferrer"
            target="_blank"
          >
            SAOL länk
          </a>
        ),
      },
    ];
  }

  return treeItem;
};

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
        {getStatsTitle(game)}

        {getStatsBody(game)}

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
                    ...getMoveDetails(move),
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

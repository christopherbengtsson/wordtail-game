import { useMainStore } from '../../stores';
import { observer } from 'mobx-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { GameListItem } from '../../services';
import {
  Button,
  GameCard,
  List,
  PrimaryTitleWrapper,
  Tabs,
  useTranslation,
} from '../../components';
import { styled } from 'styled-components';
import { TabBody } from 'react95';
import { useMemo, useState } from 'react';
import { useNavigateParams } from '../../hooks';

export const Landing = observer(function Landing() {
  const t = useTranslation();
  const { gameStore, authStore, modalStore } = useMainStore();
  const navigate = useNavigateParams();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState(0);

  const { data: gamesResponse } = useQuery({
    queryKey: ['games'],
    queryFn: () => gameStore.fetchGames(),
    staleTime: 10 * 60 * 1000, // 10 minutes in milliseconds
  });

  const {
    activeGames,
    pendingGames,
    finishedGames,
    numberOfInvites,
    numberOfWaitingTurns,
  } = useMemo(() => {
    const activeGames = gameStore.sortActiveGames(gamesResponse?.data ?? []);
    const pendingGames = gameStore.sortPendingGames(gamesResponse?.data ?? []);
    const finishedGames = gameStore.sortFinishedGames(
      gamesResponse?.data ?? [],
    );
    const numberOfInvites = gameStore.getNumberOfInvites(pendingGames);
    const numberOfWaitingTurns = gameStore.getNumberOfWaitingTurns(activeGames);

    return {
      activeGames,
      pendingGames,
      finishedGames,
      numberOfInvites,
      numberOfWaitingTurns,
    };
  }, [gameStore, gamesResponse?.data]);

  const handleInvitationMutation = useMutation({
    mutationFn: (params: { gameId: string; accept: boolean }) =>
      gameStore.handleGameInvitation(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['games'] });
    },
  });

  const handleCreateNewGame = () => {
    modalStore.setCreateGameModalVisible(true);
  };

  const handleGoToGame = (game: GameListItem) => {
    const gameIsActive = game.status === 'active';
    const isUsersTurn = game.currentTurnProfileId === authStore.userId;

    if (isUsersTurn && gameIsActive) {
      return navigate(`games/${game.id}`, {});
    }

    const statsType = gameIsActive
      ? 'active'
      : game.status === 'pending'
      ? 'pending'
      : 'finished';

    navigate(`games/${game.id}/stats`, {
      statsType,
      playerStatus: game.playerStatus,
    });
  };

  const handleTabChange = (
    value: number,
    _event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    setActiveTab(value);
  };

  return (
    <Container>
      <PrimaryTitleWrapper className="visuallyHidden">
        {t('games.header')}
      </PrimaryTitleWrapper>

      <Button colorVariant="info" size="lg" onClick={handleCreateNewGame}>
        {t('games.cta.create')}
      </Button>

      <div>
        <Tabs
          activeTab={activeTab}
          handleTabChange={handleTabChange}
          tabs={[
            { label: t('games.tabs.active'), badge: numberOfWaitingTurns },
            { label: t('games.tabs.pending'), badge: numberOfInvites },
            { label: t('games.tabs.finished') },
          ]}
        />

        <TabBody>
          {activeTab === 0 && (
            <List
              emptyText={t('games.list.active.empty')}
              items={activeGames}
              render={(game: GameListItem) => (
                <GameCard
                  key={game.id}
                  game={game}
                  userId={authStore.userId}
                  handleOnClick={handleGoToGame}
                />
              )}
            />
          )}
          {activeTab === 1 && (
            <List
              emptyText={t('games.list.pending.empty')}
              items={pendingGames}
              render={(game: GameListItem) => (
                <GameCard
                  key={game.id}
                  game={game}
                  userId={authStore.userId}
                  handleGameInvitation={handleInvitationMutation}
                />
              )}
            />
          )}
          {activeTab === 2 && (
            <List
              emptyText={t('games.list.finished.empty')}
              items={finishedGames}
              render={(game: GameListItem) => (
                <GameCard
                  key={game.id}
                  game={game}
                  userId={authStore.userId}
                  // TODO: handleOnClick={handleGoToGame}
                />
              )}
            />
          )}
        </TabBody>
      </div>
    </Container>
  );
});

const Container = styled.div`
  display: grid;
  gap: ${(p) => p.theme.spacing.m};
`;

import { useMainStore } from '../../stores';
import { observer } from 'mobx-react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { TGameListItem } from '../../services';
import { Button, GameListItem, List, Tabs } from '../../components';
import { styled } from 'styled-components';
import { TabBody } from 'react95';
import { useState } from 'react';

export const Landing = observer(function Landing() {
  const { gameStore, authStore, modalStore } = useMainStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState(0);

  const { data: response } = useQuery({
    queryKey: ['games'],
    queryFn: () => gameStore.fetchGames(),
    staleTime: 10 * 60 * 1000, // 10 minutes in milliseconds
  });

  const activeGames = response?.data?.filter(
    (game) =>
      game.status === 'active' ||
      (game.status === 'pending' &&
        !game.waitingForUsers.includes(authStore.userId ?? '')),
  );
  const invites = response?.data?.filter(
    (game) =>
      game.status === 'pending' &&
      game.waitingForUsers.includes(authStore.userId ?? ''),
  );

  const history = response?.data?.filter(
    (game) => game.status === 'abandoned' || game.status === 'finished',
  );

  const createGameMutation = useMutation({
    mutationFn: (params: { name: string; players: string[] }) =>
      gameStore.createGame(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['games'] });
    },
  });

  const handleInvitationMutation = useMutation({
    mutationFn: (params: { gameId: string; accept: boolean }) =>
      gameStore.handleGameInvitation(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['games'] });
    },
  });

  const handleCreateNewGame = () => {
    // TODO: Mock for now, just to test stored procedure
    // createGameMutation.mutate({
    //   name: 'Hard Coded Game',
    //   players: ['33da3a39-80e5-4dff-a8e2-d95a3cb768e7'],
    // });

    modalStore.setCreateGameModalVisible(true);
  };

  const handleGoToGame = (game: TGameListItem) => {
    const gameIsActive = game.status === 'active';
    const isUsersTurn = game.currentTurnProfileId === authStore.userId;

    if (!isUsersTurn || !gameIsActive) {
      // Go to game stats
      console.log('Not implemented: Game stats page');
      return;
    }

    navigate(`/games/${game.id}`);
  };

  const handleTabChange = (
    value: number,
    _event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    setActiveTab(value);
  };

  return (
    <Container>
      <Button
        primary
        size="lg"
        onClick={handleCreateNewGame}
        disabled={createGameMutation.isLoading}
      >
        CREATE NEW GAME
      </Button>

      <div>
        <Tabs
          activeTab={activeTab}
          handleTabChange={handleTabChange}
          tabs={[
            { label: 'Active' },
            { label: 'Invites', badge: invites?.length },
            { label: 'History' },
          ]}
        />

        <TabBody>
          {activeTab === 0 && (
            <List
              emptyText="You have no active games, why not create one?"
              items={activeGames}
              render={(game: TGameListItem) => (
                <GameListItem
                  key={game.id}
                  game={game}
                  userId={authStore.userId ?? ''}
                  handleGameInvitation={handleInvitationMutation}
                  handleOnClick={handleGoToGame}
                />
              )}
            />
          )}
          {activeTab === 1 && (
            <List
              emptyText="No new invites"
              items={invites}
              render={(game: TGameListItem) => (
                <GameListItem
                  key={game.id}
                  game={game}
                  userId={authStore.userId ?? ''}
                  handleGameInvitation={handleInvitationMutation}
                  handleOnClick={handleGoToGame}
                />
              )}
            />
          )}
          {activeTab === 2 && (
            <List
              emptyText="No game history"
              items={history}
              render={(game: TGameListItem) => (
                <GameListItem
                  key={game.id}
                  game={game}
                  userId={authStore.userId ?? ''}
                  handleGameInvitation={handleInvitationMutation}
                  handleOnClick={handleGoToGame}
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

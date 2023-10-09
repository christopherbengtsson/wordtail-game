import { useMainStore } from '../../stores';
import { observer } from 'mobx-react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { TGameListItem } from '../../services';
import {
  Button,
  GameListItem,
  List,
  PrimaryTitleWrapper,
  Tabs,
} from '../../components';
import { styled } from 'styled-components';
import { TabBody } from 'react95';
import { useMemo, useState } from 'react';

export const Landing = observer(function Landing() {
  const { gameStore, authStore, modalStore } = useMainStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState(0);

  const { data: gamesResponse } = useQuery({
    queryKey: ['games'],
    queryFn: () => gameStore.fetchGames(),
    staleTime: 10 * 60 * 1000, // 10 minutes in milliseconds
  });

  const { activeGames, pendingGames, finishedGames, numberOfInvites } =
    useMemo(() => {
      const activeGames = gameStore.sortActiveGames(gamesResponse?.data ?? []);
      const pendingGames = gameStore.sortPendingGames(
        gamesResponse?.data ?? [],
      );
      const finishedGames = gameStore.sortFinishedGames(
        gamesResponse?.data ?? [],
      );
      const numberOfInvites = gameStore.getNumberOfInvites(pendingGames);

      return { activeGames, pendingGames, finishedGames, numberOfInvites };
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

  const handleGoToGame = (game: TGameListItem) => {
    const gameIsActive = game.status === 'active';
    const isUsersTurn = game.currentTurnProfileId === authStore.userId;

    if (!isUsersTurn && !gameIsActive) {
      navigate(`games/${game.id}/stats`);
    }

    navigate(`games/${game.id}`);
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
        Games page
      </PrimaryTitleWrapper>

      <Button primary size="lg" onClick={handleCreateNewGame}>
        CREATE NEW GAME
      </Button>

      <div>
        <Tabs
          activeTab={activeTab}
          handleTabChange={handleTabChange}
          tabs={[
            { label: 'Active' },
            { label: 'Pending', badge: numberOfInvites },
            { label: 'Finished' },
          ]}
        />

        <TabBody>
          {activeTab === 0 && (
            <List
              emptyText="You have no active games yet, why not create one?"
              items={activeGames}
              render={(game: TGameListItem) => (
                <GameListItem
                  key={game.id}
                  game={game}
                  userId={authStore.userId}
                  handleGameInvitation={handleInvitationMutation}
                  handleOnClick={handleGoToGame}
                />
              )}
            />
          )}
          {activeTab === 1 && (
            <List
              emptyText="No pending games"
              items={pendingGames}
              render={(game: TGameListItem) => (
                <GameListItem
                  key={game.id}
                  game={game}
                  userId={authStore.userId}
                  handleGameInvitation={handleInvitationMutation}
                  handleOnClick={handleGoToGame}
                />
              )}
            />
          )}
          {activeTab === 2 && (
            <List
              emptyText="No game history"
              items={finishedGames}
              render={(game: TGameListItem) => (
                <GameListItem
                  key={game.id}
                  game={game}
                  userId={authStore.userId}
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

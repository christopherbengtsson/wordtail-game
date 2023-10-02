import { Button, List } from 'antd';
import { useMainStore } from '../../stores';
import { observer } from 'mobx-react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { TGameListItem } from '../../services';
import { GameListItem } from '../../components';

export const Landing = observer(function Landing() {
  const { gameStore, authStore, modalStore } = useMainStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: response } = useQuery({
    queryKey: ['games'],
    queryFn: () => gameStore.fetchGames(),
    staleTime: 10 * 60 * 1000, // 10 minutes in milliseconds
  });

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

  return (
    <>
      <Button
        type="primary"
        onClick={handleCreateNewGame}
        disabled={createGameMutation.isLoading}
        loading={createGameMutation.isLoading}
      >
        CREATE NEW GAME
      </Button>

      <List
        dataSource={response?.data ?? []}
        locale={{
          emptyText: 'You have no games',
        }}
        renderItem={(game: TGameListItem) => (
          <List.Item>
            <GameListItem
              key={game.id}
              game={game}
              userId={authStore.userId ?? ''}
              handleGameInvitation={handleInvitationMutation}
              handleOnClick={handleGoToGame}
            />
          </List.Item>
        )}
      />
    </>
  );
});

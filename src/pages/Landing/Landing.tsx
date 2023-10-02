import { Avatar, Button, Card, List } from 'antd';
import { useMainStore } from '../../stores';
import { observer } from 'mobx-react';
import { useNavigate } from 'react-router-dom';
import { styled } from 'styled-components';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { GameListItem } from '../../services';

const { Meta } = Card;

export const Landing = observer(function Landing() {
  const { gameStore, authStore } = useMainStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: response } = useQuery({
    queryKey: ['games'],
    queryFn: () => gameStore.fetchGames(),
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
    createGameMutation.mutate({
      name: 'Hard Coded Game',
      players: ['33da3a39-80e5-4dff-a8e2-d95a3cb768e7'],
    });
  };

  const handleCardSubtitle = (game: GameListItem) => {
    if (game.status === 'active') {
      if (game.currentTurnProfileId === authStore.userId) {
        return 'Your turn';
      }
      return `Waiting for ${game.currentTurnUsername ?? 'next player'}`;
    } else if (game.status === 'pending') {
      return 'Waiting for players to accept';
    } else if (game.status === 'abandoned') {
      return 'Not enough users accepted';
    }

    return `${game.winnerUsername ?? 'Anonymous'} won`;
  };

  const handleGoToGame = (game: GameListItem) => {
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
        renderItem={(game: GameListItem) => (
          <List.Item
            onClick={() => {
              handleGoToGame(game);
            }}
          >
            <StyledCard
              hoverable
              title={
                game.waitingForUsers?.includes(authStore?.userId ?? '') &&
                'New invitation!'
              }
              extra={
                game.waitingForUsers?.includes(authStore?.userId ?? '') && (
                  <>
                    <Button
                      type="primary"
                      onClick={() =>
                        handleInvitationMutation.mutate({
                          gameId: game.id,
                          accept: true,
                        })
                      }
                    >
                      Accept
                    </Button>
                    <Button
                      type="link"
                      onClick={() =>
                        handleInvitationMutation.mutate({
                          gameId: game.id,
                          accept: false,
                        })
                      }
                    >
                      Decline
                    </Button>
                  </>
                )
              }
            >
              <Meta
                avatar={
                  <Avatar src="https://xsgames.co/randomusers/avatar.php?g=pixel&key=1" />
                }
                title={game.name ?? 'Nameless game'}
                description={handleCardSubtitle(game)}
              />
            </StyledCard>
          </List.Item>
        )}
      />
    </>
  );
});

const StyledCard = styled(Card)`
  width: 100%;
`;

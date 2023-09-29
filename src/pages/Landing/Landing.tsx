import { Avatar, Button, Card, List } from 'antd';
import { useMainStore } from '../../stores';
import { useEffect } from 'react';
import { observer } from 'mobx-react';
import { useNavigate } from 'react-router-dom';
import { styled } from 'styled-components';

const { Meta } = Card;

export const Landing = observer(function Landing() {
  const { gameStore } = useMainStore();
  const navigate = useNavigate();

  useEffect(() => {
    gameStore.fetchGames();
  }, [gameStore]);

  const handleCreateNewGame = () => {
    // TODO: Mock for now, just to test stored procedure
    gameStore.createGame({
      name: 'Hard Coded Game',
      players: ['b10489e7-30c8-4982-b307-3ea6af96454e'],
    });
  };

  const handleCardSubtitle = (game: object) => {
    if (game.status === 'active') {
      if (game.currentTurnProfileId === store.userId) {
        return 'Your turn';
      }
      return `Waiting for ${game.currentTurnUsername ?? 'next player'}`;
    } else if (game.status === 'pending') {
      return 'Waiting for players to accept';
    }

    return `${game.winnerUsername ?? 'Anonymous'} won`;
  };

  const handleGoToGame = (game: object) => {
    const gameIsActive = game.status === 'active';
    const isUsersTurn = game.currentTurnProfileId === store.userId;

    if (!isUsersTurn || !gameIsActive) {
      // Go to game stats
      console.log('Not implemented: Game stats page');
      return;
    }

    navigate(`/games/${game.id}`);
  };

  return (
    <>
      <Button type="primary" onClick={handleCreateNewGame}>
        CREATE NEW GAME
      </Button>
      <List
        dataSource={gameStore.games ?? []}
        renderItem={(game) => (
          <List.Item
            onClick={() => {
              handleGoToGame(game);
            }}
          >
            <StyledCard hoverable>
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

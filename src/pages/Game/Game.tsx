import { useEffect } from 'react';
import { Layout } from 'antd';
import { observer } from 'mobx-react';
import { useNavigate, useParams } from 'react-router-dom';
import { styled } from 'styled-components';
import { useMainStore } from '../../stores';
import { AnimateLetters } from './AnimateLetters';

const { Content } = Layout;

export const Game = observer(function Game() {
  const { gameId } = useParams();
  const navigate = useNavigate();

  const { gameStore } = useMainStore();

  let game = gameStore.games?.find((game) => game.id === gameId);

  useEffect(() => {
    if (!game) {
      navigate('/');
    }
  }, []);

  return (
    <Layout>
      <StyledContent>
        {game?.lettersSoFar && <AnimateLetters letters={game?.lettersSoFar} />}
      </StyledContent>
    </Layout>
  );
});

const StyledContent = styled(Content)`
  height: 100vh;
  width: 100vw;

  display: flex;
  justify-content: center;
  align-items: center;
`;

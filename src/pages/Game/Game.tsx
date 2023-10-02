import { useEffect } from 'react';
import { Layout } from 'antd';
import { observer } from 'mobx-react';
import { useNavigate, useParams } from 'react-router-dom';
import { styled } from 'styled-components';
import { useMainStore } from '../../stores';
import { AnimateLetters } from './AnimateLetters';
import { useQuery } from '@tanstack/react-query';

const { Content } = Layout;

export const Game = observer(function Game() {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const { gameStore } = useMainStore();

  const { data: response } = useQuery({
    queryKey: ['games', gameId],
    queryFn: () => gameStore.getGameById(gameId!),
    enabled: !!gameId,
  });

  useEffect(() => {
    if (!gameId) {
      navigate('/');
    }
  }, []);

  return (
    <Layout>
      <StyledContent>
        {response?.data?.lettersSoFar && (
          <AnimateLetters letters={response.data.lettersSoFar} />
        )}
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

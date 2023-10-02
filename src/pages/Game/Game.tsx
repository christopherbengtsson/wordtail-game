import { useEffect, useState } from 'react';
import { Button, Form, Input, Layout } from 'antd';
import { observer } from 'mobx-react';
import { useNavigate, useParams } from 'react-router-dom';
import { styled } from 'styled-components';
import { useMainStore } from '../../stores';
import { AnimateLetters } from './AnimateLetters';
import { useQuery } from '@tanstack/react-query';

const { Content } = Layout;

const ANIMATION_DURATION = 1000;

export const Game = observer(function Game() {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const { gameStore } = useMainStore();

  const [animating, setAnimating] = useState(true);

  const { data: response } = useQuery({
    queryKey: ['games', gameId],
    queryFn: () => gameStore.getGameById(gameId!),
    enabled: !!gameId,
  });

  const letters = response?.data?.lettersSoFar;

  useEffect(() => {
    if (!gameId) {
      navigate('/');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (letters?.length) {
      timeout = setTimeout(() => {
        console.log('Animation should be done now');
        setAnimating(false);
      }, letters.length * ANIMATION_DURATION);
    }

    return () => clearTimeout(timeout);
  }, [letters?.length]);

  const onFinish = (letter: string) => {
    if (!letter.length) {
      // TODO: Confirm give up
    }

    // TODO: Send letter to db
  };

  return (
    <Layout>
      <StyledContent>
        {letters?.length && animating ? (
          <AnimateLetters
            letters={letters}
            animationDuration={ANIMATION_DURATION}
          />
        ) : (
          <StyledForm name="game_form" onFinish={onFinish}>
            <Form.Item name="newLetter">
              <StyledInput maxLength={1} />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" size="large">
                Place letter
              </Button>
            </Form.Item>
          </StyledForm>
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

const StyledForm = styled(Form)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const StyledInput = styled(Input)`
  width: 100px;
  height: 100px;
  text-align: center;
  font-size: 4rem;
`;

import { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import { useNavigate, useParams, unstable_usePrompt } from 'react-router-dom';
import { styled } from 'styled-components';
import { useMainStore } from '../../stores';
import { AnimateLetters } from './AnimateLetters';
import { useQuery } from '@tanstack/react-query';
import { Button, Input } from '../../components';

const ANIMATION_DURATION = 1000;

export const Game = observer(function Game() {
  unstable_usePrompt({
    when: true,
    message: 'TODO: unstable_useBlocker with custom dialog?',
  });

  const { gameId } = useParams();
  const navigate = useNavigate();

  const { gameStore } = useMainStore();

  const [animating, setAnimating] = useState(true);
  const [newLetter, setNewLetter] = useState('');

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

  const onFinish = () => {
    if (!newLetter.length) {
      // TODO: Confirm give up
    }

    // TODO: Send letter to db
  };

  // TODO: Don't show input if there's no response yet
  return (
    <StyledContainer>
      {letters?.length && animating ? (
        <AnimateLetters
          letters={letters}
          animationDuration={ANIMATION_DURATION}
        />
      ) : (
        <StyledForm>
          <StyledInput
            className="letterInput"
            autoFocus
            maxLength={1}
            value={newLetter}
            onChange={(ev) => {
              setNewLetter(ev.target.value.toUpperCase());
            }}
          />
          <Button primary size="lg" onClick={() => onFinish()}>
            Place letter
          </Button>
        </StyledForm>
      )}
    </StyledContainer>
  );
});

const StyledContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1 1 auto;
`;

const StyledForm = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: ${(p) => p.theme.spacing.m};

  & .letterInput {
    height: 100px;
    input {
      width: 100px;
      height: 100px;
      text-align: center;
      font-size: 4rem;
    }
  }
`;

const StyledInput = styled(Input)``;
